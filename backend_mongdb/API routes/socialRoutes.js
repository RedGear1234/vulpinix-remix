const express = require('express');
const router = express.Router();
const { authorizePlatform, handleCallback, getSocialAccounts, disconnectSocialAccount, generateCaption, getInstagramInsights, getHashtagInsights, getInstagramComments, postInstagramComment, getFacebookPosts, getFacebookComments, postFacebookComment } = require('../controllers/socialController');
const { requireAuth } = require('../middleware/auth');

// @route   GET /api/social/status
// @desc    Gets the status of connected social accounts
// @access  Public (should eventually be protected)
router.get('/status', getSocialAccounts);

// @route   GET /api/social/instagram/insights
// @desc    Fetches real Instagram post & account insights for authenticated user
// @access  Protected
router.get('/instagram/insights', requireAuth, getInstagramInsights);

// @route   GET /api/social/instagram/hashtag
// @desc    Searches a hashtag and returns top/recent posts with metrics
// @access  Protected
router.get('/instagram/hashtag', requireAuth, getHashtagInsights);

// @route   GET /api/social/instagram/comments/:mediaId
// @desc    Gets comments for a specific Instagram post
// @access  Protected
router.get('/instagram/comments/:mediaId', requireAuth, getInstagramComments);

// @route   POST /api/social/instagram/comments/:targetId
// @desc    Posts a comment or reply to an Instagram post/comment
// @access  Protected
router.post('/instagram/comments/:targetId', requireAuth, postInstagramComment);

// @route   GET /api/social/facebook/posts
// @desc    Fetches real Facebook page posts and account info for authenticated user
// @access  Protected
router.get('/facebook/posts', requireAuth, getFacebookPosts);

// @route   GET /api/social/facebook/comments/:postId
// @desc    Gets comments for a specific Facebook post
// @access  Protected
router.get('/facebook/comments/:postId', requireAuth, getFacebookComments);

// @route   POST /api/social/facebook/comments/:targetId
// @desc    Posts a comment or reply to a Facebook post/comment
// @access  Protected
router.post('/facebook/comments/:targetId', requireAuth, postFacebookComment);

// @route   DELETE /api/social/:platform
// @desc    Disconnects a social account
// @access  Public (should eventually be protected)
router.delete('/:platform', disconnectSocialAccount);

// @route   GET /api/social/auth/:platform
// @desc    Redirects user to the social platform's OAuth login page
// @access  Public (should eventually be protected to link to a specific user)
router.get('/auth/:platform', authorizePlatform);

// @route   GET /api/social/callback/:platform
// @desc    Handles the OAuth callback from the social platform
// @access  Public
router.get('/callback/:platform', handleCallback);

// @route   POST /api/social/generate-caption
// @desc    Generates an AI caption for uploaded media using Gemini
// @access  Public
router.post('/generate-caption', generateCaption);

module.exports = router;
