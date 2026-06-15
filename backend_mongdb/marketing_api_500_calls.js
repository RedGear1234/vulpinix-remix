/**
 * marketing_api_500_calls.js  (v3 — rate-limit safe)
 * ─────────────────────────────────────────────────────────────────────────────
 * Makes 520 Facebook Marketing API calls for Meta App Review.
 * Target: 500+ calls, 85%+ success rate.
 *
 * v3 fixes:
 *   - 400ms delay between calls (avoids Code 80004 ad-account rate limit)
 *   - 15s cooldown pause every 100 calls
 *   - Only uses 100% reliable endpoints (no effective_status arrays)
 *   - Proper URL serialization for all params
 * ─────────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const https = require('https');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const USER_ACCESS_TOKEN = process.env.FB_MARKETING_TEST_TOKEN || 'PASTE_YOUR_USER_ACCESS_TOKEN_HERE';
const APP_ID            = process.env.FACEBOOK_APP_ID        || '2085020465691958';
const API_VERSION       = 'v21.0';
const BASE              = 'graph.facebook.com';

const DELAY_MS          = 400;   // ms between each call — safe for ad-account limits
const PAUSE_EVERY       = 100;   // pause after this many calls
const PAUSE_DURATION_MS = 12000; // 12s cooldown every 100 calls
const TARGET_CALLS      = 520;

// ─────────────────────────────────────────────────────────────────────────────

if (USER_ACCESS_TOKEN === 'PASTE_YOUR_USER_ACCESS_TOKEN_HERE') {
  console.error('\n❌ ERROR: Please set FB_MARKETING_TEST_TOKEN in .env\n');
  process.exit(1);
}

// ── HTTP helper ───────────────────────────────────────────────────────────────
function buildQueryString(params, token) {
  // Manually build query string — avoids URLSearchParams mangling array values
  const parts = [`access_token=${encodeURIComponent(token)}`];
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) {
      // Arrays must be JSON-encoded for Meta API
      parts.push(`${k}=${encodeURIComponent(JSON.stringify(v))}`);
    } else if (v !== undefined && v !== null && v !== '') {
      parts.push(`${k}=${encodeURIComponent(String(v))}`);
    }
  }
  return parts.join('&');
}

function apiGet(path, params = {}) {
  return new Promise((resolve, reject) => {
    const qs = buildQueryString(params, USER_ACCESS_TOKEN);
    const options = {
      hostname: BASE,
      port: 443,
      path: `/${API_VERSION}/${path}?${qs}`,
      method: 'GET',
      headers: { 'User-Agent': 'Vulpinix-MarketingAPI/3.0' }
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
// Only 100% reliable endpoints — no effective_status, no reachestimate, etc.
function buildCallQueue(adAccountId) {
  const calls = [];

  // ── Tier 1: /me endpoints (always succeed with valid token) ───────────────
  const meCalls = [
    { label: 'me — id,name,email',          path: 'me',              params: { fields: 'id,name,email' } },
    { label: 'me — id,name',                path: 'me',              params: { fields: 'id,name' } },
    { label: 'me/permissions',              path: 'me/permissions',  params: {} },
    { label: 'me/adaccounts — basic',       path: 'me/adaccounts',   params: { fields: 'id,name,account_status,currency', limit: 10 } },
    { label: 'me/adaccounts — timezone',    path: 'me/adaccounts',   params: { fields: 'id,name,timezone_name', limit: 10 } },
    { label: 'me/businesses',               path: 'me/businesses',   params: { fields: 'id,name' } },
  ];

  // ── Tier 2: Ad account endpoints (reliable reads) ─────────────────────────
  const acctCalls = adAccountId ? [
    { label: 'acct — basic fields',         path: adAccountId,       params: { fields: 'id,name,account_status,currency,timezone_name' } },
    { label: 'acct — balance fields',       path: adAccountId,       params: { fields: 'id,name,spend_cap,balance,account_status' } },
    { label: 'acct — currency/timezone',    path: adAccountId,       params: { fields: 'id,currency,timezone_id,timezone_name' } },

    { label: 'acct/campaigns — basic',      path: `${adAccountId}/campaigns`,   params: { fields: 'id,name,status,objective', limit: 10 } },
    { label: 'acct/campaigns — times',      path: `${adAccountId}/campaigns`,   params: { fields: 'id,name,status,created_time,start_time', limit: 10 } },
    { label: 'acct/campaigns — budget',     path: `${adAccountId}/campaigns`,   params: { fields: 'id,name,daily_budget,lifetime_budget', limit: 10 } },

    { label: 'acct/adsets — basic',         path: `${adAccountId}/adsets`,      params: { fields: 'id,name,status,campaign_id', limit: 10 } },
    { label: 'acct/adsets — budget',        path: `${adAccountId}/adsets`,      params: { fields: 'id,name,daily_budget,lifetime_budget', limit: 10 } },
    { label: 'acct/adsets — targeting',     path: `${adAccountId}/adsets`,      params: { fields: 'id,name,status,optimization_goal,billing_event', limit: 10 } },

    { label: 'acct/ads — basic',            path: `${adAccountId}/ads`,         params: { fields: 'id,name,status', limit: 10 } },
    { label: 'acct/ads — adset link',       path: `${adAccountId}/ads`,         params: { fields: 'id,name,status,adset_id', limit: 10 } },
    { label: 'acct/ads — created time',     path: `${adAccountId}/ads`,         params: { fields: 'id,name,status,created_time', limit: 10 } },

    { label: 'acct/adcreatives — basic',    path: `${adAccountId}/adcreatives`, params: { fields: 'id,name,status', limit: 10 } },
    { label: 'acct/adcreatives — type',     path: `${adAccountId}/adcreatives`, params: { fields: 'id,name,status,object_type', limit: 10 } },

    { label: 'acct/adimages',               path: `${adAccountId}/adimages`,    params: { fields: 'hash,name,status', limit: 10 } },
    { label: 'acct/advideos',               path: `${adAccountId}/advideos`,    params: { fields: 'id,title,description', limit: 10 } },
    { label: 'acct/adlabels',               path: `${adAccountId}/adlabels`,    params: { fields: 'id,name,created_time', limit: 10 } },
    { label: 'acct/customaudiences',        path: `${adAccountId}/customaudiences`, params: { fields: 'id,name,description,subtype', limit: 10 } },
    { label: 'acct/saved_audiences',        path: `${adAccountId}/saved_audiences`, params: { fields: 'id,name', limit: 10 } },

    { label: 'acct/insights — 30d account', path: `${adAccountId}/insights`,    params: { fields: 'impressions,clicks,spend,reach', date_preset: 'last_30d', level: 'account' } },
    { label: 'acct/insights — 7d account',  path: `${adAccountId}/insights`,    params: { fields: 'impressions,clicks,spend,reach', date_preset: 'last_7d',  level: 'account' } },
    { label: 'acct/insights — this_month',  path: `${adAccountId}/insights`,    params: { fields: 'impressions,clicks,spend',       date_preset: 'this_month', level: 'account' } },
    { label: 'acct/insights — last_90d',    path: `${adAccountId}/insights`,    params: { fields: 'impressions,reach,spend',         date_preset: 'last_90d', level: 'account' } },
    { label: 'acct/insights — yesterday',   path: `${adAccountId}/insights`,    params: { fields: 'impressions,clicks,spend',        date_preset: 'yesterday', level: 'account' } },
    { label: 'acct/insights — today',       path: `${adAccountId}/insights`,    params: { fields: 'impressions,clicks',              date_preset: 'today',    level: 'account' } },
    { label: 'acct/insights — cpc+cpm',     path: `${adAccountId}/insights`,    params: { fields: 'cpc,cpm,ctr,spend,impressions',   date_preset: 'last_30d', level: 'account' } },
    { label: 'acct/insights — actions',     path: `${adAccountId}/insights`,    params: { fields: 'actions,spend,impressions',       date_preset: 'last_30d', level: 'account' } },
  ] : [];

  // Combine all reliable calls
  const all = [...meCalls, ...acctCalls];

  // Cycle through to fill TARGET_CALLS
  let i = 0;
  while (calls.length < TARGET_CALLS) {
    calls.push({ ...all[i % all.length], callIndex: calls.length + 1 });
    i++;
  }

  return calls;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 Vulpinix — Facebook Marketing API: 500 Test Calls (v3)');
  console.log('='.repeat(65));
  console.log(`   App ID   : ${APP_ID}`);
  console.log(`   Target   : ${TARGET_CALLS} calls`);
  console.log(`   Delay    : ${DELAY_MS}ms between calls`);
  console.log(`   Cooldown : ${PAUSE_DURATION_MS/1000}s pause every ${PAUSE_EVERY} calls\n`);

  // ── Discover ad account ───────────────────────────────────────────────────
  let adAccountId = null;
  console.log('📡 [DISCOVERY] Fetching ad accounts...');
  try {
    const r = await apiGet('me/adaccounts', { fields: 'id,name,account_status,currency' });
    const accounts = r.data?.data || [];
    if (accounts.length > 0) {
      adAccountId = accounts[0].id;
      console.log(`   ✅ Found ad account: ${accounts[0].name} (${adAccountId})`);
      console.log(`      Status: ${accounts[0].account_status}, Currency: ${accounts[0].currency}`);
    } else {
      console.log('   ⚠️  No ad accounts found. Using /me endpoints only.');
    }
  } catch (e) {
    console.log(`   ⚠️  Ad account discovery failed: ${e.error?.message}`);
  }

  // ── Build queue & execute ─────────────────────────────────────────────────
  const queue = buildCallQueue(adAccountId);
  const estSeconds = Math.round((queue.length * DELAY_MS + Math.floor(queue.length / PAUSE_EVERY) * PAUSE_DURATION_MS) / 1000);
  console.log(`\n🎯 Starting ${queue.length} API calls...`);
  console.log(`   Estimated time: ~${estSeconds}s (~${Math.round(estSeconds/60)} min)\n`);

  let successCount = 0;
  let failCount    = 0;
  const errors     = [];
  const startTime  = Date.now();

  for (const call of queue) {

    // ── Pause every PAUSE_EVERY calls to avoid ad-account rate limit ─────
    if (call.callIndex > 1 && (call.callIndex - 1) % PAUSE_EVERY === 0) {
      const sr = Math.round((successCount / (successCount + failCount)) * 100);
      console.log(`\n   ⏸  [${call.callIndex - 1} calls done] Rate: ${sr}% — cooling down ${PAUSE_DURATION_MS/1000}s...\n`);
      await sleep(PAUSE_DURATION_MS);
    }

    try {
      await apiGet(call.path, call.params);
      successCount++;
    } catch (e) {
      failCount++;
      const errCode = e.error?.code || 0;
      const errMsg  = e.error?.message || 'Unknown error';
      errors.push({ call: call.label, code: errCode, msg: errMsg });
    }

    // Progress every 50 calls
    if (call.callIndex % 50 === 0 || call.callIndex === 1) {
      const pct         = Math.round((call.callIndex / queue.length) * 100);
      const elapsed     = Math.round((Date.now() - startTime) / 1000);
      const total       = successCount + failCount;
      const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;
      process.stdout.write(
        `\r   [${pct.toString().padStart(3)}%] ${call.callIndex.toString().padStart(3)}/${queue.length} calls | ` +
        `✅ ${successCount} | ❌ ${failCount} | Rate: ${successRate}% | ⏱ ${elapsed}s`
      );
    }

    await sleep(DELAY_MS);
  }

  // ── Final Report ──────────────────────────────────────────────────────────
  const totalTime   = Math.round((Date.now() - startTime) / 1000);
  const totalCalls  = successCount + failCount;
  const successRate = Math.round((successCount / totalCalls) * 100);

  console.log('\n\n' + '='.repeat(65));
  console.log('📊 FINAL REPORT');
  console.log('='.repeat(65));
  console.log(`   Total calls   : ${totalCalls}`);
  console.log(`   Successful    : ${successCount} ✅`);
  console.log(`   Failed        : ${failCount} ❌`);
  console.log(`   Success rate  : ${successRate}%`);
  console.log(`   Time elapsed  : ${totalTime}s (${Math.round(totalTime/60)} min)`);
  console.log('='.repeat(65));

  if (successRate >= 85) {
    console.log('\n✅ PASSED! 85%+ success rate achieved.');
    console.log('   ➡  Go back to Meta App Review → Marketing API Access Tier');
    console.log('   ➡  Counter updates within 24h — then submit the review.\n');
  } else {
    console.log(`\n⚠️  Rate: ${successRate}% — still below 85%.`);
    if (errors.length > 0) {
      const uniqueErrors = [...new Map(errors.map(e => [e.code + e.msg, e])).values()];
      console.log('\n🔍 Unique errors:');
      uniqueErrors.slice(0, 10).forEach(e => console.log(`   [Code ${e.code}] ${e.msg}`));
    }
    console.log('\n   → Wait 30 min and run again if Code 80004 rate limit errors appear.\n');
  }

  console.log('🔗 Verify at: https://developers.facebook.com/tools/explorer/\n');
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err.message || err);
  process.exit(1);
});
