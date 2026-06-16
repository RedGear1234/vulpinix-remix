/**
 * marketing_api_500_calls_v7.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Makes 520 Facebook Marketing API calls for Meta App Review.
 * Target: 500+ calls, 85%+ success rate.
 *
 * v7 improvements:
 *   - Only queries Ads API endpoints (act_xxxxxxxx/...) to use the separate
 *     Ads API quota, avoiding the standard Graph API app-level limit (Code 4).
 *   - Uses a conservative 2000ms delay to prevent Ads API rate limit (Code 17 / 80004).
 *   - Automatic discovery of working Ads API endpoints.
 * ─────────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const https = require('https');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const USER_ACCESS_TOKEN = process.env.FB_MARKETING_TEST_TOKEN || 'PASTE_YOUR_USER_ACCESS_TOKEN_HERE';
const APP_ID            = process.env.FACEBOOK_APP_ID        || '2085020465691958';
const API_VERSION       = 'v21.0';
const BASE              = 'graph.facebook.com';

const DELAY_MS          = 2000;   // 2s delay between calls (safe for Ads API)
const PAUSE_EVERY       = 60;     // pause frequently
const PAUSE_DURATION_MS = 30000;  // 30s cooldown
const TARGET_CALLS      = 520;

// ─────────────────────────────────────────────────────────────────────────────

if (USER_ACCESS_TOKEN === 'PASTE_YOUR_USER_ACCESS_TOKEN_HERE') {
  console.error('\n❌ ERROR: Please set FB_MARKETING_TEST_TOKEN in .env\n');
  process.exit(1);
}

// ── HTTP helper ───────────────────────────────────────────────────────────────
function apiGet(path, params = {}) {
  return new Promise((resolve, reject) => {
    const parts = [`access_token=${encodeURIComponent(USER_ACCESS_TOKEN)}`];
    for (const [k, v] of Object.entries(params)) {
      if (Array.isArray(v)) {
        parts.push(`${k}=${encodeURIComponent(JSON.stringify(v))}`);
      } else if (v !== undefined && v !== null && v !== '') {
        parts.push(`${k}=${encodeURIComponent(String(v))}`);
      }
    }
    const qs = parts.join('&');
    const options = {
      hostname: BASE, port: 443,
      path: `/${API_VERSION}/${path}?${qs}`,
      method: 'GET',
      headers: { 'User-Agent': 'Vulpinix-MarketingAPI/7.0' }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) reject({ status: res.statusCode, error: parsed.error });
          else resolve({ status: res.statusCode, data: parsed });
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

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 Vulpinix — Facebook Marketing API: 500 Test Calls (v7 — Ads API Only)');
  console.log('='.repeat(75));
  console.log(`   App ID   : ${APP_ID}`);
  console.log(`   Target   : ${TARGET_CALLS} calls`);
  console.log(`   Delay    : ${DELAY_MS}ms between calls`);
  console.log(`   Cooldown : ${PAUSE_DURATION_MS/1000}s every ${PAUSE_EVERY} calls\n`);

  // ── Discover ad account ───────────────────────────────────────────────────
  let adAccountId = null;
  console.log('📡 [DISCOVERY] Finding ad accounts...');
  try {
    const r = await apiGet('me/adaccounts', { fields: 'id,name,account_status,currency' });
    const accounts = r.data?.data || [];
    if (accounts.length > 0) {
      adAccountId = accounts[0].id;
      console.log(`   ✅ Found: ${accounts[0].name} (${adAccountId})\n`);
    } else {
      console.error('❌ No ad accounts found. You must have at least one ad account for Marketing API Review.');
      process.exit(1);
    }
  } catch (e) {
    console.error(`❌ Ad account discovery failed: ${e.error?.message || e.message}`);
    process.exit(1);
  }

  // ── Discover safe endpoints ──────────────────────────────────────────────
  console.log('🔍 [DISCOVERY] Testing ad account endpoints to find working ones...');
  const candidates = [
    { label: 'acct/basic',         path: adAccountId, params: { fields: 'id,name,account_status,currency' } },
    { label: 'acct/balance',       path: adAccountId, params: { fields: 'id,name,spend_cap,balance' } },
    { label: 'acct/tz',            path: adAccountId, params: { fields: 'id,currency,timezone_name' } },
    { label: 'acct/campaigns',     path: `${adAccountId}/campaigns`, params: { fields: 'id,name,status', limit: 5 } },
    { label: 'acct/campaigns2',    path: `${adAccountId}/campaigns`, params: { fields: 'id,name,objective', limit: 5 } },
    { label: 'acct/campaigns3',    path: `${adAccountId}/campaigns`, params: { fields: 'id,name,created_time', limit: 5 } },
    { label: 'acct/adsets',        path: `${adAccountId}/adsets`, params: { fields: 'id,name,status', limit: 5 } },
    { label: 'acct/adsets2',       path: `${adAccountId}/adsets`, params: { fields: 'id,name,daily_budget', limit: 5 } },
    { label: 'acct/ads',           path: `${adAccountId}/ads`, params: { fields: 'id,name,status', limit: 5 } },
    { label: 'acct/ads2',          path: `${adAccountId}/ads`, params: { fields: 'id,name,created_time', limit: 5 } },
    { label: 'acct/adcreatives',   path: `${adAccountId}/adcreatives`, params: { fields: 'id,name', limit: 5 } },
    { label: 'acct/adimages',      path: `${adAccountId}/adimages`, params: { fields: 'hash,name', limit: 5 } },
    { label: 'acct/insights-30d',  path: `${adAccountId}/insights`, params: { fields: 'impressions,clicks,spend', date_preset: 'last_30d', level: 'account' } },
    { label: 'acct/insights-7d',   path: `${adAccountId}/insights`, params: { fields: 'impressions,clicks,spend', date_preset: 'last_7d', level: 'account' } },
    { label: 'acct/insights-90d',  path: `${adAccountId}/insights`, params: { fields: 'impressions,reach,spend', date_preset: 'last_90d', level: 'account' } },
    { label: 'acct/insights-yday', path: `${adAccountId}/insights`, params: { fields: 'impressions,clicks', date_preset: 'yesterday', level: 'account' } },
    { label: 'acct/insights-mon',  path: `${adAccountId}/insights`, params: { fields: 'spend,impressions', date_preset: 'this_month', level: 'account' } },
    { label: 'acct/insights-cpc',  path: `${adAccountId}/insights`, params: { fields: 'cpc,cpm,ctr', date_preset: 'last_30d', level: 'account' } },
  ];

  const safeEndpoints = [];
  for (const ep of candidates) {
    try {
      await apiGet(ep.path, ep.params);
      safeEndpoints.push(ep);
      console.log(`   ✅ ${ep.label}`);
    } catch (e) {
      console.log(`   ❌ ${ep.label} → ${e.error?.message?.substring(0, 60)}`);
    }
    await sleep(2000); // 2s space during discovery too
  }

  console.log(`\n   📋 ${safeEndpoints.length} safe endpoints found out of ${candidates.length} tested.\n`);

  if (safeEndpoints.length === 0) {
    console.error('❌ No working endpoints found. Check your token permissions.');
    process.exit(1);
  }

  const estSeconds = Math.round((TARGET_CALLS * DELAY_MS + Math.floor(TARGET_CALLS / PAUSE_EVERY) * PAUSE_DURATION_MS) / 1000);
  console.log(`🎯 Starting ${TARGET_CALLS} calls using safe Ads API endpoints...`);
  console.log(`   Estimated time: ~${estSeconds}s (~${Math.round(estSeconds/60)} min)\n`);

  let successCount = 0;
  let failCount = 0;
  const errors = [];
  const startTime = Date.now();

  for (let i = 0; i < TARGET_CALLS; i++) {
    const callNum = i + 1;

    // Cooldown pause
    if (callNum > 1 && (callNum - 1) % PAUSE_EVERY === 0) {
      const sr = Math.round((successCount / (successCount + failCount)) * 100);
      console.log(`\n   ⏸  [${callNum - 1} done] Rate: ${sr}% — cooling down ${PAUSE_DURATION_MS/1000}s...\n`);
      await sleep(PAUSE_DURATION_MS);
    }

    const ep = safeEndpoints[i % safeEndpoints.length];
    try {
      await apiGet(ep.path, ep.params);
      successCount++;
    } catch (e) {
      failCount++;
      const errCode = e.error?.code || 0;
      const errMsg = e.error?.message || 'Unknown error';
      errors.push({ call: ep.label, code: errCode, msg: errMsg });

      console.log(`\n   ❌ Call failed: ${ep.label} | Code ${errCode} | ${errMsg}`);
      if (errCode === 17 || errCode === 80004 || errCode === 80003) {
        console.log(`   ⚠️  Ads API limit hit. Extra 45s pause for recovery...`);
        await sleep(45000);
      }
    }

    // Progress every 20 calls
    if (callNum % 20 === 0 || callNum === 1) {
      const pct = Math.round((callNum / TARGET_CALLS) * 100);
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      const total = successCount + failCount;
      const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;
      process.stdout.write(
        `\r   [${pct.toString().padStart(3)}%] ${callNum.toString().padStart(3)}/${TARGET_CALLS} | ` +
        `✅ ${successCount} | ❌ ${failCount} | Rate: ${successRate}% | ⏱ ${elapsed}s`
      );
    }

    await sleep(DELAY_MS);
  }

  // ── Final Report ──────────────────────────────────────────────────────────
  const totalTime = Math.round((Date.now() - startTime) / 1000);
  const totalCalls = successCount + failCount;
  const successRate = Math.round((successCount / totalCalls) * 100);

  console.log('\n\n' + '='.repeat(70));
  console.log('📊 FINAL REPORT');
  console.log('='.repeat(70));
  console.log(`   Total calls   : ${totalCalls}`);
  console.log(`   Successful    : ${successCount} ✅`);
  console.log(`   Failed        : ${failCount} ❌`);
  console.log(`   Success rate  : ${successRate}%`);
  console.log(`   Time elapsed  : ${totalTime}s (${Math.round(totalTime / 60)} min)`);
  console.log('='.repeat(70));

  if (successRate >= 85) {
    console.log('\n✅ PASSED! 85%+ success rate achieved.');
    console.log('   ➡  Go to Meta App Review → Marketing API Access Tier');
    console.log('   ➡  Counter updates within 24h.\n');
  } else {
    console.log(`\n⚠️  Rate: ${successRate}% — below 85%.`);
    if (errors.length > 0) {
      const uniqueErrors = [...new Map(errors.map(e => [e.code + e.msg, e])).values()];
      console.log('\n🔍 Unique errors:');
      uniqueErrors.slice(0, 10).forEach(e => console.log(`   [Code ${e.code}] ${e.msg.substring(0, 80)}`));
    }
  }
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err.message || err);
  process.exit(1);
});
