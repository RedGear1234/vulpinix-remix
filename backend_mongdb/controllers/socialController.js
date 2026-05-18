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
      const twitterClientId = process.env.TWITTER_CLIENT_ID;
      if (!twitterClientId || twitterClientId.startsWith('paste_') || twitterClientId === 'your_twitter_client_id') {
        return null; // Signals missing config
      }
      return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${twitterClientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=tweet.read%20users.read%20tweet.write%20offline.access&state=${stateString}&code_challenge=challenge&code_challenge_method=plain`;
      
    case 'linkedin':
      const linkedinClientId = process.env.LINKEDIN_CLIENT_ID || 'YOUR_LINKEDIN_CLIENT_ID';
      return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${REDIRECT_URI}&state=${stateString}&scope=r_liteprofile%20r_emailaddress`;
      
    case 'youtube':
      const googleClientId = process.env.GOOGLE_CLIENT_ID;
      if (!googleClientId || googleClientId === 'YOUR_GOOGLE_CLIENT_ID') return null;
      // Request offline access to get a refresh token, and prompt=consent to ensure we get it
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload%20https://www.googleapis.com/auth/youtube.readonly&access_type=offline&prompt=consent&state=${stateString}`;
      
    default:
      return null;
  }
};

exports.authorizePlatform = (req, res) => {
  const { platform } = req.params;
  const { userId } = req.query; // Expect frontend to pass ?userId=...
  
  const authUrl = getOAuthUrl(platform, userId);
  if (!authUrl) {
    // authUrl is null — either unsupported platform or missing credentials
    const missingCreds = ['twitter', 'linkedin'].includes(platform);
    if (missingCreds) {
      return res.redirect(`http://localhost:3000/social?error=missing_credentials&platform=${platform}`);
    }
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
    console.log(`[OAUTH CALLBACK] Received state from Google:`, state);
    
    if (state && state.startsWith('userId=')) {
      userId = state.split('=')[1];
      console.log(`[OAUTH CALLBACK] Extracted userId:`, userId);
    } else {
      console.log(`[OAUTH CALLBACK] State did not contain userId. Using default fallback.`);
    }

    if (platform === 'facebook' || platform === 'instagram') {
      const REDIRECT_URI = `http://localhost:5000/api/social/callback/${platform}`;
      const fbAppId = process.env.FACEBOOK_APP_ID;
      const fbAppSecret = process.env.FACEBOOK_APP_SECRET;

      // 1. Exchange code for user access token
      const tokenResponse = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
        params: {
          client_id: fbAppId,
          redirect_uri: REDIRECT_URI,
          client_secret: fbAppSecret,
          code: code
        }
      });
      
      const shortLivedToken = tokenResponse.data.access_token;
      console.log(`Successfully fetched short-lived user access token for ${platform}!`);

      // ✅ CRITICAL: Exchange for a 60-day long-lived token to prevent expiry
      let accessToken = shortLivedToken;
      try {
        const longLivedRes = await axios.get(`https://graph.facebook.com/v18.0/oauth/access_token`, {
          params: {
            grant_type: 'fb_exchange_token',
            client_id: fbAppId,
            client_secret: fbAppSecret,
            fb_exchange_token: shortLivedToken
          }
        });
        accessToken = longLivedRes.data.access_token;
        const expiresIn = longLivedRes.data.expires_in;
        console.log(`✅ Long-lived token obtained! Expires in: ${Math.round(expiresIn / 86400)} days`);
      } catch (llErr) {
        console.warn(`⚠️ Could not exchange for long-lived token, using short-lived token:`, llErr.response?.data?.error?.message || llErr.message);
      }

      // 2. Fetch Pages and potential Instagram accounts
      let fbPageId = "";
      let fbPageToken = "";
      let igAccountId = "";
      let igUsername = "";

      try {
        const pagesRes = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`);
        let pages = pagesRes.data.data || [];

        // Fallback for specific Page ID if list is empty (common in dev/restricted apps)
        if (pages.length === 0) {
          try {
            const forceRes = await axios.get(`https://graph.facebook.com/v18.0/1111932568671242?fields=access_token,name&access_token=${accessToken}`);
            if (forceRes.data && forceRes.data.access_token) pages = [forceRes.data];
          } catch (e) {}
        }

        if (pages.length > 0) {
          // We'll take the first page that has a linked Instagram account, or just the first page
          let selectedPage = pages[0];
          
          for (const p of pages) {
            const igRes = await axios.get(`https://graph.facebook.com/v18.0/${p.id}?fields=instagram_business_account&access_token=${p.access_token || accessToken}`);
            if (igRes.data?.instagram_business_account) {
              selectedPage = p;
              igAccountId = igRes.data.instagram_business_account.id;
              
              // Get IG username
              const igDetails = await axios.get(`https://graph.facebook.com/v18.0/${igAccountId}?fields=username&access_token=${p.access_token || accessToken}`);
              igUsername = igDetails.data.username;
              break;
            }
          }
          
          fbPageId = selectedPage.id;
          fbPageToken = selectedPage.access_token;
        }
      } catch (metaErr) {
        console.error("Error fetching Meta account details:", metaErr.response?.data || metaErr.message);
      }

      // 3. Save to User Model
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
        
        // Only save the platform the user actually clicked to connect
        if (platform === 'facebook') {
          targetUser.socialAccounts.facebook = {
            accessToken: accessToken,
            pageId: fbPageId,
            pageAccessToken: fbPageToken
          };
          console.log(`✅ Linked Facebook for user: ${targetUser.email}`);
        }
        
        if (platform === 'instagram') {
          if (igAccountId) {
            targetUser.socialAccounts.instagram = {
              accessToken: accessToken,
              igAccountId: igAccountId,
              username: igUsername,
              pageId: fbPageId,
              pageAccessToken: fbPageToken
            };
            console.log(`✅ Linked Instagram (IG Account: ${igAccountId}) for user: ${targetUser.email}`);
          } else {
            console.log(`⚠️ No IG Business Account found on Page for user: ${targetUser.email}`);
            console.log(`   → Make sure your Instagram is a Business/Creator account linked to your Facebook Page.`);
          }
        }
        
        await targetUser.save();
      }
    } else if (platform === 'twitter') {
      const REDIRECT_URI = `http://localhost:5000/api/social/callback/twitter`;
      const twitterClientId = process.env.TWITTER_CLIENT_ID;
      const twitterClientSecret = process.env.TWITTER_CLIENT_SECRET;

      let access_token = null;
      let refresh_token = null;
      let twitterUsername = null;

      if (!twitterClientId) {
        throw new Error('TWITTER_CLIENT_ID is not configured in backend .env');
      }

      try {
        const params = new URLSearchParams();
        params.append('code', code);
        params.append('grant_type', 'authorization_code');
        params.append('client_id', twitterClientId);
        params.append('redirect_uri', REDIRECT_URI);
        params.append('code_verifier', 'challenge'); // Must match the plain code_challenge sent during auth

        const headers = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        if (twitterClientSecret) {
          const credentials = Buffer.from(`${twitterClientId}:${twitterClientSecret}`).toString('base64');
          headers['Authorization'] = `Basic ${credentials}`;
        }

        const tokenResponse = await axios.post('https://api.twitter.com/2/oauth2/token', params, { headers });
        access_token = tokenResponse.data.access_token;
        refresh_token = tokenResponse.data.refresh_token;

        try {
          const userRes = await axios.get('https://api.twitter.com/2/users/me', {
            headers: { 'Authorization': `Bearer ${access_token}` }
          });
          twitterUsername = userRes.data?.data?.username;
        } catch (uErr) {
          console.error('Error fetching Twitter user info:', uErr.response?.data || uErr.message);
        }
      } catch (authErr) {
        console.error('Real Twitter OAuth failed:', authErr.response?.data || authErr.message);
        const errMsg = authErr.response?.data?.error_description || authErr.response?.data?.error || authErr.message;
        return res.redirect(`http://localhost:3000/social?error=${encodeURIComponent('Twitter Auth Failed: ' + errMsg)}`);
      }

      // Save to User Model
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
        targetUser.socialAccounts.twitter = {
          accessToken: access_token,
          refreshToken: refresh_token,
          username: twitterUsername
        };
        await targetUser.save();
        console.log(`✅ Saved Twitter credentials for ${targetUser.email}`);
      }
    } else if (platform === 'youtube') {
      const REDIRECT_URI = `http://localhost:5000/api/social/callback/youtube`;
      const googleClientId = process.env.GOOGLE_CLIENT_ID;
      const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!googleClientId || !googleClientSecret) {
        throw new Error('Google Client ID/Secret not configured in .env');
      }

      // 1. Exchange code for token
      const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      });

      const access_token = tokenRes.data.access_token;
      const refresh_token = tokenRes.data.refresh_token;

      // 2. Get YouTube Channel Info
      let channelTitle = "YouTube Channel";
      let channelId = "";
      try {
        const ytRes = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true`, {
          headers: { Authorization: `Bearer ${access_token}` }
        });
        if (ytRes.data.items && ytRes.data.items.length > 0) {
          channelTitle = ytRes.data.items[0].snippet.title;
          channelId = ytRes.data.items[0].id;
        }
      } catch (ytErr) {
        console.error("⚠️ Could not fetch YouTube channel info (user might not have a channel):", ytErr.response?.data || ytErr.message);
      }

      // 3. Save to User Model
      let targetUser = null;
      if (userId) {
        if (userId.includes('@')) {
          console.log(`[OAUTH CALLBACK] Searching for user by email:`, userId);
          targetUser = await User.findOne({ email: userId });
        } else {
          console.log(`[OAUTH CALLBACK] Searching for user by ID:`, userId);
          try { targetUser = await User.findById(userId); } catch (e) {}
        }
      }
      
      console.log(`[OAUTH CALLBACK] targetUser found before fallback?`, !!targetUser);
      if (!targetUser) {
        console.log(`[OAUTH CALLBACK] targetUser not found. Falling back to any user.`);
        targetUser = await User.findOne({});
      }

      if (targetUser) {
        if (!targetUser.socialAccounts) targetUser.socialAccounts = {};
        targetUser.socialAccounts.youtube = {
          accessToken: access_token,
          refreshToken: refresh_token,
          channelId: channelId,
          channelTitle: channelTitle
        };
        targetUser.markModified('socialAccounts');
        await targetUser.save();
        console.log(`✅ Saved YouTube credentials for ${targetUser.email}`);
      }
    }

    res.redirect(`http://localhost:3000/social?success=true&platform=${platform}`);
  } catch (err) {
    console.error(`Error handling ${platform} callback:`, err.response?.data || err.message);
    const errMsg = err.response?.data?.error?.message || err.message || 'auth_failed';
    res.redirect(`http://localhost:3000/social?error=${encodeURIComponent(errMsg)}`);
  }
};

