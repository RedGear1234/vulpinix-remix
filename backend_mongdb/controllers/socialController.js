const express = require('express');

const axios = require('axios');
const User = require('../models/user');

// Helper to get OAuth URL based on platform
const getOAuthUrl = (platform, userId) => {
  const REDIRECT_URI = `http://localhost:5000/api/social/callback/${platform}`;
  
  // Pass the userId in the state parameter so we know who logged in during the callback
  const stateString = userId ? `userId=${userId}` : 'social_auth_req';

  switch (platform) {
    case 'instagram':
    case 'facebook':
      const fbAppId = process.env.FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID';
      const fbScope = 'public_profile,email,instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,pages_manage_posts';
      return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${REDIRECT_URI}&state=${stateString}&scope=${fbScope}&auth_type=rerequest`;
      
    case 'twitter':
      const twitterClientId = process.env.TWITTER_CLIENT_ID || 'YOUR_TWITTER_CLIENT_ID';
      return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${twitterClientId}&redirect_uri=${REDIRECT_URI}&scope=tweet.read%20users.read%20tweet.write%20offline.access&state=${stateString}&code_challenge=challenge&code_challenge_method=plain`;
      
    case 'linkedin':
      const linkedinClientId = process.env.LINKEDIN_CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID';
      return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${REDIRECT_URI}&state=${stateString}&scope=r_liteprofile%20r_emailaddress`;
      
    case 'youtube':
      const googleClientId = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly`;
      
    default:
      return null;
  }
};

exports.authorizePlatform = (req, res) => {
  const { platform } = req.params;
  const { userId } = req.query; // Expect frontend to pass ?userId=...
  
  const authUrl = getOAuthUrl(platform, userId);
  if (!authUrl) {
    return res.status(400).json({ error: 'Unsupported platform' });
  }

  res.redirect(authUrl);
};

exports.handleCallback = async (req, res) => {
  const { platform } = req.params;
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`http://localhost:3000/social?error=${error}`);
  }

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    let userId = null;
    if (state && state.startsWith('userId=')) {
      userId = state.split('=')[1];
    }

    if (platform === 'facebook' || platform === 'instagram') {
      const REDIRECT_URI = `http://localhost:5000/api/social/callback/${platform}`;
      const fbAppId = process.env.FACEBOOK_APP_ID;
      const fbAppSecret = process.env.FACEBOOK_APP_SECRET;

      // Exchange code for access token
      const tokenResponse = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
        params: {
          client_id: fbAppId,
          redirect_uri: REDIRECT_URI,
          client_secret: fbAppSecret,
          code: code
        }
      });
      
      const accessToken = tokenResponse.data.access_token;
      console.log(`Successfully fetched access token for ${platform}!`);

      // If we have a userId, save it. If not, fallback to shubhamchavan@live.com
      let targetUser = null;
      if (userId) {
        if (userId.includes('@')) {
          targetUser = await User.findOne({ email: userId });
        } else {
          try { targetUser = await User.findById(userId); } catch (e) {}
        }
      } 
      if (!targetUser) {
        targetUser = await User.findOne({ email: "shubhamchavan@live.com" });
      }

      if (targetUser) {
        if (!targetUser.socialAccounts) targetUser.socialAccounts = {};
        
        targetUser.socialAccounts.facebook = {
          accessToken: accessToken,
          pageId: "", // Will be filled later
          pageAccessToken: ""
        };
        
        // Also save it under instagram since they share the same token
        targetUser.socialAccounts.instagram = {
          accessToken: accessToken,
          igAccountId: ""
        };
        
        await targetUser.save();
        console.log(`Saved Meta tokens to user: ${targetUser.email}`);
      }
    }

    res.redirect(`http://localhost:3000/social?success=true&platform=${platform}`);
  } catch (err) {
    console.error(`Error handling ${platform} callback:`, err.response?.data || err.message);
    res.redirect(`http://localhost:3000/social?error=auth_failed`);
  }
};
