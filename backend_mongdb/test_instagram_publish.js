/**
 * test_instagram_publish.js
 *
 * Makes the 1 required API call for the instagram_business_content_publish
 * permission in Meta App Review.
 *
 * The flow is the standard 2-step Instagram Content Publishing API:
 *   Step 1 – POST /{ig-user-id}/media          → creates a media container
 *   Step 2 – POST /{ig-user-id}/media_publish   → publishes the container
 *             ↑ This is the call Meta counts as instagram_business_content_publish
 *
 * Run with:  node test_instagram_publish.js
 */

const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

// ── Config ────────────────────────────────────────────────────────────────────
// A publicly accessible image URL to use for the test post.
// Must be a JPEG hosted on a public HTTPS URL (not localhost).
const TEST_IMAGE_URL =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';

const TEST_CAPTION =
  '✅ Vulpinix test post – verifying instagram_business_content_publish permission for Meta App Review.';

// ── Load DB credentials ───────────────────────────────────────────────────────
async function getInstagramCredentials() {
  const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error('MONGODB_URI is not set in .env');
  }

  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Load User model inline to avoid importing all of socialController
  const userSchema = new mongoose.Schema({}, { strict: false });
  const User = mongoose.models.User || mongoose.model('User', userSchema);

  const user = await User.findOne({ 'socialAccounts.instagram.igAccountId': { $exists: true } });
  if (!user) {
    throw new Error('❌ No user with a connected Instagram account found in the database.');
  }

  const ig = user.socialAccounts?.instagram;
  if (!ig?.igAccountId || (!ig?.accessToken && !ig?.pageAccessToken)) {
    throw new Error('❌ Instagram account found but missing igAccountId or accessToken.');
  }

  console.log(`✅ Found Instagram account for user: ${user.email}`);
  console.log(`   IG Account ID : ${ig.igAccountId}`);
  console.log(`   Username      : @${ig.username || 'unknown'}`);

  return {
    igAccountId: ig.igAccountId,
    // Prefer pageAccessToken as it has the widest permission scope
    accessToken: ig.pageAccessToken || ig.accessToken,
  };
}

// ── Step 1: Create media container ───────────────────────────────────────────
async function createMediaContainer(igAccountId, accessToken) {
  console.log('\n--- Step 1: Creating Instagram media container ---');
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v18.0/${igAccountId}/media`,
      {
        image_url: TEST_IMAGE_URL,
        caption: TEST_CAPTION,
        access_token: accessToken,
      }
    );
    const containerId = res.data?.id;
    console.log(`✅ Media container created. ID: ${containerId}`);
    return containerId;
  } catch (err) {
    const detail = err.response?.data?.error || err.message;
    console.error('❌ Failed to create media container:', JSON.stringify(detail, null, 2));
    throw err;
  }
}

// ── Wait for container to be ready ───────────────────────────────────────────
async function waitForContainerReady(igAccountId, containerId, accessToken, maxAttempts = 10) {
  console.log('\n--- Polling container status until FINISHED ---');
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 3000)); // wait 3 s
    try {
      const res = await axios.get(
        `https://graph.facebook.com/v18.0/${containerId}?fields=status_code&access_token=${accessToken}`
      );
      const status = res.data?.status_code;
      console.log(`   Attempt ${i + 1}: status = ${status}`);
      if (status === 'FINISHED') return true;
      if (status === 'ERROR' || status === 'EXPIRED') {
        console.error(`❌ Container entered terminal state: ${status}`);
        return false;
      }
    } catch (e) {
      console.warn(`   ⚠️ Status poll error: ${e.message}`);
    }
  }
  console.warn('⚠️ Container did not reach FINISHED in time — attempting publish anyway.');
  return true; // attempt publish regardless
}

// ── Step 2: Publish the container ────────────────────────────────────────────
async function publishMedia(igAccountId, containerId, accessToken) {
  console.log('\n--- Step 2: Publishing media (instagram_business_content_publish call) ---');
  try {
    const res = await axios.post(
      `https://graph.facebook.com/v18.0/${igAccountId}/media_publish`,
      {
        creation_id: containerId,
        access_token: accessToken,
      }
    );
    console.log('✅ SUCCESS! Post published.');
    console.log('   Response:', JSON.stringify(res.data, null, 2));
    console.log('\n🎉 The instagram_business_content_publish API call has been made.');
    console.log('   It may take up to 24 hours to appear in the Meta App Review Testing section.');
    return res.data;
  } catch (err) {
    const detail = err.response?.data?.error || err.message;
    console.error('❌ Failed to publish media:', JSON.stringify(detail, null, 2));
    throw err;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  try {
    const { igAccountId, accessToken } = await getInstagramCredentials();

    const containerId = await createMediaContainer(igAccountId, accessToken);
    if (!containerId) throw new Error('No container ID returned from Step 1.');

    const ready = await waitForContainerReady(igAccountId, containerId, accessToken);
    if (!ready) throw new Error('Container is not ready to publish.');

    await publishMedia(igAccountId, containerId, accessToken);
  } catch (err) {
    console.error('\n❌ Script failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
  }
}

run();
