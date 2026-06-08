/**
 * meta_insights_test.js
 * Run: node meta_insights_test.js
 * 
 * This script makes the exact API call required by Meta App Review
 * for instagram_business_manage_insights permission.
 * 
 * It will print:
 *   1. Your IG Business Account ID
 *   2. The insights API response (which registers the test call in Meta's dashboard)
 */

require('dotenv').config();
const axios = require('axios');

// ── CONFIG ────────────────────────────────────────────────────────────────────
// Paste your values here OR set them in your .env file
const ACCESS_TOKEN = process.env.IG_TEST_ACCESS_TOKEN || 'PASTE_YOUR_PAGE_ACCESS_TOKEN_HERE';
const IG_ACCOUNT_ID = process.env.IG_TEST_ACCOUNT_ID || 'PASTE_YOUR_IG_BUSINESS_ACCOUNT_ID_HERE';
// ─────────────────────────────────────────────────────────────────────────────

if (!ACCESS_TOKEN || ACCESS_TOKEN === 'PASTE_YOUR_PAGE_ACCESS_TOKEN_HERE') {
  console.error('\n❌ ERROR: Please set ACCESS_TOKEN and IG_ACCOUNT_ID in this file or in your .env\n');
  console.log('To find these values, run: node debugInstagram.js\n');
  process.exit(1);
}

async function runInsightsTest() {
  console.log('\n🔍 Vulpinix — Meta App Review: instagram_business_manage_insights Test');
  console.log('='.repeat(70));

  // ── 1. Account-level insights (the required call for instagram_business_manage_insights) ──
  console.log('\n[1/3] Calling GET /{ig-user-id}/insights (account-level, metric_type=total_value)...');
  console.log(`      Endpoint: https://graph.facebook.com/v21.0/${IG_ACCOUNT_ID}/insights`);
  try {
    const r1 = await axios.get(`https://graph.facebook.com/v21.0/${IG_ACCOUNT_ID}/insights`, {
      params: {
        metric: 'reach,impressions,profile_views,accounts_engaged,total_interactions',
        metric_type: 'total_value',
        period: 'day',
        since: Math.floor(Date.now() / 1000) - 30 * 86400,
        until: Math.floor(Date.now() / 1000),
        access_token: ACCESS_TOKEN
      }
    });
    console.log('      ✅ SUCCESS — account-level insights received:');
    (r1.data?.data || []).forEach(m => {
      console.log(`         ${m.name}: ${m.total_value?.value ?? 'N/A'}`);
    });
  } catch (e) {
    console.error('      ❌ FAILED:', e.response?.data?.error?.message || e.message);
    if (e.response?.data?.error?.code === 10) {
      console.log('      ℹ️  Error 10 = Permission denied. Make sure instagram_business_manage_insights');
      console.log('         is added to your app AND the test user has accepted the permission.');
    }
  }

  // ── 2. Fetch media list ────────────────────────────────────────────────────
  console.log('\n[2/3] Calling GET /{ig-user-id}/media to get a post ID...');
  let mediaId = null;
  let mediaType = 'IMAGE';
  try {
    const r2 = await axios.get(`https://graph.facebook.com/v21.0/${IG_ACCOUNT_ID}/media`, {
      params: {
        fields: 'id,media_type,timestamp',
        limit: 1,
        access_token: ACCESS_TOKEN
      }
    });
    const first = r2.data?.data?.[0];
    if (first) {
      mediaId = first.id;
      mediaType = first.media_type || 'IMAGE';
      console.log(`      ✅ Got media ID: ${mediaId} (type: ${mediaType})`);
    } else {
      console.log('      ⚠️  No media found on this account. Skipping per-post test.');
    }
  } catch (e) {
    console.error('      ❌ FAILED:', e.response?.data?.error?.message || e.message);
  }

  // ── 3. Per-post insights ───────────────────────────────────────────────────
  if (mediaId) {
    console.log(`\n[3/3] Calling GET /{ig-media-id}/insights for post ${mediaId}...`);
    const isVideo = mediaType === 'VIDEO' || mediaType === 'REELS';
    const metric = isVideo
      ? 'likes,comments,shares,saved,reach,impressions,plays,total_interactions'
      : 'likes,comments,shares,saved,reach,impressions,total_interactions';

    try {
      const r3 = await axios.get(`https://graph.facebook.com/v21.0/${mediaId}/insights`, {
        params: { metric, access_token: ACCESS_TOKEN }
      });
      console.log('      ✅ SUCCESS — per-post insights received:');
      (r3.data?.data || []).forEach(m => {
        const val = m.values?.[0]?.value ?? m.value ?? m.total_value?.value ?? 'N/A';
        console.log(`         ${m.name}: ${val}`);
      });
    } catch (e) {
      console.error('      ❌ FAILED:', e.response?.data?.error?.message || e.message);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ Test complete. Now go back to Meta App Review → Testing and wait up to');
  console.log('   24 hours for the counter to update from "0 of 1" to "1 of 1".\n');
  console.log('If still 0 after 24h, use the Meta Graph API Explorer instead:');
  console.log('   https://developers.facebook.com/tools/explorer/');
  console.log(`   GET /${IG_ACCOUNT_ID}/insights?metric=reach,impressions&metric_type=total_value&period=day&access_token=<YOUR_TOKEN>\n`);
}

runInsightsTest();
