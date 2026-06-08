/**
 * meta_comments_test.js
 * Run: node meta_comments_test.js
 * 
 * This script makes the exact API calls required by Meta App Review
 * for the instagram_business_manage_comments permission.
 */

require('dotenv').config();
const axios = require('axios');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const ACCESS_TOKEN = process.env.IG_TEST_ACCESS_TOKEN || 'PASTE_YOUR_PAGE_ACCESS_TOKEN_HERE';
const IG_ACCOUNT_ID = process.env.IG_TEST_ACCOUNT_ID || 'PASTE_YOUR_IG_BUSINESS_ACCOUNT_ID_HERE';
// ─────────────────────────────────────────────────────────────────────────────

if (!ACCESS_TOKEN || ACCESS_TOKEN === 'PASTE_YOUR_PAGE_ACCESS_TOKEN_HERE') {
  console.error('\n❌ ERROR: Please set ACCESS_TOKEN and IG_ACCOUNT_ID in this file or in your .env\n');
  process.exit(1);
}

async function runCommentsTest() {
  console.log('\n🔍 Vulpinix — Meta App Review: instagram_business_manage_comments Test');
  console.log('='.repeat(70));

  // 1. Get recent media post to find a media ID
  console.log('\n[1/3] Fetching recent media post...');
  let mediaId = null;
  try {
    const r1 = await axios.get(`https://graph.facebook.com/v21.0/${IG_ACCOUNT_ID}/media`, {
      params: { limit: 1, access_token: ACCESS_TOKEN }
    });
    mediaId = r1.data?.data?.[0]?.id;
    if (mediaId) {
      console.log(`      ✅ Found media ID: ${mediaId}`);
    } else {
      console.error('      ❌ No posts found. Please publish at least one post on this Instagram account first.');
      process.exit(1);
    }
  } catch (e) {
    console.error('      ❌ FAILED to get media:', e.response?.data?.error?.message || e.message);
    process.exit(1);
  }

  // 2. Fetch comments (instagram_business_manage_comments read)
  console.log(`\n[2/3] Calling GET /${mediaId}/comments to read comments...`);
  let commentId = null;
  try {
    const r2 = await axios.get(`https://graph.facebook.com/v21.0/${mediaId}/comments`, {
      params: {
        fields: 'id,text,username',
        access_token: ACCESS_TOKEN
      }
    });
    const comments = r2.data?.data || [];
    console.log(`      ✅ SUCCESS — comments list loaded (${comments.length} comments found)`);
    comments.forEach(c => {
      console.log(`         - [${c.id}] @${c.username}: ${c.text}`);
    });
    if (comments.length > 0) {
      commentId = comments[0].id;
    }
  } catch (e) {
    console.error('      ❌ FAILED to fetch comments:', e.response?.data?.error?.message || e.message);
  }

  // 3. Post a test comment reply (instagram_business_manage_comments write)
  if (commentId) {
    console.log(`\n[3/3] Calling POST /${commentId}/replies to reply to comment...`);
    try {
      const r3 = await axios.post(`https://graph.facebook.com/v21.0/${commentId}/replies`, null, {
        params: {
          message: 'Thank you for your comment! (Meta App Review Test Reply)',
          access_token: ACCESS_TOKEN
        }
      });
      console.log(`      ✅ SUCCESS — reply posted! Reply ID: ${r3.data?.id}`);
    } catch (e) {
      console.error('      ❌ FAILED to post reply:', e.response?.data?.error?.message || e.message);
    }
  } else {
    // If no existing comments, post a direct comment to the media
    console.log(`\n[3/3] No existing comments found. Posting a new top-level comment to media ${mediaId} instead...`);
    try {
      const r3 = await axios.post(`https://graph.facebook.com/v21.0/${mediaId}/comments`, null, {
        params: {
          message: 'Meta App Review Test Comment',
          access_token: ACCESS_TOKEN
        }
      });
      console.log(`      ✅ SUCCESS — comment posted! Comment ID: ${r3.data?.id}`);
    } catch (e) {
      console.error('      ❌ FAILED to post comment:', e.response?.data?.error?.message || e.message);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('✅ Comments test complete. Check Meta App Review dashboard for update.\n');
}

runCommentsTest();
