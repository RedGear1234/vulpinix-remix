const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const axios = require('axios');
const User = require('../models/user');

/**
 * Helper: resolve user from JWT
 */
async function resolveUser(req) {
  const userId = req.user?.id || req.user?._id || req.query.userId;
  if (!userId) return null;
  if (userId.includes('@')) return await User.findOne({ email: userId });
  try { return await User.findById(userId); } catch { return null; }
}

/**
 * GET /api/branded-content/posts
 * Fetches Instagram posts where the connected account is tagged as a paid partner
 * (branded_content_sponsor_relationships field on each media object).
 * Also fetches posts eligible to be used as Partnership Ads.
 *
 * Required permission: instagram_branded_content_ads_brand  OR  instagram_branded_content_brand
 */
router.get('/posts', requireAuth, async (req, res) => {
  try {
    const user = await resolveUser(req);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const ig = user.socialAccounts?.instagram;
    if (!ig?.igAccountId) return res.status(400).json({ error: 'NOT_CONNECTED', details: 'Instagram not connected' });

    const token = ig.pageAccessToken || ig.accessToken;
    if (!token) return res.status(400).json({ error: 'NOT_CONNECTED', details: 'Instagram token missing' });

    const igId = ig.igAccountId;

    // ── 1. Fetch recent media with branded content fields ──────────────────────
    let allMedia = [];
    try {
      const mediaRes = await axios.get(`https://graph.facebook.com/v21.0/${igId}/media`, {
        params: {
          fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,branded_content_sponsor_relationships',
          limit: 20,
          access_token: token
        }
      });
      allMedia = mediaRes.data?.data || [];
      console.log(`[BRANDED] ✅ Fetched ${allMedia.length} media items`);
    } catch (err) {
      console.warn('[BRANDED] Media fetch failed:', err.response?.data?.error?.message || err.message);
    }

    // Separate branded posts from regular posts
    const brandedPosts = allMedia.filter(m =>
      m.branded_content_sponsor_relationships?.data?.length > 0
    );
    const regularPosts = allMedia.filter(m =>
      !m.branded_content_sponsor_relationships?.data?.length
    );

    // ── 2. Fetch posts eligible for Partnership Ads ────────────────────────────
    let partnershipEligible = [];
    try {
      const eligRes = await axios.get(`https://graph.facebook.com/v21.0/${igId}/branded_content_advertisable_medias`, {
        params: { fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp', access_token: token }
      });
      partnershipEligible = eligRes.data?.data || [];
      console.log(`[BRANDED] ✅ Partnership eligible: ${partnershipEligible.length} posts`);
    } catch (err) {
      console.warn('[BRANDED] Partnership eligible fetch failed (permission may not be approved yet):', err.response?.data?.error?.message || err.message);
    }

    // ── 3. Check pending brand permissions ────────────────────────────────────
    let pendingPermissions = [];
    try {
      const pendingRes = await axios.get(`https://graph.facebook.com/v21.0/${igId}/branded_content_tag_approval`, {
        params: { access_token: token }
      });
      pendingPermissions = pendingRes.data?.data || [];
    } catch (err) {
      console.warn('[BRANDED] Pending permissions fetch failed:', err.response?.data?.error?.message || err.message);
    }

    const normalize = (m) => ({
      id: m.id,
      caption: m.caption ? m.caption.slice(0, 200) + (m.caption.length > 200 ? '…' : '') : '',
      mediaType: m.media_type || 'IMAGE',
      mediaUrl: m.media_url || m.thumbnail_url || null,
      permalink: m.permalink || null,
      timestamp: m.timestamp || null,
      likeCount: m.like_count || 0,
      commentsCount: m.comments_count || 0,
      sponsors: (m.branded_content_sponsor_relationships?.data || []).map(s => ({
        id: s.id,
        name: s.name || 'Brand Partner'
      }))
    });

    res.json({
      success: true,
      igAccountId: igId,
      username: ig.username || null,
      totalMedia: allMedia.length,
      brandedPosts: brandedPosts.map(normalize),
      regularPosts: regularPosts.slice(0, 6).map(normalize),
      partnershipEligible: partnershipEligible.map(normalize),
      pendingPermissions,
      stats: {
        totalBranded: brandedPosts.length,
        totalEligible: partnershipEligible.length,
        pendingApprovals: pendingPermissions.length
      }
    });

  } catch (err) {
    console.error('❌ [BRANDED] Error:', err.response?.data || err.message);
    const code = err.response?.data?.error?.code;
    const msg = err.response?.data?.error?.message || '';
    if (code === 190 || code === 102 || msg.toLowerCase().includes('token')) {
      return res.status(400).json({ error: 'NOT_CONNECTED', details: 'Instagram token expired. Please reconnect.' });
    }
    res.status(500).json({ error: 'Failed to fetch branded content', details: msg || err.message });
  }
});

/**
 * POST /api/branded-content/approve/:mediaId
 * Approves a brand to tag this account in branded content (Partnership Ads permission)
 *
 * Required permission: instagram_branded_content_ads_brand
 */
router.post('/approve/:brandId', requireAuth, async (req, res) => {
  try {
    const user = await resolveUser(req);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const ig = user.socialAccounts?.instagram;
    if (!ig?.igAccountId) return res.status(400).json({ error: 'Instagram not connected' });

    const token = ig.pageAccessToken || ig.accessToken;
    const { brandId } = req.params;

    console.log(`[BRANDED] Approving brand ${brandId} for Partnership Ads...`);
    const approveRes = await axios.post(
      `https://graph.facebook.com/v21.0/${ig.igAccountId}/branded_content_ads_approval`,
      { permitted_tasks: ['ADVERTISE'], business_id: brandId, access_token: token }
    );

    res.json({ success: true, result: approveRes.data });
  } catch (err) {
    console.error('❌ [BRANDED APPROVE] Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to approve partnership', details: err.response?.data?.error?.message || err.message });
  }
});

/**
 * DELETE /api/branded-content/revoke/:brandId
 * Revokes a brand's permission to use this account in Partnership Ads
 */
router.delete('/revoke/:brandId', requireAuth, async (req, res) => {
  try {
    const user = await resolveUser(req);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const ig = user.socialAccounts?.instagram;
    if (!ig?.igAccountId) return res.status(400).json({ error: 'Instagram not connected' });

    const token = ig.pageAccessToken || ig.accessToken;
    const { brandId } = req.params;

    console.log(`[BRANDED] Revoking brand ${brandId} Partnership Ads permission...`);
    const revokeRes = await axios.delete(
      `https://graph.facebook.com/v21.0/${ig.igAccountId}/branded_content_ads_approval`,
      { params: { business_id: brandId, access_token: token } }
    );

    res.json({ success: true, result: revokeRes.data });
  } catch (err) {
    console.error('❌ [BRANDED REVOKE] Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to revoke partnership', details: err.response?.data?.error?.message || err.message });
  }
});

module.exports = router;
