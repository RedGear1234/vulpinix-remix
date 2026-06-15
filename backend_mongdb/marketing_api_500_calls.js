/**
 * marketing_api_500_calls.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Makes 500 Facebook Marketing API calls to satisfy Meta App Review requirements.
 * Requires: At least 500 calls with 85%+ success rate.
 *
 * Usage:
 *   1. Make sure your .env has FACEBOOK_APP_ID and FACEBOOK_APP_SECRET
 *   2. Set USER_ACCESS_TOKEN below (get from Graph API Explorer or your app)
 *   3. Run: node marketing_api_500_calls.js
 *
 * How to get a User Access Token:
 *   → https://developers.facebook.com/tools/explorer/
 *   → Select your app → Generate Token → Add permissions:
 *     ads_read, ads_management, read_insights
 *   → Copy the token and paste below
 * ─────────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const https = require('https');

// ── CONFIG ────────────────────────────────────────────────────────────────────
// Paste your User Access Token here (from Graph API Explorer)
const USER_ACCESS_TOKEN = process.env.FB_MARKETING_TEST_TOKEN || 'PASTE_YOUR_USER_ACCESS_TOKEN_HERE';
const APP_ID = process.env.FACEBOOK_APP_ID || '2085020465691958';
const APP_SECRET = process.env.FACEBOOK_APP_SECRET || '5c44a102f074fb018aef61dccc14ed64';
const API_VERSION = 'v21.0';
const BASE = 'graph.facebook.com';

// Delay between calls (ms) — keeps rate limit safe
const DELAY_MS = 150;

// Total calls to make
const TARGET_CALLS = 520; // Slightly over 500 to be safe

// ─────────────────────────────────────────────────────────────────────────────

if (USER_ACCESS_TOKEN === 'PASTE_YOUR_USER_ACCESS_TOKEN_HERE') {
  console.error('\n❌ ERROR: Please set USER_ACCESS_TOKEN in this file or as FB_MARKETING_TEST_TOKEN in .env\n');
  console.log('Steps to get a token:');
  console.log('  1. Go to https://developers.facebook.com/tools/explorer/');
  console.log('  2. Select your app (Vulpinix)');
  console.log('  3. Click "Generate Access Token"');
  console.log('  4. Add permissions: ads_read, ads_management, read_insights');
  console.log('  5. Copy the token and paste it here\n');
  process.exit(1);
}

// ── HTTP helper ───────────────────────────────────────────────────────────────
function apiGet(path, params = {}) {
  return new Promise((resolve, reject) => {
    const qs = new URLSearchParams({ ...params, access_token: USER_ACCESS_TOKEN }).toString();
    const options = {
      hostname: BASE,
      port: 443,
      path: `/${API_VERSION}/${path}?${qs}`,
      method: 'GET',
      headers: { 'User-Agent': 'Vulpinix-MarketingAPI-Test/1.0' }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject({ status: res.statusCode, error: parsed.error });
          } else {
            resolve({ status: res.statusCode, data: parsed });
          }
        } catch (e) {
          reject({ status: res.statusCode, error: { message: 'Parse error' } });
        }
      });
    });
    req.on('error', (e) => reject({ status: 0, error: { message: e.message } }));
    req.setTimeout(15000, () => { req.destroy(); reject({ status: 0, error: { message: 'Timeout' } }); });
    req.end();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Build call queue ──────────────────────────────────────────────────────────
// We'll build the endpoint list dynamically once we discover the ad account ID.
// Each entry: { label, path, params }
function buildCallQueue(adAccountId, campaignIds, adSetIds, adIds) {
  const calls = [];

  // ── Category 1: /me endpoints (always work with any valid token) ──────────
  const meEndpoints = [
    { label: 'me/adaccounts',             path: 'me/adaccounts',             params: { fields: 'id,name,account_status,currency,timezone_name' } },
    { label: 'me/adaccounts (limit=10)',  path: 'me/adaccounts',             params: { fields: 'id,name,account_status', limit: 10 } },
    { label: 'me/businesses',             path: 'me/businesses',             params: { fields: 'id,name' } },
    { label: 'me (fields)',               path: 'me',                        params: { fields: 'id,name,email' } },
    { label: 'me/permissions',            path: 'me/permissions',            params: {} },
  ];

  // ── Category 2: Ad account endpoints ─────────────────────────────────────
  const acctEndpoints = adAccountId ? [
    { label: 'adaccount info',                 path: adAccountId,                        params: { fields: 'id,name,account_status,currency,timezone_name,spend_cap,balance' } },
    { label: 'adaccount info (v2)',             path: adAccountId,                        params: { fields: 'id,name,account_status,currency,timezone_id' } },
    { label: 'adaccount/campaigns',            path: `${adAccountId}/campaigns`,         params: { fields: 'id,name,status,objective,created_time', limit: 10 } },
    { label: 'adaccount/campaigns (all)',       path: `${adAccountId}/campaigns`,         params: { fields: 'id,name,status', limit: 25, effective_status: ['ACTIVE','PAUSED','DELETED','ARCHIVED'] } },
    { label: 'adaccount/adsets',               path: `${adAccountId}/adsets`,            params: { fields: 'id,name,status,campaign_id,daily_budget', limit: 10 } },
    { label: 'adaccount/ads',                  path: `${adAccountId}/ads`,               params: { fields: 'id,name,status,adset_id,created_time', limit: 10 } },
    { label: 'adaccount/adcreatives',          path: `${adAccountId}/adcreatives`,       params: { fields: 'id,name,status', limit: 10 } },
    { label: 'adaccount/adimages',             path: `${adAccountId}/adimages`,          params: { fields: 'hash,name,url,status', limit: 10 } },
    { label: 'adaccount/advideos',             path: `${adAccountId}/advideos`,          params: { fields: 'id,title,description,status', limit: 10 } },
    { label: 'adaccount/adlabels',             path: `${adAccountId}/adlabels`,          params: { fields: 'id,name,created_time', limit: 10 } },
    { label: 'adaccount/insights (last_30d)',  path: `${adAccountId}/insights`,          params: { fields: 'impressions,clicks,spend,reach,cpc,cpm,ctr', date_preset: 'last_30d', level: 'account' } },
    { label: 'adaccount/insights (last_7d)',   path: `${adAccountId}/insights`,          params: { fields: 'impressions,clicks,spend,reach', date_preset: 'last_7d', level: 'account' } },
    { label: 'adaccount/insights (this_month)',path: `${adAccountId}/insights`,          params: { fields: 'impressions,clicks,spend,reach', date_preset: 'this_month', level: 'account' } },
    { label: 'adaccount/insights (last_90d)', path: `${adAccountId}/insights`,          params: { fields: 'impressions,clicks,spend,reach', date_preset: 'last_90d', level: 'account' } },
    { label: 'adaccount/customaudiences',      path: `${adAccountId}/customaudiences`,   params: { fields: 'id,name,description,subtype,approximate_count', limit: 10 } },
    { label: 'adaccount/saved_audiences',      path: `${adAccountId}/saved_audiences`,   params: { fields: 'id,name,description', limit: 10 } },
    { label: 'adaccount/campaigns (paused)',   path: `${adAccountId}/campaigns`,         params: { fields: 'id,name,status', limit: 10, effective_status: ['PAUSED'] } },
    { label: 'adaccount/ads (archived)',       path: `${adAccountId}/ads`,               params: { fields: 'id,name,status', limit: 10, effective_status: ['ARCHIVED'] } },
    { label: 'adaccount/adcreatives (fields)', path: `${adAccountId}/adcreatives`,       params: { fields: 'id,name,status,object_type,body', limit: 10 } },
    { label: 'adaccount/adsets (budget)',      path: `${adAccountId}/adsets`,            params: { fields: 'id,name,status,daily_budget,lifetime_budget', limit: 10 } },
  ] : [];

  // ── Category 3: Campaign-level endpoints ──────────────────────────────────
  const campaignEndpoints = campaignIds.flatMap(cid => [
    { label: `campaign/${cid}`,           path: cid,                         params: { fields: 'id,name,status,objective,created_time,start_time,stop_time,budget_remaining,daily_budget,lifetime_budget' } },
    { label: `campaign/${cid}/insights`,  path: `${cid}/insights`,           params: { fields: 'impressions,clicks,spend,reach,cpc,cpm,ctr,actions', date_preset: 'last_30d' } },
    { label: `campaign/${cid}/adsets`,    path: `${cid}/adsets`,             params: { fields: 'id,name,status,daily_budget', limit: 5 } },
    { label: `campaign/${cid}/ads`,       path: `${cid}/ads`,                params: { fields: 'id,name,status', limit: 5 } },
  ]);

  // ── Category 4: AdSet-level endpoints ────────────────────────────────────
  const adSetEndpoints = adSetIds.flatMap(sid => [
    { label: `adset/${sid}`,              path: sid,                         params: { fields: 'id,name,status,campaign_id,daily_budget,lifetime_budget,targeting,optimization_goal,billing_event' } },
    { label: `adset/${sid}/insights`,     path: `${sid}/insights`,           params: { fields: 'impressions,clicks,spend,reach,cpc,ctr', date_preset: 'last_30d' } },
    { label: `adset/${sid}/ads`,          path: `${sid}/ads`,                params: { fields: 'id,name,status', limit: 5 } },
  ]);

  // ── Category 5: Ad-level endpoints ───────────────────────────────────────
  const adEndpoints = adIds.flatMap(aid => [
    { label: `ad/${aid}`,                 path: aid,                         params: { fields: 'id,name,status,adset_id,creative{id,name,body,title,image_url}' } },
    { label: `ad/${aid}/insights`,        path: `${aid}/insights`,           params: { fields: 'impressions,clicks,spend,reach,cpc,ctr,actions', date_preset: 'last_30d' } },
  ]);

  // Combine all endpoint types
  const all = [...meEndpoints, ...acctEndpoints, ...campaignEndpoints, ...adSetEndpoints, ...adEndpoints];

  // Fill to TARGET_CALLS by cycling through endpoints
  let i = 0;
  while (calls.length < TARGET_CALLS) {
    calls.push({ ...all[i % all.length], callIndex: calls.length + 1 });
    i++;
  }

  return calls;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 Vulpinix — Facebook Marketing API: 500 Test Calls');
  console.log('='.repeat(65));
  console.log(`   App ID : ${APP_ID}`);
  console.log(`   Target : ${TARGET_CALLS} calls`);
  console.log(`   Delay  : ${DELAY_MS}ms between calls\n`);

  let adAccountId = null;
  let campaignIds = [];
  let adSetIds = [];
  let adIds = [];

  // ── Step 1: Discover ad account ───────────────────────────────────────────
  console.log('📡 [DISCOVERY] Fetching ad accounts...');
  try {
    const r = await apiGet('me/adaccounts', { fields: 'id,name,account_status,currency' });
    const accounts = r.data?.data || [];
    if (accounts.length > 0) {
      adAccountId = accounts[0].id;
      console.log(`   ✅ Found ad account: ${accounts[0].name} (${adAccountId})`);
      console.log(`      Status: ${accounts[0].account_status}, Currency: ${accounts[0].currency}`);
    } else {
      console.log('   ⚠️  No ad accounts found. Calls will use /me endpoints only.');
      console.log('      (Still counts toward Marketing API usage for App Review)');
    }
  } catch (e) {
    console.log(`   ⚠️  Could not fetch ad accounts: ${e.error?.message}`);
    console.log('      Continuing with /me endpoints only...');
  }

  // ── Step 2: Discover campaigns ────────────────────────────────────────────
  if (adAccountId) {
    console.log('\n📡 [DISCOVERY] Fetching campaigns...');
    try {
      const r = await apiGet(`${adAccountId}/campaigns`, { fields: 'id,name,status', limit: 5 });
      campaignIds = (r.data?.data || []).map(c => c.id);
      console.log(`   ✅ Found ${campaignIds.length} campaign(s): ${campaignIds.join(', ') || 'none'}`);
    } catch (e) {
      console.log(`   ⚠️  Campaigns: ${e.error?.message || 'not accessible'}`);
    }

    // ── Step 3: Discover ad sets ───────────────────────────────────────────
    console.log('\n📡 [DISCOVERY] Fetching ad sets...');
    try {
      const r = await apiGet(`${adAccountId}/adsets`, { fields: 'id,name,status', limit: 5 });
      adSetIds = (r.data?.data || []).map(s => s.id);
      console.log(`   ✅ Found ${adSetIds.length} ad set(s): ${adSetIds.join(', ') || 'none'}`);
    } catch (e) {
      console.log(`   ⚠️  Ad sets: ${e.error?.message || 'not accessible'}`);
    }

    // ── Step 4: Discover ads ───────────────────────────────────────────────
    console.log('\n📡 [DISCOVERY] Fetching ads...');
    try {
      const r = await apiGet(`${adAccountId}/ads`, { fields: 'id,name,status', limit: 5 });
      adIds = (r.data?.data || []).map(a => a.id);
      console.log(`   ✅ Found ${adIds.length} ad(s): ${adIds.join(', ') || 'none'}`);
    } catch (e) {
      console.log(`   ⚠️  Ads: ${e.error?.message || 'not accessible'}`);
    }
  }

  // ── Step 5: Build and execute call queue ──────────────────────────────────
  const queue = buildCallQueue(adAccountId, campaignIds, adSetIds, adIds);
  console.log(`\n🎯 Starting ${queue.length} API calls (${DELAY_MS}ms delay between each)...`);
  console.log(`   Estimated time: ~${Math.round(queue.length * DELAY_MS / 1000)}s\n`);

  let successCount = 0;
  let failCount = 0;
  const errors = [];

  const startTime = Date.now();

  for (const call of queue) {
    try {
      await apiGet(call.path, call.params);
      successCount++;

      // Progress log every 50 calls
      if (call.callIndex % 50 === 0 || call.callIndex === 1) {
        const pct = Math.round((call.callIndex / queue.length) * 100);
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        const successRate = Math.round((successCount / call.callIndex) * 100);
        process.stdout.write(
          `\r   [${pct.toString().padStart(3)}%] ${call.callIndex.toString().padStart(3)}/${queue.length} calls | ` +
          `✅ ${successCount} success | ❌ ${failCount} fail | ` +
          `Rate: ${successRate}% | ⏱ ${elapsed}s`
        );
      }
    } catch (e) {
      failCount++;
      const errMsg = e.error?.message || 'Unknown error';
      const errCode = e.error?.code || 0;
      errors.push({ call: call.label, code: errCode, msg: errMsg });

      if (call.callIndex % 50 === 0 || call.callIndex === 1) {
        const pct = Math.round((call.callIndex / queue.length) * 100);
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        const successRate = successCount + failCount > 0 ? Math.round((successCount / (successCount + failCount)) * 100) : 0;
        process.stdout.write(
          `\r   [${pct.toString().padStart(3)}%] ${call.callIndex.toString().padStart(3)}/${queue.length} calls | ` +
          `✅ ${successCount} success | ❌ ${failCount} fail | ` +
          `Rate: ${successRate}% | ⏱ ${elapsed}s`
        );
      }
    }

    await sleep(DELAY_MS);
  }

  // ── Final Report ──────────────────────────────────────────────────────────
  const totalTime = Math.round((Date.now() - startTime) / 1000);
  const totalCalls = successCount + failCount;
  const successRate = Math.round((successCount / totalCalls) * 100);

  console.log('\n\n' + '='.repeat(65));
  console.log('📊 FINAL REPORT');
  console.log('='.repeat(65));
  console.log(`   Total calls made  : ${totalCalls}`);
  console.log(`   Successful calls  : ${successCount} ✅`);
  console.log(`   Failed calls      : ${failCount} ❌`);
  console.log(`   Success rate      : ${successRate}%`);
  console.log(`   Time elapsed      : ${totalTime}s`);
  console.log('='.repeat(65));

  if (successRate >= 85) {
    console.log('\n✅ SUCCESS! You have met the 85%+ success rate requirement.');
    console.log('   ➡  Go back to Meta App Review → Marketing API Access Tier');
    console.log('   ➡  Wait up to 24 hours for the counter to update.');
    console.log('   ➡  Then submit the App Review.\n');
  } else {
    console.log('\n⚠️  Success rate below 85%. Common fixes:');
    console.log('   → Make sure your token has: ads_read, ads_management, read_insights');
    console.log('   → Make sure you have an active Ad Account linked to your app');
    console.log('   → Try generating a fresh token from Graph API Explorer\n');
  }

  // Show unique errors
  if (errors.length > 0) {
    const uniqueErrors = [...new Map(errors.map(e => [e.code + e.msg, e])).values()];
    console.log('🔍 Unique errors encountered:');
    uniqueErrors.slice(0, 10).forEach(e => {
      console.log(`   [Code ${e.code}] ${e.msg}`);
    });
    console.log('');
  }

  console.log('🔗 Graph API Explorer (to verify token & permissions):');
  console.log('   https://developers.facebook.com/tools/explorer/\n');
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err.message || err);
  process.exit(1);
});
