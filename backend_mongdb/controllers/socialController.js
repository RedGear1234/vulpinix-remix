const express = require('express');

const axios = require('axios');
const User = require('../models/user');

// ── Base URLs ─────────────────────────────────────────────────────────────────
// Override via BACKEND_URL / FRONTEND_URL env vars on Render dashboard.
// Defaults to production URLs so OAuth works even without env vars set.
const BACKEND_URL = process.env.BACKEND_URL || 'https://vulpinix-backend.onrender.com';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://vulpinix-remix.vercel.app';

// Helper to get OAuth URL based on platform
const getOAuthUrl = (platform, userId) => {
  const REDIRECT_URI = `${BACKEND_URL}/api/social/callback/${platform}`;
  
  // Pass the userId in the state parameter so we know who logged in during the callback
  const stateString = userId ? `userId=${userId}` : 'social_auth_req';

  switch (platform) {
    case 'instagram':
    case 'facebook':
      const fbAppId = process.env.FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID';
      const fbScope = 'public_profile,email,instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement,pages_manage_posts';
      return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${fbAppId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${encodeURIComponent(stateString)}&scope=${fbScope}&auth_type=rerequest`;
      
    case 'twitter':
      const twitterClientId = process.env.TWITTER_CLIENT_ID;
      if (!twitterClientId || twitterClientId.startsWith('paste_') || twitterClientId === 'your_twitter_client_id') {
        return null; // Signals missing config
      }
      return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${twitterClientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=tweet.read%20users.read%20tweet.write%20offline.access&state=${encodeURIComponent(stateString)}&code_challenge=challenge&code_challenge_method=plain`;
      
    case 'linkedin':
      const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
      const linkedinClientSecret = process.env.LINKEDIN_CLIENT_SECRET;
      if (!linkedinClientId || linkedinClientId.startsWith('your_') || !linkedinClientSecret) return null;
      // openid and profile for identity, w_member_social for posting.
      // Note: User MUST add "Sign In with LinkedIn using OpenID Connect" product in their developer portal.
      return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinClientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${encodeURIComponent(stateString)}&scope=openid%20profile%20w_member_social`;
      
    case 'youtube':
      const googleClientId = process.env.GOOGLE_CLIENT_ID;
      if (!googleClientId || googleClientId === 'YOUR_GOOGLE_CLIENT_ID') return null;
      // Request offline access to get a refresh token, and prompt=consent to ensure we get it
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload%20https://www.googleapis.com/auth/youtube.readonly&access_type=offline&prompt=consent&state=${encodeURIComponent(stateString)}`;
      
    case 'pinterest':
      const pinterestClientId = process.env.PINTEREST_CLIENT_ID;
      const pinterestClientSecret = process.env.PINTEREST_CLIENT_SECRET;
      if (!pinterestClientId || pinterestClientId.startsWith('your_') || !pinterestClientSecret) return null;
      // Use https to bypass Pinterest's developer dashboard validation restrictions
      const pinterestRedirectUri = `${BACKEND_URL}/api/social/callback/pinterest`;
      return `https://www.pinterest.com/oauth/?client_id=${pinterestClientId}&redirect_uri=${encodeURIComponent(pinterestRedirectUri)}&response_type=code&scope=user_accounts:read,boards:read,pins:read,pins:write&state=${encodeURIComponent(stateString)}`;
 
    case 'threads':
      const threadsAppId = process.env.FACEBOOK_APP_ID;
      const threadsAppSecret = process.env.FACEBOOK_APP_SECRET;
      if (!threadsAppId || !threadsAppSecret) return null;
      const threadsRedirectUri = `${BACKEND_URL}/api/social/callback/threads`;
      // Threads OAuth — uses threads.net with threads_basic scope
      return `https://threads.net/oauth/authorize?client_id=${threadsAppId}&redirect_uri=${encodeURIComponent(threadsRedirectUri)}&scope=threads_basic,threads_content_publish&response_type=code&state=${encodeURIComponent(stateString)}`;

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
    const missingCreds = ['twitter', 'linkedin', 'youtube', 'pinterest', 'threads'].includes(platform);
    if (missingCreds) {
      return res.redirect(`${FRONTEND_URL}/social?error=missing_credentials&platform=${platform}`);
    }
    return res.status(400).json({ error: 'Unsupported platform' });
  }

  res.redirect(authUrl);
};

exports.handleCallback = async (req, res) => {
  const { platform } = req.params;
  const { code, state, error } = req.query;

  if (error) {
    return res.redirect(`${FRONTEND_URL}/social?error=${error}`);
  }

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    let userId = null;
    console.log(`[OAUTH CALLBACK] Received state:`, state);
    
    try {
      // Decode in case the browser double-encoded it
      const decodedState = decodeURIComponent(state || '');
      if (decodedState.startsWith('userId=')) {
        userId = decodedState.split('=')[1].trim();
        console.log(`[OAUTH CALLBACK] Extracted userId from state:`, userId);
      } else {
        console.log(`[OAUTH CALLBACK] State did not contain userId:`, decodedState);
      }
    } catch (stateErr) {
      console.warn('[OAUTH CALLBACK] Could not parse state parameter:', stateErr.message);
    }

    if (platform === 'facebook' || platform === 'instagram') {
      const REDIRECT_URI = `${BACKEND_URL}/api/social/callback/${platform}`;
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
      let igDetailsData = {};

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
            try {
              const igRes = await axios.get(`https://graph.facebook.com/v18.0/${p.id}?fields=instagram_business_account&access_token=${p.access_token || accessToken}`);
              if (igRes.data?.instagram_business_account) {
                selectedPage = p;
                igAccountId = igRes.data.instagram_business_account.id;
                
                // Get IG details
                try {
                  const igDetails = await axios.get(`https://graph.facebook.com/v18.0/${igAccountId}?fields=username,name,profile_picture_url,biography,followers_count,follows_count,media_count&access_token=${p.access_token || accessToken}`);
                  igDetailsData = igDetails.data;
                  igUsername = igDetails.data.username;
                } catch (detErr) {
                  console.error("Error fetching IG details:", detErr.response?.data || detErr.message);
                  igUsername = "Instagram User";
                }
                break;
              }
            } catch (pageErr) {
              console.warn(`⚠️ Could not check IG account for page ${p.id}:`, pageErr.response?.data?.error?.message || pageErr.message);
            }
          }
          
          fbPageId = selectedPage.id;
          fbPageToken = selectedPage.access_token;
        }
      } catch (metaErr) {
        console.error("Error fetching Meta account details:", metaErr.response?.data || metaErr.message);
      }

      // 3. Save to User Model
      // Priority: state userId → Meta email lookup → error out
      let targetUser = null;
      if (userId) {
        if (userId.includes('@')) {
          targetUser = await User.findOne({ email: userId.toLowerCase().trim() });
          console.log(`[OAUTH] Looked up by email "${userId}": ${targetUser ? 'found' : 'NOT found'}`);
        } else {
          try {
            targetUser = await User.findById(userId);
            console.log(`[OAUTH] Looked up by ID "${userId}": ${targetUser ? 'found' : 'NOT found'}`);
          } catch (e) {
            console.warn('[OAUTH] findById failed:', e.message);
          }
        }
      }

      // Fallback: try to find via the Meta user's own email
      if (!targetUser) {
        console.log('[OAUTH] userId lookup failed. Trying Meta /me?fields=email to identify user...');
        try {
          const meRes = await axios.get(`https://graph.facebook.com/v18.0/me?fields=email&access_token=${accessToken}`);
          const metaEmail = meRes.data?.email;
          console.log('[OAUTH] Meta account email:', metaEmail);
          if (metaEmail) {
            targetUser = await User.findOne({ email: metaEmail.toLowerCase().trim() });
            console.log(`[OAUTH] Looked up by Meta email "${metaEmail}": ${targetUser ? 'found' : 'NOT found'}`);
          }
        } catch (meErr) {
          console.warn('[OAUTH] Could not fetch Meta /me email:', meErr.response?.data?.error?.message || meErr.message);
        }
      }

      if (!targetUser) {
        console.error('[OAUTH] ❌ Could not identify any user for this OAuth callback. Aborting save.');
        return res.redirect(`${FRONTEND_URL}/social?error=${encodeURIComponent('Could not identify your account. Please log in to Vulpinix first and try again.')}`);
      }

      console.log(`[OAUTH] ✅ Target user identified: ${targetUser.email}`);
      if (!targetUser.socialAccounts) targetUser.socialAccounts = {};

      // Only save the platform the user actually clicked to connect
      if (platform === 'facebook') {
        targetUser.socialAccounts.facebook = {
          accessToken: accessToken,
          pageId: fbPageId,
          pageAccessToken: fbPageToken
        };
        targetUser.markModified('socialAccounts');
        await targetUser.save();
        console.log(`✅ Linked Facebook for user: ${targetUser.email}`);
        return res.redirect(`${FRONTEND_URL}/social?success=true&platform=facebook`);
      }

      if (platform === 'instagram') {
        if (igAccountId) {
          targetUser.socialAccounts.instagram = {
            accessToken: accessToken,
            igAccountId: igAccountId,
            username: igUsername || igDetailsData.username,
            name: igDetailsData.name || "",
            profilePictureUrl: igDetailsData.profile_picture_url || "",
            biography: igDetailsData.biography || "",
            followersCount: igDetailsData.followers_count || 0,
            followsCount: igDetailsData.follows_count || 0,
            mediaCount: igDetailsData.media_count || 0,
            pageId: fbPageId,
            pageAccessToken: fbPageToken
          };
          targetUser.markModified('socialAccounts');
          await targetUser.save();
          console.log(`✅ Linked Instagram (IG Account: ${igAccountId}) for user: ${targetUser.email}`);
          return res.redirect(`${FRONTEND_URL}/social?success=true&platform=instagram`);
        } else {
          console.log(`⚠️ No IG Business Account found on Page for user: ${targetUser.email}`);
          console.log(`   → Make sure your Instagram is a Business/Creator account linked to your Facebook Page.`);
          return res.redirect(`${FRONTEND_URL}/social?error=${encodeURIComponent('No Instagram Business account found. Ensure your Instagram is a Business/Creator account linked to your Facebook Page.')}`);
        }
      }
    } else if (platform === 'twitter') {
      const REDIRECT_URI = `${BACKEND_URL}/api/social/callback/twitter`;
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
        return res.redirect(`${FRONTEND_URL}/social?error=${encodeURIComponent('Twitter Auth Failed: ' + errMsg)}`);
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
      const REDIRECT_URI = `${BACKEND_URL}/api/social/callback/youtube`;
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
    } else if (platform === 'linkedin') {
      const REDIRECT_URI = `${BACKEND_URL}/api/social/callback/linkedin`;
      const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
      const linkedinClientSecret = process.env.LINKEDIN_CLIENT_SECRET;

      if (!linkedinClientId || !linkedinClientSecret) {
        throw new Error('LinkedIn Client ID/Secret not configured in .env');
      }

      // 1. Exchange code for access token
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', REDIRECT_URI);
      params.append('client_id', linkedinClientId);
      params.append('client_secret', linkedinClientSecret);

      const tokenRes = await axios.post(
        'https://www.linkedin.com/oauth/v2/accessToken',
        params,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const access_token = tokenRes.data.access_token;
      console.log(`✅ [LINKEDIN] Access token received.`);

      // 2. Fetch LinkedIn profile using Verified on LinkedIn /rest/identityMe, legacy /v2/me, or OpenID Connect
      let linkedinId = '';
      let linkedinName = '';
      try {
        console.log("🔍 [LINKEDIN] Fetching profile info via /rest/identityMe...");
        const profileRes = await axios.get('https://api.linkedin.com/rest/identityMe', {
          headers: { 
            'Authorization': `Bearer ${access_token}`,
            'LinkedIn-Version': '202401'
          }
        });
        const fullUrn = profileRes.data?.id || '';
        linkedinId = fullUrn.split(':').pop();
        linkedinName = profileRes.data?.name || 'LinkedIn User';
        console.log(`✅ [LINKEDIN] Profile fetched: ${linkedinName} (ID: ${linkedinId})`);
      } catch (idMeErr) {
        console.log('⚠️ [LINKEDIN] Could not fetch profile via /rest/identityMe:', idMeErr.response?.data || idMeErr.message);
        try {
          console.log("🔍 [LINKEDIN] Fetching profile info via /v2/me...");
          const profileRes = await axios.get('https://api.linkedin.com/v2/me', {
            headers: { 'Authorization': `Bearer ${access_token}` }
          });
          linkedinId   = profileRes.data?.id || '';
          const first  = profileRes.data?.localizedFirstName || '';
          const last   = profileRes.data?.localizedLastName || '';
          linkedinName = `${first} ${last}`.trim() || 'LinkedIn User';
          console.log(`✅ [LINKEDIN] Profile fetched: ${linkedinName} (ID: ${linkedinId})`);
        } catch (profileErr) {
          console.log('⚠️ [LINKEDIN] Could not fetch profile via /v2/me, trying /v2/userinfo...', profileErr.message);
          try {
            const profileRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
              headers: { 'Authorization': `Bearer ${access_token}` }
            });
            linkedinId   = profileRes.data?.sub || '';
            const first  = profileRes.data?.given_name || '';
            const last   = profileRes.data?.family_name || '';
            linkedinName = `${first} ${last}`.trim() || 'LinkedIn User';
            console.log(`✅ [LINKEDIN] Profile fetched via /v2/userinfo: ${linkedinName} (ID: ${linkedinId})`);
          } catch (uiErr) {
            console.error('❌ [LINKEDIN] All profile fetch attempts failed:', uiErr.response?.data || uiErr.message);
          }
        }
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
        targetUser = await User.findOne({});
        console.log(`[LINKEDIN CALLBACK] Using fallback user: ${targetUser?.email}`);
      }

      if (targetUser) {
        if (!targetUser.socialAccounts) targetUser.socialAccounts = {};
        targetUser.socialAccounts.linkedin = {
          accessToken: access_token,
          linkedinId:  linkedinId,
          linkedinName: linkedinName
        };
        targetUser.markModified('socialAccounts');
        await targetUser.save();
        console.log(`✅ [LINKEDIN] Saved credentials for ${targetUser.email}`);
      }
    } else if (platform === 'pinterest') {
      const REDIRECT_URI = `${BACKEND_URL}/api/social/callback/pinterest`;
      const pinterestClientId = process.env.PINTEREST_CLIENT_ID;
      const pinterestClientSecret = process.env.PINTEREST_CLIENT_SECRET;

      if (!pinterestClientId || !pinterestClientSecret) {
        throw new Error('Pinterest Client ID/Secret not configured in .env');
      }

      // 1. Exchange code for access token using Basic Auth
      const authStr = Buffer.from(`${pinterestClientId}:${pinterestClientSecret}`).toString('base64');
      
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', REDIRECT_URI);

      const tokenRes = await axios.post(
        'https://api.pinterest.com/v5/oauth/token',
        params,
        {
          headers: {
            'Authorization': `Basic ${authStr}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const { access_token, refresh_token } = tokenRes.data;
      console.log(`✅ [PINTEREST] Access token received.`);

      // 2. Fetch Pinterest profile username
      let username = 'Pinterest User';
      try {
        console.log("🔍 [PINTEREST] Fetching profile info via /v5/user_account...");
        const profileRes = await axios.get('https://api.pinterest.com/v5/user_account', {
          headers: { 'Authorization': `Bearer ${access_token}` }
        });
        username = profileRes.data?.username || 'Pinterest User';
        console.log(`✅ [PINTEREST] Profile fetched: ${username}`);
      } catch (profErr) {
        console.error('❌ [PINTEREST] Profile fetch failed:', profErr.response?.data || profErr.message);
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
        targetUser = await User.findOne({});
      }

      if (targetUser) {
        if (!targetUser.socialAccounts) targetUser.socialAccounts = {};
        targetUser.socialAccounts.pinterest = {
          accessToken: access_token,
          refreshToken: refresh_token,
          username: username
        };
        targetUser.markModified('socialAccounts');
        await targetUser.save();
        console.log(`✅ [PINTEREST] Saved credentials for ${targetUser.email}`);
      }
    } else if (platform === 'threads') {
      const REDIRECT_URI = `${BACKEND_URL}/api/social/callback/threads`;
      const threadsAppId = process.env.FACEBOOK_APP_ID;
      const threadsAppSecret = process.env.FACEBOOK_APP_SECRET;

      if (!threadsAppId || !threadsAppSecret) {
        throw new Error('Facebook App ID/Secret (used for Threads) not configured in .env');
      }

      // 1. Exchange code for short-lived token
      const tokenParams = new URLSearchParams();
      tokenParams.append('client_id', threadsAppId);
      tokenParams.append('client_secret', threadsAppSecret);
      tokenParams.append('grant_type', 'authorization_code');
      tokenParams.append('redirect_uri', REDIRECT_URI);
      tokenParams.append('code', code);

      const tokenRes = await axios.post(
        'https://graph.threads.net/oauth/access_token',
        tokenParams,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const shortToken = tokenRes.data.access_token;
      const threadsUserId = tokenRes.data.user_id;
      console.log(`✅ [THREADS] Short-lived token obtained for user_id: ${threadsUserId}`);

      // 2. Exchange for long-lived token (60 days)
      let access_token = shortToken;
      try {
        const llRes = await axios.get(
          `https://graph.threads.net/access_token?grant_type=th_exchange_token&client_secret=${threadsAppSecret}&access_token=${shortToken}`
        );
        access_token = llRes.data.access_token;
        console.log(`✅ [THREADS] Long-lived token obtained. Expires in: ${Math.round((llRes.data.expires_in || 0) / 86400)} days`);
      } catch (llErr) {
        console.warn(`⚠️ [THREADS] Could not exchange for long-lived token:`, llErr.response?.data || llErr.message);
      }

      // 3. Fetch Threads profile (username)
      let threadsUsername = 'Threads User';
      try {
        const profileRes = await axios.get(
          `https://graph.threads.net/v1.0/me?fields=id,username,name&access_token=${access_token}`
        );
        threadsUsername = profileRes.data?.username || profileRes.data?.name || 'Threads User';
        console.log(`✅ [THREADS] Profile fetched: @${threadsUsername}`);
      } catch (profErr) {
        console.error('❌ [THREADS] Profile fetch failed:', profErr.response?.data || profErr.message);
      }

      // 4. Save to User Model
      let targetUser = null;
      if (userId) {
        if (userId.includes('@')) {
          targetUser = await User.findOne({ email: userId });
        } else {
          try { targetUser = await User.findById(userId); } catch (e) {}
        }
      }
      if (!targetUser) targetUser = await User.findOne({});

      if (targetUser) {
        if (!targetUser.socialAccounts) targetUser.socialAccounts = {};
        targetUser.socialAccounts.threads = {
          accessToken: access_token,
          threadsUserId: threadsUserId,
          username: threadsUsername
        };
        targetUser.markModified('socialAccounts');
        await targetUser.save();
        console.log(`✅ [THREADS] Saved credentials for ${targetUser.email}`);
      }
    }

    res.redirect(`${FRONTEND_URL}/social?success=true&platform=${platform}`);
  } catch (err) {
    console.error(`Error handling ${platform} callback:`, err.response?.data || err.message);
    const errMsg = err.response?.data?.error?.message || err.message || 'auth_failed';
    res.redirect(`${FRONTEND_URL}/social?error=${encodeURIComponent(errMsg)}`);
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

    let igDetails = null;
    if (user.socialAccounts?.instagram?.igAccountId) {
      const ig = user.socialAccounts.instagram;
      const token = ig.pageAccessToken || ig.accessToken;
      if (token) {
        try {
          const igRes = await axios.get(`https://graph.facebook.com/v18.0/${ig.igAccountId}?fields=username,name,profile_picture_url,biography,followers_count,follows_count,media_count&access_token=${token}`);
          if (igRes.data) {
            igDetails = {
              username: igRes.data.username,
              name: igRes.data.name || "",
              profilePictureUrl: igRes.data.profile_picture_url || "",
              biography: igRes.data.biography || "",
              followersCount: igRes.data.followers_count || 0,
              followsCount: igRes.data.follows_count || 0,
              mediaCount: igRes.data.media_count || 0,
            };
            
            // Save to database
            user.socialAccounts.instagram.username = igRes.data.username;
            user.socialAccounts.instagram.name = igRes.data.name || "";
            user.socialAccounts.instagram.profilePictureUrl = igRes.data.profile_picture_url || "";
            user.socialAccounts.instagram.biography = igRes.data.biography || "";
            user.socialAccounts.instagram.followersCount = igRes.data.followers_count || 0;
            user.socialAccounts.instagram.followsCount = igRes.data.follows_count || 0;
            user.socialAccounts.instagram.mediaCount = igRes.data.media_count || 0;
            user.markModified('socialAccounts');
            await user.save();
          }
        } catch (igErr) {
          console.warn("⚠️ Could not fetch latest Instagram details in status endpoint:", igErr.response?.data || igErr.message);
        }
      }
    }

    if (!igDetails && user.socialAccounts?.instagram?.igAccountId) {
      const ig = user.socialAccounts.instagram;
      igDetails = {
        username: ig.username,
        name: ig.name || "",
        profilePictureUrl: ig.profilePictureUrl || "",
        biography: ig.biography || "",
        followersCount: ig.followersCount || 0,
        followsCount: ig.followsCount || 0,
        mediaCount: ig.mediaCount || 0,
      };
    }

    const socialStatus = {
      facebook: !!user.socialAccounts?.facebook?.accessToken,
      instagram: !!user.socialAccounts?.instagram?.igAccountId,
      twitter: !!user.socialAccounts?.twitter?.accessToken,
      linkedin: !!user.socialAccounts?.linkedin?.accessToken,
      youtube: !!user.socialAccounts?.youtube?.accessToken,
      pinterest: !!user.socialAccounts?.pinterest?.accessToken || !!process.env.PINTEREST_PERSONAL_ACCESS_TOKEN,
      threads: !!user.socialAccounts?.threads?.accessToken,
      handles: {
        facebook: user.socialAccounts?.facebook?.pageId ? "Connected Page" : null,
        instagram: user.socialAccounts?.instagram?.username ? `@${user.socialAccounts.instagram.username}` : null,
        twitter: user.socialAccounts?.twitter?.username ? `@${user.socialAccounts.twitter.username}` : null,
        youtube: user.socialAccounts?.youtube?.channelTitle ? user.socialAccounts.youtube.channelTitle : null,
        linkedin: user.socialAccounts?.linkedin?.linkedinName ? user.socialAccounts.linkedin.linkedinName : null,
        pinterest: user.socialAccounts?.pinterest?.username ? `@${user.socialAccounts.pinterest.username}` : (process.env.PINTEREST_PERSONAL_ACCESS_TOKEN ? "Developer Account" : null),
        threads: user.socialAccounts?.threads?.username ? `@${user.socialAccounts.threads.username}` : null,
      }
    };

    res.json({ success: true, socialStatus, instagramInfo: igDetails });
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

// ── AI Caption Generator ───────────────────────────────────────────────────────
// ── Instagram Media Insights ───────────────────────────────────────────────────
exports.getInstagramInsights = async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let user = null;
    if (userId && userId.includes('@')) {
      user = await User.findOne({ email: userId });
    } else if (userId) {
      try { user = await User.findById(userId); } catch (e) {}
    }

    if (!user) return res.status(404).json({ error: 'User not found' });

    const ig = user.socialAccounts?.instagram;
    if (!ig?.igAccountId) {
      return res.status(400).json({ error: 'No Instagram account connected', code: 'NOT_CONNECTED' });
    }

    const token = ig.pageAccessToken || ig.accessToken;
    if (!token) return res.status(400).json({ error: 'Instagram token missing' });

    const igId = ig.igAccountId;

    // 1. Fetch account-level insights (reach, impressions, profile_views, follower_count)
    let accountInsights = {};
    try {
      const acctRes = await axios.get(
        `https://graph.facebook.com/v18.0/${igId}/insights`,
        {
          params: {
            metric: 'reach,impressions,profile_views,follower_count',
            period: 'day',
            since: Math.floor(Date.now() / 1000) - 28 * 86400,
            until: Math.floor(Date.now() / 1000),
            access_token: token
          }
        }
      );
      const insightData = acctRes.data?.data || [];
      for (const metric of insightData) {
        const total = (metric.values || []).reduce((s, v) => s + (v.value || 0), 0);
        accountInsights[metric.name] = total;
        // Build time series for charts
        accountInsights[`${metric.name}_series`] = (metric.values || []).slice(-14).map(v => ({
          date: new Date(v.end_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: v.value || 0
        }));
      }
    } catch (acctErr) {
      console.warn('[IG INSIGHTS] Account-level insights failed:', acctErr.response?.data?.error?.message || acctErr.message);
    }

    // 2. Fetch recent media posts
    let mediaPosts = [];
    try {
      const mediaRes = await axios.get(
        `https://graph.facebook.com/v18.0/${igId}/media`,
        {
          params: {
            fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count',
            limit: 12,
            access_token: token
          }
        }
      );
      const rawMedia = mediaRes.data?.data || [];

      // 3. Fetch per-post insights (likes, comments, video_views, saved, reach, impressions)
      mediaPosts = await Promise.all(rawMedia.map(async (post) => {
        let insights = {};
        try {
          // Metrics vary by media type
          const isVideo = post.media_type === 'VIDEO' || post.media_type === 'REELS';
          const metricList = isVideo
            ? 'likes,comments,video_views,saved,reach,impressions,plays'
            : 'likes,comments,saved,reach,impressions';

          const insRes = await axios.get(
            `https://graph.facebook.com/v18.0/${post.id}/insights`,
            { params: { metric: metricList, access_token: token } }
          );

          for (const m of insRes.data?.data || []) {
            insights[m.name] = m.values?.[0]?.value ?? m.value ?? 0;
          }
        } catch (insErr) {
          // Fallback to like_count/comments_count from media object
          insights = {
            likes: post.like_count || 0,
            comments: post.comments_count || 0
          };
        }

        return {
          id: post.id,
          caption: post.caption ? post.caption.slice(0, 100) + (post.caption.length > 100 ? '…' : '') : '',
          mediaType: post.media_type,
          mediaUrl: post.media_url || post.thumbnail_url || null,
          permalink: post.permalink,
          timestamp: post.timestamp,
          likes: insights.likes ?? post.like_count ?? 0,
          comments: insights.comments ?? post.comments_count ?? 0,
          videoViews: insights.video_views ?? insights.plays ?? 0,
          saved: insights.saved ?? 0,
          reach: insights.reach ?? 0,
          impressions: insights.impressions ?? 0,
          engagement: (insights.likes ?? 0) + (insights.comments ?? 0) + (insights.saved ?? 0)
        };
      }));
    } catch (mediaErr) {
      console.warn('[IG INSIGHTS] Media fetch failed:', mediaErr.response?.data?.error?.message || mediaErr.message);
    }

    // 4. Aggregate totals from media posts
    const totals = mediaPosts.reduce((acc, p) => {
      acc.totalLikes += p.likes;
      acc.totalComments += p.comments;
      acc.totalVideoViews += p.videoViews;
      acc.totalSaved += p.saved;
      acc.totalReach += p.reach;
      acc.totalImpressions += p.impressions;
      return acc;
    }, { totalLikes: 0, totalComments: 0, totalVideoViews: 0, totalSaved: 0, totalReach: 0, totalImpressions: 0 });

    // 5. Engagement rate
    const followers = ig.followersCount || accountInsights.follower_count || 0;
    const avgEngagement = mediaPosts.length > 0
      ? mediaPosts.reduce((s, p) => s + p.engagement, 0) / mediaPosts.length
      : 0;
    const engagementRate = followers > 0 ? ((avgEngagement / followers) * 100).toFixed(2) : '0.00';

    res.json({
      success: true,
      account: {
        username: ig.username,
        name: ig.name,
        profilePictureUrl: ig.profilePictureUrl,
        biography: ig.biography,
        followersCount: ig.followersCount || 0,
        followsCount: ig.followsCount || 0,
        mediaCount: ig.mediaCount || 0,
      },
      accountInsights,
      totals,
      engagementRate,
      posts: mediaPosts
    });

  } catch (err) {
    console.error('❌ [IG INSIGHTS] Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch Instagram insights', details: err.response?.data?.error?.message || err.message });
  }
};

