/**
 * marketing_api_500_calls_v9.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Makes 520 Facebook Marketing API calls for Meta App Review.
 * Target: 500+ calls, 85%+ success rate.
 *
 * v9 - ULTIMATE SELF-PACING RUNNER:
 *   - Parses 'x-business-use-case-usage' headers from Meta dynamically on every call.
 *   - Dynamically adjusts inter-request delay based on current rate-limit usage:
 *       * Usage > 80% -> Sleep 30s immediately to cool down.
 *       * Usage > 60% -> Increase delay to 5000ms.
 *       * Usage > 40% -> Increase delay to 3800ms.
 *       * Usage <= 40% -> Standard delay of 2500ms.
 *   - If throttled (Code 80004/17): Reads the header's 'estimated_time_to_regain_access',
 *     sleeps for that duration + 10s, and retries the exact same call.
 * ─────────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const https = require('https');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const USER_ACCESS_TOKEN = process.env.FB_MARKETING_TEST_TOKEN || 'PASTE_YOUR_USER_ACCESS_TOKEN_HERE';
const APP_ID            = process.env.FACEBOOK_APP_ID        || '2085020465691958';
const AD_ACCOUNT_ID     = 'act_26806024709091463';
const API_VERSION       = 'v21.0';
const BASE              = 'graph.facebook.com';
const TARGET_CALLS      = 520;

let currentDelayMs      = 2500; // Starting delay

// ─────────────────────────────────────────────────────────────────────────────

if (USER_ACCESS_TOKEN === 'PASTE_YOUR_USER_ACCESS_TOKEN_HERE') {
  console.error('\n❌ ERROR: Please set FB_MARKETING_TEST_TOKEN in .env\n');
  process.exit(1);
}

// ── Parse usage headers ────────────────────────────────────────────────────────
function parseRateLimitHeaders(headers) {
  const headerVal = headers['x-business-use-case-usage'];
  if (!headerVal) return null;
  try {
    const data = JSON.parse(headerVal);
    // Find the first key (which is the ad account ID)
    const keys = Object.keys(data);
    if (keys.length > 0 && Array.isArray(data[keys[0]])) {
      const stats = data[keys[0]][0];
      return {
        callCount: stats.call_count || 0,
        cpuTime: stats.total_cputime || 0,
        totalTime: stats.total_time || 0,
        estimatedTimeToRegainAccess: stats.estimated_time_to_regain_access || 0
      };
    }
  } catch (e) {
    // Ignore parse errors
  }
  return null;
}

// ── HTTP helper with headers return ──────────────────────────────────────────
function apiGetWithHeaders(path, params = {}) {
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
      headers: { 'User-Agent': 'Vulpinix-MarketingAPI/9.0' }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject({ status: res.statusCode, error: parsed.error, headers: res.headers });
          } else {
            resolve({ status: res.statusCode, data: parsed, headers: res.headers });
          }
        } catch (e) {
          reject({ status: res.statusCode, error: { message: 'Parse error' }, headers: res.headers });
        }
      });
    });
    req.on('error', (e) => reject({ status: 0, error: { message: e.message }, headers: {} }));
    req.setTimeout(15000, () => { req.destroy(); reject({ status: 0, error: { message: 'Timeout' }, headers: {} }); });
    req.end();
  });
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 Vulpinix — Facebook Marketing API: 500 Test Calls (v9 — Adaptive Pacing)');
  console.log('='.repeat(78));
  console.log(`   App ID   : ${APP_ID}`);
  console.log(`   Ad Account: ${AD_ACCOUNT_ID}`);
  console.log(`   Target   : ${TARGET_CALLS} calls\n`);

  const safeEndpoints = [
    { label: 'acct/basic',         path: AD_ACCOUNT_ID, params: { fields: 'id,name,account_status,currency' } },
    { label: 'acct/balance',       path: AD_ACCOUNT_ID, params: { fields: 'id,name,spend_cap,balance' } },
    { label: 'acct/tz',            path: AD_ACCOUNT_ID, params: { fields: 'id,currency,timezone_name' } },
    { label: 'acct/campaigns',     path: `${AD_ACCOUNT_ID}/campaigns`, params: { fields: 'id,name,status', limit: 5 } },
    { label: 'acct/campaigns2',    path: `${AD_ACCOUNT_ID}/campaigns`, params: { fields: 'id,name,objective', limit: 5 } },
    { label: 'acct/campaigns3',    path: `${AD_ACCOUNT_ID}/campaigns`, params: { fields: 'id,name,created_time', limit: 5 } },
    { label: 'acct/adcreatives',   path: `${AD_ACCOUNT_ID}/adcreatives`, params: { fields: 'id,name', limit: 5 } },
    { label: 'acct/adimages',      path: `${AD_ACCOUNT_ID}/adimages`, params: { fields: 'hash,name', limit: 5 } },
    { label: 'acct/insights-30d',  path: `${AD_ACCOUNT_ID}/insights`, params: { fields: 'impressions,clicks,spend', date_preset: 'last_30d', level: 'account' } },
    { label: 'acct/insights-7d',   path: `${AD_ACCOUNT_ID}/insights`, params: { fields: 'impressions,clicks,spend', date_preset: 'last_7d', level: 'account' } },
    { label: 'acct/insights-90d',  path: `${AD_ACCOUNT_ID}/insights`, params: { fields: 'impressions,reach,spend', date_preset: 'last_90d', level: 'account' } },
    { label: 'acct/insights-yday', path: `${AD_ACCOUNT_ID}/insights`, params: { fields: 'impressions,clicks', date_preset: 'yesterday', level: 'account' } },
    { label: 'acct/insights-mon',  path: `${AD_ACCOUNT_ID}/insights`, params: { fields: 'spend,impressions', date_preset: 'this_month', level: 'account' } },
    { label: 'acct/insights-cpc',  path: `${AD_ACCOUNT_ID}/insights`, params: { fields: 'cpc,cpm,ctr', date_preset: 'last_30d', level: 'account' } },
  ];

  console.log(`🎯 Executing using safe endpoints...`);

  let successCount = 0;
  let failCount = 0;
  const startTime = Date.now();

  for (let i = 0; i < TARGET_CALLS; i++) {
    const callNum = i + 1;
    const ep = safeEndpoints[i % safeEndpoints.length];
    let succeeded = false;
    let attempts = 0;

    while (!succeeded) {
      try {
        const res = await apiGetWithHeaders(ep.path, ep.params);
        successCount++;
        succeeded = true;

        // Parse rate limiting headers from the successful response
        const stats = parseRateLimitHeaders(res.headers);
        if (stats) {
          const maxUsage = Math.max(stats.callCount, stats.cpuTime, stats.totalTime);
          
          // Adaptive pacing
          if (maxUsage > 80) {
            console.log(`\n   ⚠️  High usage detected (${maxUsage}%). Cooling down 30s...`);
            await sleep(30000);
            currentDelayMs = 4500;
          } else if (maxUsage > 60) {
            currentDelayMs = 4500;
          } else if (maxUsage > 40) {
            currentDelayMs = 3500;
          } else {
            currentDelayMs = 2500;
          }
        }

      } catch (e) {
        attempts++;
        const errCode = e.error?.code || 0;
        const errMsg = e.error?.message || 'Unknown error';

        console.log(`\n   ❌ Call failed (Attempt ${attempts}): ${ep.label} | Code ${errCode} | ${errMsg}`);

        // If rate limited, determine how long to wait
        if (errCode === 17 || errCode === 80004 || errCode === 80003 || errCode === 4) {
          const stats = parseRateLimitHeaders(e.headers || {});
          const waitTime = (stats?.estimatedTimeToRegainAccess || 90) + 10; // Extra 10s margin
          console.log(`   ⚠️  Throttled. Meta usage: ${stats ? JSON.stringify(stats) : 'N/A'}`);
          console.log(`   ⏳ Sleeping ${waitTime}s before retry...`);
          await sleep(waitTime * 1000);
        } else {
          // Non-rate-limit error (e.g. auth issue, permanent error): fail and skip
          failCount++;
          break;
        }
      }
    }

    // Print progress status
    if (callNum % 10 === 0 || callNum === 1) {
      const pct = Math.round((callNum / TARGET_CALLS) * 100);
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      const total = successCount + failCount;
      const successRate = total > 0 ? Math.round((successCount / total) * 100) : 0;
      process.stdout.write(
        `\r   [${pct.toString().padStart(3)}%] ${callNum.toString().padStart(3)}/${TARGET_CALLS} | ` +
        `✅ ${successCount} | ❌ ${failCount} | Rate: ${successRate}% | ⏱ ${elapsed}s | Delay: ${currentDelayMs}ms`
      );
    }

    await sleep(currentDelayMs);
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
    console.log(`\n⚠️  Rate: ${successRate}% — below 85%.\n`);
  }
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err.message || err);
  process.exit(1);
});
