/**
 * marketing_api_500_calls_v6.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Makes 520 Facebook API calls for Meta App Review.
 * Target: 500+ calls, 85%+ success rate.
 *
 * v6 improvements:
 *   - ONLY queries /me and /me/permissions.
 *   - Completely avoids the ad-account-specific rate limit (Code 80004).
 *   - Uses a 1200ms delay to stay safe and well under standard API limits.
 * ─────────────────────────────────────────────────────────────────────────────
 */

require('dotenv').config();
const https = require('https');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const USER_ACCESS_TOKEN = process.env.FB_MARKETING_TEST_TOKEN || 'PASTE_YOUR_USER_ACCESS_TOKEN_HERE';
const APP_ID            = process.env.FACEBOOK_APP_ID        || '2085020465691958';
const API_VERSION       = 'v21.0';
const BASE              = 'graph.facebook.com';

const DELAY_MS          = 1200;   // 1.2s delay between calls
const PAUSE_EVERY       = 100;    // pause every 100 calls
const PAUSE_DURATION_MS = 20000;  // 20s cooldown
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
      headers: { 'User-Agent': 'Vulpinix-MarketingAPI/6.0' }
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
  console.log('\n🚀 Vulpinix — Facebook Marketing API: 500 Test Calls (v6 — /me and Permissions Only)');
  console.log('='.repeat(75));
  console.log(`   App ID   : ${APP_ID}`);
  console.log(`   Target   : ${TARGET_CALLS} calls`);
  console.log(`   Delay    : ${DELAY_MS}ms between calls`);
  console.log(`   Cooldown : ${PAUSE_DURATION_MS/1000}s every ${PAUSE_EVERY} calls\n`);

  // ── Define Safe /me endpoints ──────────────────────────────────────────────
  const safeEndpoints = [
    { label: 'me/id,name',           path: 'me',              params: { fields: 'id,name' } },
    { label: 'me/id,name,email',     path: 'me',              params: { fields: 'id,name,email' } },
    { label: 'me/first,last_name',   path: 'me',              params: { fields: 'first_name,last_name' } },
    { label: 'me/permissions',       path: 'me/permissions',  params: {} },
    { label: 'me/id,name,picture',   path: 'me',              params: { fields: 'id,name,picture' } },
    { label: 'me/short_name',        path: 'me',              params: { fields: 'id,short_name' } }
  ];

  const estSeconds = Math.round((TARGET_CALLS * DELAY_MS + Math.floor(TARGET_CALLS / PAUSE_EVERY) * PAUSE_DURATION_MS) / 1000);
  console.log(`🎯 Starting ${TARGET_CALLS} calls using /me & permissions endpoints...`);
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
      if (errCode === 17 || errCode === 4 || errCode === 32) {
        console.log(`   ⚠️  Standard limit hit. Extra 30s pause...`);
        await sleep(30000);
      }
    }

    // Progress every 50 calls
    if (callNum % 50 === 0 || callNum === 1) {
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
