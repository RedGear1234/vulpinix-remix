const express = require('express');
const router = express.Router();
const { authorizePlatform, handleCallback, getSocialAccounts, disconnectSocialAccount, generateCaption, getInstagramInsights } = require('../controllers/socialController');
const { requireAuth } = require('../middleware/auth');

// @route   GET /api/social/status
// @desc    Gets the status of connected social accounts
// @access  Public (should eventually be protected)
router.get('/status', getSocialAccounts);

// @route   GET /api/social/instagram/insights
// @desc    Fetches real Instagram post & account insights for authenticated user
// @access  Protected
router.get('/instagram/insights', requireAuth, getInstagramInsights);

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
