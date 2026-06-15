/**
 * fix_local_fb_token.js
 * One-time script to inject a valid Facebook token into the local MongoDB
 * so the Engagement Dashboard works in local dev.
 * 
 * Run: node fix_local_fb_token.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

// ── FILL THESE IN ──────────────────────────────────────────────────────────────
const USER_EMAIL      = 'shubhamchavan@live.com';  // Your Vulpinix login email
const FB_ACCESS_TOKEN = process.env.FB_MARKETING_TEST_TOKEN || ''; // from .env
const FB_PAGE_ID      = '1111932568671242';         // Kaustubh's page ID
// ──────────────────────────────────────────────────────────────────────────────

async function run() {
  if (!FB_ACCESS_TOKEN) {
    console.error('❌ FB_MARKETING_TEST_TOKEN not set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to local MongoDB');

  const user = await User.findOne({ email: USER_EMAIL });
  if (!user) {
    console.error(`❌ User not found: ${USER_EMAIL}`);
    process.exit(1);
  }

  // Fetch page access token using the user token
  const axios = require('axios');
  let pageToken = FB_ACCESS_TOKEN;
  try {
    const pagesRes = await axios.get(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${FB_ACCESS_TOKEN}`
    );
    const pages = pagesRes.data?.data || [];
    const page  = pages.find(p => p.id === FB_PAGE_ID) || pages[0];
    if (page) {
      pageToken = page.access_token;
      console.log(`✅ Got page token for page: ${page.name} (${page.id})`);
    } else {
      console.warn('⚠️  No pages found via /me/accounts. Using user token as page token.');
    }
  } catch (e) {
    console.warn('⚠️  Could not fetch page token:', e.response?.data?.error?.message || e.message);
  }

  if (!user.socialAccounts) user.socialAccounts = {};
  user.socialAccounts.facebook = {
    accessToken:      FB_ACCESS_TOKEN,
    pageId:           FB_PAGE_ID,
    pageAccessToken:  pageToken
  };
  user.markModified('socialAccounts');
  await user.save();

  console.log(`✅ Facebook token saved for ${USER_EMAIL}`);
  console.log('   → Now refresh the Engagement Dashboard in your local app.');
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