exports.generateCaption = async (req, res) => {
  try {
    const { imageBase64, mimeType, isImage, fileName, fileType } = req.body;
    console.log(`[CAPTION] Received request. isImage: ${isImage}, base64 length: ${imageBase64 ? imageBase64.length : 0}`);

    const grokKey = process.env.GROK_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    let generatedText = '';

    if (grokKey && grokKey !== 'YOUR_GROK_API_KEY_HERE') {
      const isGroq = grokKey.startsWith('gsk_');

      if (isGroq) {
        console.log("[CAPTION] Generating caption using Groq (llama-3.3-70b-versatile)...");
        const fileLabel = fileName
          ? `a file named "${fileName}"`
          : `a ${fileType || 'media'} file`;

        const messages = [
          {
            role: 'user',
            content: `Generate engaging social media content for ${fileLabel}.

Use the filename as context to infer the topic and create relevant, specific content. Do not use generic marketing language — be specific to the likely subject matter.

Provide:
1. A captivating caption (2-3 sentences) with emojis, relevant to the topic
2. 5-7 relevant hashtags based on the likely content

Respond with ONLY valid JSON, no markdown:
{
  "caption": "your context-aware caption with emojis",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
}`
          }
        ];

        const groqResponse = await axios.post(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            model: 'llama-3.3-70b-versatile',
            messages,
            temperature: 0.85,
            max_tokens: 512
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${grokKey}`
            }
          }
        );

        generatedText = groqResponse.data.choices?.[0]?.message?.content || '';

      } else {
        console.log("[CAPTION] Generating caption using Grok (xAI API)...");
        const resolvedMime = (mimeType === 'image/heic' || mimeType === 'image/heif')
          ? 'image/jpeg'
          : (mimeType || 'image/jpeg');

        let messages = [];
        let model = 'grok-2-1212';

        if (isImage && imageBase64) {
          model = 'grok-2-vision-1212';
          messages = [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this image carefully and generate engaging social media content that is specifically relevant to what you see in the image.

Provide:
1. A captivating caption (2-3 sentences) tailored to the actual image content, with appropriate emojis
2. 5-7 relevant hashtags based on what is shown in the image

Respond with ONLY valid JSON, no markdown:
{
  "caption": "your image-specific caption with emojis",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
}`
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${resolvedMime};base64,${imageBase64}`
                  }
                }
              ]
            }
          ];
        } else {
          const fileLabel = fileName
            ? `a video named "${fileName}"`
            : `a ${fileType || 'video'} file`;

          messages = [
            {
              role: 'user',
              content: `Generate engaging social media content for ${fileLabel}.

Use the filename as context to infer the topic and create relevant, specific content. Do not use generic marketing language — be specific to the likely subject matter.

Provide:
1. A captivating caption (2-3 sentences) with emojis, relevant to the video topic
2. 5-7 relevant hashtags based on the likely content

Respond with ONLY valid JSON, no markdown:
{
  "caption": "your context-aware caption with emojis",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
}`
            }
          ];
        }

        const grokResponse = await axios.post(
          'https://api.x.ai/v1/chat/completions',
          {
            model,
            messages,
            temperature: 0.85,
            max_tokens: 512
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${grokKey}`
            }
          }
        );

        generatedText = grokResponse.data.choices?.[0]?.message?.content || '';
      }

    } else if (geminiKey && geminiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      console.log("[CAPTION] Generating caption using Gemini...");
      const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;

      let requestBody;

      if (isImage && imageBase64) {
        const resolvedMime = (mimeType === 'image/heic' || mimeType === 'image/heif')
          ? 'image/jpeg'
          : (mimeType || 'image/jpeg');

        requestBody = {
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: resolvedMime,
                  data: imageBase64
                }
              },
              {
                text: `Analyze this image carefully and generate engaging social media content that is specifically relevant to what you see in the image.

Provide:
1. A captivating caption (2-3 sentences) tailored to the actual image content, with appropriate emojis
2. 5-7 relevant hashtags based on what is shown in the image

Respond with ONLY valid JSON, no markdown:
{
  "caption": "your image-specific caption with emojis",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
}`
              }
            ]
          }],
          generationConfig: {
            temperature: 0.85,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512
          }
        };
      } else {
        const fileLabel = fileName
          ? `a video named "${fileName}"`
          : `a ${fileType || 'video'} file`;

        requestBody = {
          contents: [{
            parts: [{
              text: `Generate engaging social media content for ${fileLabel}.

Use the filename as context to infer the topic and create relevant, specific content. Do not use generic marketing language — be specific to the likely subject matter.

Provide:
1. A captivating caption (2-3 sentences) with emojis, relevant to the video topic
2. 5-7 relevant hashtags based on the likely content

Respond with ONLY valid JSON, no markdown:
{
  "caption": "your context-aware caption with emojis",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3", "#Tag4", "#Tag5"]
}`
            }]
          }],
          generationConfig: {
            temperature: 0.85,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 512
          }
        };
      }

      const geminiResponse = await axios.post(GEMINI_API_URL, requestBody, {
        headers: { 'Content-Type': 'application/json' }
      });

      generatedText = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    } else {
      // No server key is configured
      return res.status(503).json({
        error: 'No AI service key configured on server',
        needsClientKey: true
      });
    }

    if (!generatedText) {
      throw new Error('No content generated from AI service');
    }

    // Parse JSON from response
    let parsedContent;
    try {
      let cleanedText = generatedText.trim();
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON block found');
      }

      if (!parsedContent.caption || !parsedContent.hashtags) {
        throw new Error('Invalid JSON structure');
      }
    } catch {
      // Manual extraction fallback
      const captionMatch = generatedText.match(/"caption"\s*:\s*"([^"]*)"/);
      parsedContent = {
        caption: captionMatch ? captionMatch[1] : generatedText.slice(0, 200),
        hashtags: ['#DigitalMarketing', '#AI', '#ContentCreation', '#SocialMedia', '#Marketing']
      };
    }

    res.json({
      success: true,
      caption: parsedContent.caption,
      hashtags: Array.isArray(parsedContent.hashtags) ? parsedContent.hashtags : []
    });

  } catch (err) {
    console.error('❌ [CAPTION] AI generation error:', err.response?.data || err.message);
    const httpStatus = err.response?.status || 500;
    res.status(httpStatus).json({
      error: err.response?.data?.error?.message || err.message || 'AI Caption generation failed'
    });
  }
};