exports.getSocialAccounts = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    let user = null;
    if (userId && userId.includes('@')) {
      user = await User.findOne({ email: userId });
    } else if (userId) {
      try { user = await User.findById(userId); } catch (e) {}
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    const socialStatus = {
      facebook: !!user.socialAccounts?.facebook?.accessToken,
      instagram: !!user.socialAccounts?.instagram?.igAccountId,
      twitter: !!user.socialAccounts?.twitter?.accessToken,
      linkedin: !!user.socialAccounts?.linkedin?.accessToken,
      youtube: !!user.socialAccounts?.youtube?.accessToken,
      handles: {
        facebook: user.socialAccounts?.facebook?.pageId ? "Connected Page" : null,
        instagram: user.socialAccounts?.instagram?.username ? `@${user.socialAccounts.instagram.username}` : null,
        twitter: user.socialAccounts?.twitter?.username ? `@${user.socialAccounts.twitter.username}` : null,
        youtube: user.socialAccounts?.youtube?.channelTitle ? user.socialAccounts.youtube.channelTitle : null,
      }
    };

    res.json({ success: true, socialStatus });
  } catch (err) {
    console.error("Error fetching social accounts:", err);
    res.status(500).json({ error: "Server error" });
  }
};exports.disconnectSocialAccount = async (req, res) => {
  try {
    const { platform } = req.params;
    const userId = req.user?.id || req.query.userId;
    
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    let user = null;
    if (userId.includes('@')) {
      user = await User.findOne({ email: userId });
    } else {
      try { user = await User.findById(userId); } catch (e) {}
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.socialAccounts && user.socialAccounts[platform]) {
      user.socialAccounts[platform] = undefined;
      // If disconnecting Meta platforms, maybe clear both? 
      // For now, let's just clear the one requested.
      await user.save();
    }

    res.json({ success: true, message: `${platform} disconnected` });
  } catch (err) {
    console.error("Error disconnecting account:", err);
    res.status(500).json({ error: "Server error" });
  }
};
