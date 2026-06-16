/**
 * check_rate_limit_headers.js
 * Run: node check_rate_limit_headers.js
 *
 * Inspects Meta's rate limiting headers to see exactly how long we are blocked.
 */

require('dotenv').config();
const https = require('https');

const USER_ACCESS_TOKEN = process.env.FB_MARKETING_TEST_TOKEN;
const AD_ACCOUNT_ID     = 'act_26806024709091463';
const API_VERSION       = 'v21.0';

if (!USER_ACCESS_TOKEN) {
  console.error('❌ FB_MARKETING_TEST_TOKEN not set');
  process.exit(1);
}

const url = `https://graph.facebook.com/${API_VERSION}/${AD_ACCOUNT_ID}?fields=id,name&access_token=${encodeURIComponent(USER_ACCESS_TOKEN)}`;

console.log('Sending test request to inspect headers...');
https.get(url, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('\n=== HEADERS ===');
  console.log('x-business-use-case-usage:', res.headers['x-business-use-case-usage']);
  console.log('x-ad-account-usage:', res.headers['x-ad-account-usage']);
  console.log('x-app-usage:', res.headers['x-app-usage']);
  console.log('x-fb-rev:', res.headers['x-fb-rev']);
  console.log('x-fb-trace-id:', res.headers['x-fb-trace-id']);
  console.log('================\n');

  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    console.log('Response Body:', body);
  });
}).on('error', err => {
  console.error('Network error:', err);
});
