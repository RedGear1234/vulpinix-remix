const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const axios = require('axios');
const User = require('../models/user');

/**
 * GET /api/ads/meta
 * Fetches Facebook Ads Manager + Instagram Ads performance data
 * using the Meta Marketing API (act_<account_id>/insights)
 *
 * Required permission: ads_read (requested via Meta App Review)
 * Falls back to campaign-level organic data if no ad account is linked.
 */
router.get('/meta', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let user = null;
    if (userId.includes('@')) {
      user = await User.findOne({ email: userId });
    } else {
      try { user = await User.findById(userId); } catch (e) {}
    }
    if (!user) return res.status(404).json({ error: 'User not found' });

    const ig = user.socialAccounts?.instagram;
    const fb = user.socialAccounts?.facebook;
    const token = ig?.pageAccessToken || ig?.accessToken || fb?.pageAccessToken || fb?.accessToken;

    if (!token) {
      return res.status(400).json({ error: 'NOT_CONNECTED', details: 'No Facebook/Instagram account connected.' });
    }

    // ── Step 1: Discover ad accounts accessible with this token ──────────────
    let adAccounts = [];
    try {
      const adAccountsRes = await axios.get('https://graph.facebook.com/v18.0/me/adaccounts', {
        params: {
          fields: 'id,name,currency,account_status,spend_cap,amount_spent',
          access_token: token
        }
      });
      adAccounts = adAccountsRes.data?.data || [];
      console.log(`[ADS] Found ${adAccounts.length} ad account(s)`);
    } catch (err) {
      console.warn('[ADS] Could not fetch ad accounts:', err.response?.data?.error?.message || err.message);
    }

    if (adAccounts.length === 0) {
      return res.status(200).json({
        success: true,
        hasAdAccount: false,
        message: 'No ad account found. Connect a Facebook Ads account to see paid ad metrics.',
        adAccounts: [],
        summary: null,
        campaigns: [],
        adsets: [],
        topAds: []
      });
    }

    const primaryAccount = adAccounts[0];
    const actId = primaryAccount.id; // e.g. "act_123456789"

    // ── Step 2: Fetch account-level insights (last 30 days) ──────────────────
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const until = new Date().toISOString().split('T')[0];

    let accountInsights = {};
    try {
      const insRes = await axios.get(`https://graph.facebook.com/v18.0/${actId}/insights`, {
        params: {
          fields: 'impressions,reach,clicks,spend,cpc,cpm,ctr,conversions,actions',
          date_preset: 'last_30d',
          access_token: token
        }
      });
      accountInsights = insRes.data?.data?.[0] || {};
      console.log('[ADS] ✅ Account-level insights fetched');
    } catch (err) {
      console.warn('[ADS] Account insights failed:', err.response?.data?.error?.message || err.message);
    }

    // ── Step 3: Fetch campaigns ───────────────────────────────────────────────
    let campaigns = [];
    try {
      const campRes = await axios.get(`https://graph.facebook.com/v18.0/${actId}/campaigns`, {
        params: {
          fields: 'id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time',
          limit: 20,
          access_token: token
        }
      });
      const rawCampaigns = campRes.data?.data || [];

      // Fetch per-campaign insights
      campaigns = await Promise.all(rawCampaigns.map(async (camp) => {
        let ins = {};
        try {
          const cInsRes = await axios.get(`https://graph.facebook.com/v18.0/${camp.id}/insights`, {
            params: {
              fields: 'impressions,reach,clicks,spend,cpc,cpm,ctr,actions',
              date_preset: 'last_30d',
              access_token: token
            }
          });
          ins = cInsRes.data?.data?.[0] || {};
        } catch {}

        const conversions = (ins.actions || []).find(a => a.action_type === 'offsite_conversion.fb_pixel_purchase')?.value || 0;

        return {
          id: camp.id,
          name: camp.name,
          status: camp.status,
          objective: camp.objective,
          dailyBudget: camp.daily_budget ? (parseInt(camp.daily_budget) / 100).toFixed(2) : null,
          lifetimeBudget: camp.lifetime_budget ? (parseInt(camp.lifetime_budget) / 100).toFixed(2) : null,
          startTime: camp.start_time,
          stopTime: camp.stop_time,
          impressions: parseInt(ins.impressions || 0),
          reach: parseInt(ins.reach || 0),
          clicks: parseInt(ins.clicks || 0),
          spend: parseFloat(ins.spend || 0).toFixed(2),
          cpc: parseFloat(ins.cpc || 0).toFixed(2),
          cpm: parseFloat(ins.cpm || 0).toFixed(2),
          ctr: parseFloat(ins.ctr || 0).toFixed(2),
          conversions: parseInt(conversions),
        };
      }));
      console.log(`[ADS] ✅ Fetched ${campaigns.length} campaigns with insights`);
    } catch (err) {
      console.warn('[ADS] Campaigns fetch failed:', err.response?.data?.error?.message || err.message);
    }

    // ── Step 4: Fetch top ads (creative level) ───────────────────────────────
    let topAds = [];
    try {
      const adsRes = await axios.get(`https://graph.facebook.com/v18.0/${actId}/ads`, {
        params: {
          fields: 'id,name,status,creative{id,name,thumbnail_url,image_url,body,title}',
          limit: 10,
          access_token: token
        }
      });
      const rawAds = adsRes.data?.data || [];

      topAds = await Promise.all(rawAds.map(async (ad) => {
        let ins = {};
        try {
          const adInsRes = await axios.get(`https://graph.facebook.com/v18.0/${ad.id}/insights`, {
            params: {
              fields: 'impressions,clicks,spend,ctr,actions',
              date_preset: 'last_30d',
              access_token: token
            }
          });
          ins = adInsRes.data?.data?.[0] || {};
        } catch {}

        return {
          id: ad.id,
          name: ad.name,
          status: ad.status,
          thumbnailUrl: ad.creative?.thumbnail_url || ad.creative?.image_url || null,
          headline: ad.creative?.title || ad.name,
          body: ad.creative?.body || '',
          impressions: parseInt(ins.impressions || 0),
          clicks: parseInt(ins.clicks || 0),
          spend: parseFloat(ins.spend || 0).toFixed(2),
          ctr: parseFloat(ins.ctr || 0).toFixed(2),
        };
      }));
    } catch (err) {
      console.warn('[ADS] Top ads fetch failed:', err.response?.data?.error?.message || err.message);
    }

    // ── Aggregate summary ────────────────────────────────────────────────────
    const totalConversions = campaigns.reduce((s, c) => s + c.conversions, 0);
    const totalSpend = campaigns.reduce((s, c) => s + parseFloat(c.spend), 0);
    const totalImpressions = parseInt(accountInsights.impressions || campaigns.reduce((s, c) => s + c.impressions, 0));
    const totalReach = parseInt(accountInsights.reach || campaigns.reduce((s, c) => s + c.reach, 0));
    const totalClicks = parseInt(accountInsights.clicks || campaigns.reduce((s, c) => s + c.clicks, 0));

    res.json({
      success: true,
      hasAdAccount: true,
      adAccounts: adAccounts.map(a => ({
        id: a.id,
        name: a.name,
        currency: a.currency,
        status: a.account_status,
        amountSpent: a.amount_spent ? (parseInt(a.amount_spent) / 100).toFixed(2) : '0.00'
      })),
      summary: {
        impressions: totalImpressions,
        reach: totalReach,
        clicks: totalClicks,
        spend: totalSpend.toFixed(2),
        conversions: totalConversions,
        cpc: accountInsights.cpc ? parseFloat(accountInsights.cpc).toFixed(2) : totalClicks > 0 ? (totalSpend / totalClicks).toFixed(2) : '0.00',
        cpm: accountInsights.cpm ? parseFloat(accountInsights.cpm).toFixed(2) : totalImpressions > 0 ? ((totalSpend / totalImpressions) * 1000).toFixed(2) : '0.00',
        ctr: accountInsights.ctr ? parseFloat(accountInsights.ctr).toFixed(2) : totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00',
        currency: adAccounts[0]?.currency || 'USD',
        activeCampaigns: campaigns.filter(c => c.status === 'ACTIVE').length,
        totalCampaigns: campaigns.length,
      },
      campaigns,
      topAds
    });

  } catch (err) {
    console.error('❌ [ADS] Error:', err.response?.data || err.message);
    const code = err.response?.data?.error?.code;
    const msg = err.response?.data?.error?.message || '';
    if (code === 190 || code === 102 || msg.toLowerCase().includes('token')) {
      return res.status(400).json({ error: 'NOT_CONNECTED', details: 'Meta token expired. Please reconnect.' });
    }
    res.status(500).json({ error: 'Failed to fetch ads data', details: msg || err.message });
  }
});

module.exports = router;
