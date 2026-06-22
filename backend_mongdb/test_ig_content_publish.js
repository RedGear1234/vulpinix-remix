/**
 * ============================================================
 * Meta App Review — instagram_business_content_publish Test
 * ============================================================
 * Run: node test_ig_content_publish.js
 *
 * This script makes the EXACT two-step API call that Meta
 * App Review counts for instagram_business_content_publish:
 *   1. POST /{ig-user-id}/media          ← container creation
 *   2. POST /{ig-user-id}/media_publish  ← actual publish
 *
 * Both calls MUST succeed and be made with a token generated
 * from APP ID: 2085020465691958
 * ============================================================
 */

require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
const APP_ID    = process.env.FACEBOOK_APP_ID;     // 2085020465691958
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;

// ── A real, publicly accessible test image (1:1 aspect ratio, JPEG) ──────────
// If you have your own hosted image, replace this URL.
const TEST_IMAGE_URL = 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1080&q=80&fm=jpg';

const CAPTION = '🚀 Testing Vulpinix content publishing. #Vulpinix #SocialMedia';

// ── Graph API base ────────────────────────────────────────────────────────────
const GQL = 'https://graph.facebook.com/v21.0';

async function run() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Meta App Review: instagram_business_content_publish');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ── Step 1: Load credentials from MongoDB ────────────────────────────────
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  const User = require('./models/user');

  // Find a user with an Instagram account linked
  const user = await User.findOne({
    $or: [
      { 'socialAccounts.instagram.igAccountId': { $exists: true, $ne: null } },
      { 'socialAccounts.instagram.pageAccessToken': { $exists: true, $ne: null } }
    ]
  });

  if (!user) {
    console.error('❌ No user found with Instagram connected.\n');
    console.error('   → Connect your Instagram account via the Vulpinix dashboard first.');
    process.exit(1);
  }

  const ig = user.socialAccounts.instagram;
  const igAccountId = ig.igAccountId;
  const token = ig.pageAccessToken || ig.accessToken;

  console.log(`✅ User: ${user.email}`);
  console.log(`   IG Account ID: ${igAccountId}`);
  console.log(`   Token (first 20): ${token ? token.substring(0, 20) + '...' : 'MISSING'}\n`);

  if (!igAccountId || !token) {
    console.error('❌ Missing igAccountId or token. Reconnect Instagram in the dashboard.');
    process.exit(1);
  }

  // ── Step 2: Verify the token is still valid ───────────────────────────────
  console.log('🔐 Verifying token validity...');
  try {
    const meRes = await axios.get(`${GQL}/me?fields=id,name&access_token=${token}`);
    console.log(`✅ Token valid for: ${meRes.data.name} (${meRes.data.id})\n`);
  } catch (e) {
    const msg = e.response?.data?.error?.message || e.message;
    console.error('❌ Token is expired or invalid:', msg);
    console.error('   → Reconnect your Instagram account in the Vulpinix dashboard.\n');
    await mongoose.disconnect();
    process.exit(1);
  }

  // ── Step 3: CALL 1 — Create media container ──────────────────────────────
  console.log('📦 [CALL 1] POST /{ig-user-id}/media  (create container)...');
  let creationId;
  try {
    const containerRes = await axios.post(`${GQL}/${igAccountId}/media`, {
      image_url: TEST_IMAGE_URL,
      caption: CAPTION,
      access_token: token
    });
    creationId = containerRes.data?.id;
    console.log(`✅ Container created! ID: ${creationId}\n`);
  } catch (e) {
    const err = e.response?.data?.error || {};
    console.error(`❌ Container creation FAILED`);
    console.error(`   Code: ${err.code}  Type: ${err.type}`);
    console.error(`   Message: ${err.message || e.message}`);
    if (err.code === 10 || err.type === 'OAuthException') {
      console.error('\n   ⚠️  Permission denied. Your token lacks instagram_business_content_publish.');
      console.error('   → Disconnect and reconnect Instagram in the dashboard to get the new scope.\n');
    }
    await mongoose.disconnect();
    process.exit(1);
  }

  // ── Step 4: Poll container status (max 30s) ───────────────────────────────
  console.log('⏳ Polling container status...');
  let isReady = false;
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 3000));
    try {
      const statusRes = await axios.get(
        `${GQL}/${creationId}?fields=status_code,status&access_token=${token}`
      );
      const code = statusRes.data?.status_code;
      console.log(`   Poll ${i + 1}/10 → status: ${code}`);
      if (code === 'FINISHED') { isReady = true; break; }
      if (code === 'ERROR') {
        console.error('❌ Container processing ERROR. Aborting.');
        await mongoose.disconnect();
        process.exit(1);
      }
    } catch (e) {
      console.warn('   Poll error:', e.response?.data?.error?.message || e.message);
    }
  }

  if (!isReady) {
    console.error('\n❌ Container never reached FINISHED state. Try a different image URL.');
    await mongoose.disconnect();
    process.exit(1);
  }

  // ── Step 5: CALL 2 — Publish the container ───────────────────────────────
  console.log('\n📤 [CALL 2] POST /{ig-user-id}/media_publish  (publish post)...');
  try {
    const publishRes = await axios.post(`${GQL}/${igAccountId}/media_publish`, {
      creation_id: creationId,
      access_token: token
    });
    const postId = publishRes.data?.id;
    console.log(`\n✅ ✅ ✅  PUBLISHED SUCCESSFULLY!`);
    console.log(`   Instagram Post ID: ${postId}`);
    console.log(`   View at: https://www.instagram.com/p/${postId}/\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  🎉  API call counted! Check Meta App Review in 24h.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (e) {
    const err = e.response?.data?.error || {};
    console.error('❌ Publish FAILED');
    console.error(`   Code: ${err.code}  Type: ${err.type}`);
    console.error(`   Message: ${err.message || e.message}\n`);
    if (err.code === 9004) {
      console.error('   ⚠️  Daily publishing limit reached (25/day for IG). Try tomorrow.');
    }
    await mongoose.disconnect();
    process.exit(1);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error('💥 Unexpected error:', err.message);
  process.exit(1);
});
