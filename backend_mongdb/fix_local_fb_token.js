/**
 * fix_local_fb_token.js
 * Injects a valid Facebook Page + Instagram token into MongoDB for local dev.
 * Run: node fix_local_fb_token.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const axios    = require('axios');
const User     = require('./models/user');

const USER_EMAIL      = 'shubhamchavan@live.com';
const FB_ACCESS_TOKEN = process.env.FB_MARKETING_TEST_TOKEN || '';
const FB_PAGE_ID      = '1111932568671242';   // Vulpinix Facebook Page
const IG_ACCOUNT_ID   = '17841411291910138';  // Vulpinix Instagram Business Account

async function run() {
  if (!FB_ACCESS_TOKEN) {
    console.error('❌ FB_MARKETING_TEST_TOKEN not set in .env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const user = await User.findOne({ email: USER_EMAIL });
  if (!user) {
    console.error(`❌ User not found: ${USER_EMAIL}`);
    process.exit(1);
  }

  // Step 1: Get page access token
  let pageToken = FB_ACCESS_TOKEN;
  try {
    // Try /me/accounts first
    const pagesRes = await axios.get(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${FB_ACCESS_TOKEN}`
    );
    const pages = pagesRes.data?.data || [];
    const page  = pages.find(p => p.id === FB_PAGE_ID) || pages[0];
    if (page?.access_token) {
      pageToken = page.access_token;
      console.log(`✅ Page token via /me/accounts: ${page.name}`);
    } else {
      throw new Error('empty');
    }
  } catch {
    // Fallback: directly fetch the known page ID
    try {
      const pageRes = await axios.get(
        `https://graph.facebook.com/v18.0/${FB_PAGE_ID}?fields=name,access_token&access_token=${FB_ACCESS_TOKEN}`
      );
      if (pageRes.data?.access_token) {
        pageToken = pageRes.data.access_token;
        console.log(`✅ Page token via direct lookup: ${pageRes.data.name}`);
      } else {
        console.warn('⚠️  No page token found – using user token as fallback');
      }
    } catch (e2) {
      console.warn('⚠️  Page token fetch failed:', e2.response?.data?.error?.message || e2.message);
    }
  }

  // Step 2: Save both Facebook and Instagram to DB
  if (!user.socialAccounts) user.socialAccounts = {};

  user.socialAccounts.facebook = {
    accessToken:     FB_ACCESS_TOKEN,
    pageId:          FB_PAGE_ID,
    pageAccessToken: pageToken
  };

  user.socialAccounts.instagram = {
    accessToken:       FB_ACCESS_TOKEN,
    pageAccessToken:   pageToken,
    igAccountId:       IG_ACCOUNT_ID,
    username:          'vulpinix',
    name:              'Vulpinix',
    profilePictureUrl: '',
    biography:         '',
    followersCount:    0,
    followsCount:      0,
    mediaCount:        0,
    pageId:            FB_PAGE_ID
  };

  user.markModified('socialAccounts');
  await user.save();

  console.log(`✅ Facebook + Instagram tokens saved for ${USER_EMAIL}`);
  console.log('   → Refresh the Engagement Dashboard now!');
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
