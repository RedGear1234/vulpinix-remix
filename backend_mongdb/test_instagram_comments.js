/**
 * test_instagram_comments.js
 *
 * Makes the 1 required API call for the instagram_business_manage_comments
 * permission in Meta App Review.
 *
 * Flow:
 *   Step 1 – GET  /{ig-user-id}/media            → get a recent post
 *   Step 2 – POST /{media-id}/comments            → post a comment  ← the required call
 *   Step 3 – GET  /{media-id}/comments            → read comments (bonus read call)
 *
 * Run with:  node test_instagram_comments.js
 */

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const TEST_COMMENT = '✅ Vulpinix test comment — verifying instagram_business_manage_comments for Meta App Review.';

// ── Load DB credentials ───────────────────────────────────────────────────────
async function getInstagramCredentials() {
  const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!MONGO_URI) throw new Error('MONGODB_URI is not set in .env');

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const userSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.models.User || mongoose.model('User', userSchema);

  const user = await User.findOne({ 'socialAccounts.instagram.igAccountId': { $exists: true } });
  if (!user) throw new Error('❌ No user with a connected Instagram account found.');

  const ig = user.socialAccounts?.instagram;
  if (!ig?.igAccountId || (!ig?.accessToken && !ig?.pageAccessToken)) {
    throw new Error('❌ Missing igAccountId or accessToken.');
  }

  console.log(`✅ Found account for user: ${user.email}`);
  console.log(`   IG Account ID : ${ig.igAccountId}`);
  console.log(`   Username      : @${ig.username || 'unknown'}`);

  return {
    igAccountId: ig.igAccountId,
    accessToken: ig.pageAccessToken || ig.accessToken,
  };
}

// ── Step 1: Get a recent media post ──────────────────────────────────────────
async function getRecentMediaId(igAccountId, accessToken) {
  console.log('\n--- Step 1: Fetching recent media posts ---');
  const res = await axios.get(
    `https://graph.facebook.com/v18.0/${igAccountId}/media`,
    {
      params: {
        fields: 'id,caption,timestamp,media_type',
        limit: 5,
        access_token: accessToken,
      },
    }
  );

  const posts = res.data?.data || [];
  if (posts.length === 0) throw new Error('❌ No media posts found on this Instagram account.');

  const post = posts[0];
  console.log(`✅ Using most recent post:`);
  console.log(`   ID        : ${post.id}`);
  console.log(`   Type      : ${post.media_type}`);
  console.log(`   Timestamp : ${post.timestamp}`);
  console.log(`   Caption   : ${(post.caption || '').substring(0, 60)}...`);
  return post.id;
}

// ── Step 2: Post a comment ────────────────────────────────────────────────────
async function postComment(mediaId, accessToken) {
  console.log('\n--- Step 2: Posting a comment (instagram_business_manage_comments call) ---');
  const res = await axios.post(
    `https://graph.facebook.com/v18.0/${mediaId}/comments`,
    {
      message: TEST_COMMENT,
      access_token: accessToken,
    }
  );
  const commentId = res.data?.id;
  console.log(`✅ Comment posted! Comment ID: ${commentId}`);
  return commentId;
}

// ── Step 3: Read comments (bonus verification) ────────────────────────────────
async function readComments(mediaId, accessToken) {
  console.log('\n--- Step 3: Reading comments (GET /comments) ---');
  const res = await axios.get(
    `https://graph.facebook.com/v18.0/${mediaId}/comments`,
    {
      params: {
        fields: 'id,text,timestamp',
        access_token: accessToken,
      },
    }
  );
  const comments = res.data?.data || [];
  console.log(`✅ Found ${comments.length} comment(s) on this post.`);
  comments.slice(0, 3).forEach((c, i) => {
    console.log(`   [${i + 1}] ${c.text?.substring(0, 60)} (${c.timestamp})`);
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  try {
    const { igAccountId, accessToken } = await getInstagramCredentials();

    const mediaId = await getRecentMediaId(igAccountId, accessToken);
    const commentId = await postComment(mediaId, accessToken);

    if (commentId) {
      await readComments(mediaId, accessToken);
    }

    console.log('\n🎉 instagram_business_manage_comments API call completed!');
    console.log('   Allow up to 24 hours for the Meta App Review counter to update.');
  } catch (err) {
    const detail = err.response?.data?.error || err.message;
    console.error('\n❌ Script failed:', typeof detail === 'object' ? JSON.stringify(detail, null, 2) : detail);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
  }
}

run();
