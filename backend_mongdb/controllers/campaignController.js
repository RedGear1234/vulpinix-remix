const Campaign = require("../models/campaign");
const jwt = require("jsonwebtoken");

// Helper: issue a lightweight user JWT (guest users identified by email)
const issueUserToken = (email, name) => {
  return jwt.sign(
    { id: email, email, name, role: "user" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * POST /api/campaign/create
 * Creates a new campaign. Supports both authenticated users and guest (no token).
 * For guest users, a JWT is issued on the fly from the payment email.
 */
const createCampaign = async (req, res) => {
  try {
    const {
      // User identity
      userId, userName, userEmail, userPhone,
      // Business info
      businessName, businessGoal, businessCategory,
      // Campaign basics
      campaignName, objective, budget, budgetType, currency,
      duration, estimatedReach, startDatePreference,
      // Platform(s)
      platform, platforms,
      // Ad creative
      adContentDescription, adCaption, adCopyText, callToAction,
      creativeFiles, adImage, adVideo,
      // Targeting
      targeting, language,
      // Social handles
      socialHandles,
      // Content / links
      content, links,
      // Payment
      payment, paymentAmount, paymentStatus, paymentId, transactionId, paymentDate,
    } = req.body;

    if (!campaignName || !budget || !platforms || platforms.length === 0) {
      return res.status(400).json({
        success: false,
        message: "campaignName, budget, and at least one platform are required.",
      });
    }

    const effectiveUserId = userId || userEmail || "anonymous";

    const campaign = new Campaign({
      userId:           effectiveUserId,
      userName:         userName         || "",
      userEmail:        userEmail        || "",
      userPhone:        userPhone        || "",
      businessName:     businessName     || userName || "",
      businessGoal:     businessGoal     || "",
      businessCategory: businessCategory || "",
      campaignName,
      objective:        objective        || "brand_awareness",
      budget,
      budgetType:       budgetType       || "Daily",
      currency:         currency         || "INR",
      duration:         duration         || "",
      estimatedReach:   estimatedReach   || "",
      startDatePreference: startDatePreference || "",
      platform:         platform         || (platforms && platforms[0]) || "",
      platforms,
      adContentDescription: adContentDescription || "",
      adCaption:        adCaption        || "",
      adCopyText:       adCopyText       || "",
      callToAction:     callToAction     || "",
      creativeFiles:    creativeFiles    || [],
      adImage:          adImage          || "",
      targeting:        targeting        || {},
      language:         language         || ["English"],
      socialHandles:    socialHandles    || {},
      content:          content          || {},
      links:            links            || {},
      payment:          payment          || {},
      paymentAmount:    paymentAmount    || "",
      paymentStatus:    paymentStatus    || "paid",
      paymentId:        paymentId        || "",
      transactionId:    transactionId    || "",
      paymentDate:      paymentDate      ? new Date(paymentDate) : new Date(),
      status:           "pending",
    });

    let publishResults = {};
    // --- INSTANT PUBLISHING LOGIC (META) ---
    try {
      const platformsLower = platforms ? platforms.map(p => p.toLowerCase()) : [];
      console.log("🔍 [PUBLISH] Platforms received:", platforms, "→ lowercased:", platformsLower);

      const isFacebookSelected = platformsLower.includes('facebook');
      const isInstagramSelected = platformsLower.includes('instagram');
      const isTwitterSelected = platformsLower.includes('twitter') || platformsLower.includes('x');
      const isYoutubeSelected = platformsLower.includes('youtube');
      const isLinkedinSelected = platformsLower.includes('linkedin');
      const isPinterestSelected = platformsLower.includes('pinterest');

      if (isFacebookSelected || isInstagramSelected || isTwitterSelected || isYoutubeSelected || isLinkedinSelected || isPinterestSelected) {
        const User = require("../models/user");
        const axios = require("axios");

        // --- STEP 1: Upload image to ImgBB to get a real public URL ---
        // Instagram's API REQUIRES a publicly accessible URL — base64 & FB CDN won't work.
        let publicImageUrl = null;
        if (adImage && adImage.startsWith('data:image')) {
          console.log("🔍 [IMGBB] Uploading image to get public URL for Instagram...");
          try {
            const FormData = require('form-data');
            const imgbbForm = new FormData();
            const base64Data = adImage.split(';base64,').pop();
            imgbbForm.append('image', base64Data);
            const imgbbKey = process.env.IMGBB_API_KEY;
            if (!imgbbKey) throw new Error('IMGBB_API_KEY not set in .env');
            const imgbbRes = await axios.post(
              `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
              imgbbForm,
              { headers: imgbbForm.getHeaders() }
            );
            publicImageUrl = imgbbRes.data?.data?.url;
            console.log("✅ [IMGBB] Public image URL:", publicImageUrl);
          } catch (imgbbErr) {
            console.error("❌ [IMGBB] Upload failed:", imgbbErr.response?.data || imgbbErr.message);
          }
        } else if (adImage && adImage.startsWith('http')) {
          // Already a public URL
          publicImageUrl = adImage;
          console.log("🔍 [PUBLISH] Image is already a public URL.");
        }

        // --- STEP 2: Load user ---
        // Try by email first (most reliable), then by userId
        let user = null;
        console.log(`🔍 [PUBLISH] Attempting to load user. userEmail: "${userEmail}", effectiveUserId: "${effectiveUserId}"`);
        if (userEmail) {
          user = await User.findOne({ email: userEmail.toLowerCase().trim() });
        }
        if (!user && effectiveUserId && effectiveUserId !== 'anonymous') {
          if (effectiveUserId.includes('@')) {
            user = await User.findOne({ email: effectiveUserId.toLowerCase().trim() });
          } else {
            try { user = await User.findById(effectiveUserId); } catch (e) {}
          }
        }

        if (user) {
          console.log(`✅ [PUBLISH] User loaded: ${user.email} (ID: ${user._id})`);
          console.log(`🔍 [PUBLISH] Available social accounts:`, Object.keys(user.socialAccounts || {}));
        } else {
          console.log(`❌ [PUBLISH] No user found matching criteria.`);
        }

        let isPublishedAny = false;

        // --- META PUBLISHING BLOCK (FB & IG) ---
        if (isFacebookSelected || isInstagramSelected) {
          // Check both facebook and instagram entries — either can provide the Meta token
          const fbToken = user?.socialAccounts?.facebook?.accessToken;
          const igToken = user?.socialAccounts?.instagram?.accessToken;
          const metaToken = fbToken || igToken;

          const savedFbPageId = user?.socialAccounts?.facebook?.pageId;
          const savedFbPageToken = user?.socialAccounts?.facebook?.pageAccessToken;
          const savedIgPageId = user?.socialAccounts?.instagram?.pageId;
          const savedIgPageToken = user?.socialAccounts?.instagram?.pageAccessToken;
          const savedIgAccountId = user?.socialAccounts?.instagram?.igAccountId;

          // Use whichever page info is available (FB entry first, then IG entry)
          const savedPageId = savedFbPageId || savedIgPageId;
          const savedPageToken = savedFbPageToken || savedIgPageToken;

          console.log("🔍 [PUBLISH] FB Token:", !!fbToken, "| IG Token:", !!igToken, "| Meta Token:", !!metaToken);
          console.log("🔍 [PUBLISH] Saved Page:", savedPageId, "| Saved IG Account:", savedIgAccountId);

          if (!metaToken) {
            console.log("⚠️ [PUBLISH] No Meta access token found. User must connect Facebook/Instagram first.");
            console.log(`   → Lookup attempted with email: '${userEmail}', effectiveId: '${effectiveUserId}'`);
            if (isFacebookSelected) publishResults.facebook = { status: "failed", error: "No Meta access token found. Please connect Facebook." };
            if (isInstagramSelected) publishResults.instagram = { status: "failed", error: "No Meta access token found. Please connect Instagram." };
          } else {
            // ✅ Pre-validate that the saved token is still alive before attempting to publish
            let skipPublish = false;
            try {
              await axios.get(`https://graph.facebook.com/v18.0/me?access_token=${metaToken}&fields=id`);
            } catch (tokenCheckErr) {
              const errMsg = tokenCheckErr.response?.data?.error?.message || tokenCheckErr.message;
              console.error("❌ [PUBLISH] Saved Meta token is EXPIRED or INVALID:", errMsg);
              console.log("   → User must reconnect their Facebook/Instagram account from the Social Accounts page.");
              skipPublish = true;
              if (isFacebookSelected) publishResults.facebook = { status: "failed", error: `Saved Meta token is expired/invalid: ${errMsg}` };
              if (isInstagramSelected) publishResults.instagram = { status: "failed", error: `Saved Meta token is expired/invalid: ${errMsg}` };
            }
            if (!skipPublish) {
              console.log("✅ [PUBLISH] Meta token is valid. Proceeding with publish...");
              // --- STEP 3: Get the live Page token (prefer saved, fallback to live fetch) ---
              let pageId = savedPageId;
              let pageToken = savedPageToken;

              if (!pageToken) {
                console.log("🔍 [PUBLISH] No saved page token. Fetching live from Meta...");
                try {
                  const pagesRes = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${metaToken}`);
                  let pages = pagesRes.data.data || [];
                  if (pages.length === 0) {
                    // Fallback: force-fetch the known page
                    try {
                      const forceRes = await axios.get(`https://graph.facebook.com/v18.0/1111932568671242?fields=access_token,name&access_token=${metaToken}`);
                      if (forceRes.data?.access_token) pages = [forceRes.data];
                    } catch (e) { console.log("❌ [PUBLISH] Force-fetch failed:", e.message); }
                  }
                  if (pages.length > 0) {
                    pageId = pages[0].id;
                    pageToken = pages[0].access_token;
                    console.log("✅ [PUBLISH] Live page fetched. ID:", pageId);
                  }
                } catch (pagesErr) {
                  console.error("❌ [PUBLISH] Could not fetch pages:", pagesErr.response?.data || pagesErr.message);
                }
              } else {
                console.log("✅ [PUBLISH] Using saved page token for page:", pageId);
              }

              if (!pageId || !pageToken) {
                console.log("⚠️ [PUBLISH] No Facebook Page found. Cannot publish.");
                if (isFacebookSelected) publishResults.facebook = { status: "failed", error: "No Facebook Page linked to your account." };
                if (isInstagramSelected) publishResults.instagram = { status: "failed", error: "No Facebook Page linked to your account." };
              } else {
                // --- STEP 4: Publish to Facebook ---
                if (isFacebookSelected) {
                  console.log("🔍 [FB] Publishing to Facebook Page feed...");
                  try {
                    if (publicImageUrl) {
                      // Post with image via /photos (published=true)
                      const FormData = require('form-data');
                      const fbForm = new FormData();
                      const base64Data = adImage.split(';base64,').pop();
                      const imageBuffer = Buffer.from(base64Data, 'base64');
                      fbForm.append('source', imageBuffer, { filename: 'post_image.png', contentType: 'image/png' });
                      fbForm.append('message', adCaption || adCopyText || campaignName);
                      fbForm.append('access_token', pageToken);
                      const fbRes = await axios.post(
                        `https://graph.facebook.com/v18.0/${pageId}/photos`,
                        fbForm,
                        { headers: fbForm.getHeaders() }
                      );
                      console.log("✅ [FB] Photo post success. Photo ID:", fbRes.data.id);
                      isPublishedAny = true;
                      publishResults.facebook = { status: "success", id: fbRes.data.id };
                    } else {
                      // Text-only post
                      const fbRes = await axios.post(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
                        message: adCaption || adCopyText || campaignName,
                        access_token: pageToken
                      });
                      console.log("✅ [FB] Text feed post success.");
                      isPublishedAny = true;
                      publishResults.facebook = { status: "success", id: fbRes.data.id || "text_post" };
                    }
                  } catch (fbErr) {
                    const errorMsg = fbErr.response?.data?.error?.message || fbErr.message;
                    console.error("❌ [FB] Publish failed:", errorMsg);
                    publishResults.facebook = { status: "failed", error: errorMsg };
                  }
                }

                // --- STEP 5: Publish to Instagram ---
                if (isInstagramSelected) {
                  console.log("🔍 [IG] Starting Instagram publish flow...");
                  try {
                    // Get IG Business Account ID (prefer saved, fallback to live fetch)
                    let igAccountId = savedIgAccountId;
                    if (!igAccountId) {
                      console.log("🔍 [IG] No saved IG account ID. Fetching from Page...");
                      const igPageRes = await axios.get(
                        `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`
                      );
                      igAccountId = igPageRes.data?.instagram_business_account?.id;
                      console.log("🔍 [IG] Live IG Account ID:", igAccountId);
                    } else {
                      console.log("✅ [IG] Using saved IG Account ID:", igAccountId);
                    }

                    if (!igAccountId) {
                      console.log("⚠️ [IG] No Instagram Business Account linked to this Facebook Page.");
                      publishResults.instagram = { status: "failed", error: "No Instagram Business Account connected to your Facebook page." };
                    } else if (!publicImageUrl) {
                      console.log("⚠️ [IG] No public image URL available. Instagram requires an image to post.");
                      publishResults.instagram = { status: "failed", error: "Instagram posts require an image/creative file." };
                    } else {
                      // Create IG media container
                      console.log("🔍 [IG] Creating media container with URL:", publicImageUrl);
                      const containerRes = await axios.post(
                        `https://graph.facebook.com/v18.0/${igAccountId}/media`,
                        {
                          image_url: publicImageUrl,
                          caption: adCaption || adCopyText || campaignName,
                          access_token: pageToken
                        }
                      );
                      const creationId = containerRes.data?.id;
                      console.log("🔍 [IG] Container ID:", creationId);

                      if (creationId) {
                        // Poll for container readiness (max 5 x 3s = 15s)
                        let isReady = false;
                        for (let i = 0; i < 5; i++) {
                          await new Promise(r => setTimeout(r, 3000));
                          const statusRes = await axios.get(
                            `https://graph.facebook.com/v18.0/${creationId}?fields=status_code&access_token=${pageToken}`
                          );
                          const statusCode = statusRes.data?.status_code;
                          console.log(`🔍 [IG] Poll ${i + 1}/5 — status: ${statusCode}`);
                          if (statusCode === 'FINISHED') { isReady = true; break; }
                          if (statusCode === 'ERROR') {
                            console.error("❌ [IG] Container status ERROR. Aborting.");
                            break;
                          }
                        }

                        if (isReady) {
                          // Publish the container
                          const publishRes = await axios.post(
                            `https://graph.facebook.com/v18.0/${igAccountId}/media_publish`,
                            { creation_id: creationId, access_token: pageToken }
                          );
                          console.log("✅ [IG] Published successfully! Post ID:", publishRes.data?.id);
                          isPublishedAny = true;
                          publishResults.instagram = { status: "success", id: publishRes.data?.id };
                        } else {
                          console.log("⚠️ [IG] Container never reached FINISHED state. Post not published.");
                          publishResults.instagram = { status: "failed", error: "Instagram processing container timed out." };
                        }
                      } else {
                        publishResults.instagram = { status: "failed", error: "Failed to generate Instagram media container." };
                      }
                    }
                  } catch (igErr) {
                    const errorMsg = igErr.response?.data?.error?.message || igErr.message;
                    console.error("❌ [IG] Failed:", errorMsg);
                    publishResults.instagram = { status: "failed", error: errorMsg };
                  }
                }
              }
            }
          }
        }

        // --- STEP 6: Publish to X (Twitter) ---
        if (isTwitterSelected) {
          console.log("🔍 [TWITTER] Starting X (Twitter) publish flow...");
          try {
            const twitterToken = user?.socialAccounts?.twitter?.accessToken;
            if (!twitterToken) {
              console.log("⚠️ [TWITTER] No X (Twitter) access token found. User must connect X first.");
              publishResults.twitter = { status: "failed", error: "X account token not found. Connect X first." };
            } else {
              if (twitterToken.startsWith('mock_')) {
                console.log("✅ [TWITTER] Simulating successful post on connected Mock X Account!");
                isPublishedAny = true;
                publishResults.twitter = { status: "success", id: "mock_tweet_id" };
              } else {
                const { TwitterApi } = require('twitter-api-v2');
                const twitterClient = new TwitterApi(twitterToken);

                let mediaId = null;
                if (adImage) {
                  let mediaBuffer = null;
                  if (adImage.startsWith('data:image')) {
                    const base64Data = adImage.split(';base64,').pop();
                    mediaBuffer = Buffer.from(base64Data, 'base64');
                  } else if (publicImageUrl) {
                    const imageRes = await axios.get(publicImageUrl, { responseType: 'arraybuffer' });
                    mediaBuffer = Buffer.from(imageRes.data, 'binary');
                  }

                  if (mediaBuffer) {
                    console.log("🔍 [TWITTER] Uploading media to X (v1.1 API)...");
                    try {
                      mediaId = await twitterClient.v1.uploadMedia(mediaBuffer, { mimeType: 'image/png' });
                      console.log("✅ [TWITTER] Media uploaded! Media ID:", mediaId);
                    } catch (mediaErr) {
                      console.error("❌ [TWITTER] Media upload failed (403 usually means OAuth 2.0 isn't supported for v1.1 media uploads):", mediaErr.response?.data || mediaErr.message);
                    }
                  }
                }

                const tweetPayload = {
                  text: adCaption || adCopyText || campaignName
                };
                if (mediaId) {
                  tweetPayload.media = { media_ids: [mediaId] };
                }

                try {
                  console.log("🔍 [TWITTER] Creating tweet (v2 API)...");
                  const tweetRes = await twitterClient.v2.tweet(tweetPayload);
                  console.log("✅ [TWITTER] Tweet successfully published! Tweet ID:", tweetRes.data.id);
                  isPublishedAny = true;
                  publishResults.twitter = { status: "success", id: tweetRes.data.id };
                } catch (tweetErr) {
                  const errorMsg = tweetErr.response?.data?.detail || tweetErr.message;
                  console.error("❌ [TWITTER] Tweet creation failed:", errorMsg);
                  publishResults.twitter = { status: "failed", error: errorMsg };
                }
              }
            }
          } catch (twErr) {
            console.error("❌ [TWITTER] General Publish failed:", twErr.response?.data || twErr.message);
            publishResults.twitter = { status: "failed", error: twErr.message };
          }
        }
        // --- STEP 7: Publish to YouTube ---
        if (isYoutubeSelected) {
          console.log("🔍 [YOUTUBE] Starting YouTube publish flow...");
          const youtubeToken = user?.socialAccounts?.youtube?.accessToken;
          if (!youtubeToken) {
            console.log("⚠️ [YOUTUBE] No YouTube access token found. User must connect YouTube first.");
            publishResults.youtube = { status: "failed", error: "YouTube account not connected." };
          } else {
            try {
              let videoBuffer = null;
              let fileSize = 0;
              let mimeType = "video/mp4";

              const sourceVideo = adVideo || (adImage && adImage.startsWith('data:video') ? adImage : null);

              if (!sourceVideo) {
                console.log("⚠️ [YOUTUBE] No video file uploaded for YouTube! Skipping YouTube publish block since YouTube requires a video format.");
                publishResults.youtube = { status: "failed", error: "YouTube uploads require a video format file." };
              } else {
                console.log("🔍 [YOUTUBE] Detected user-uploaded video. Decoding video buffer...");
                const parts = sourceVideo.split(';base64,');
                const base64Data = parts.pop();
                const header = parts[0];
                mimeType = header.split('data:').pop().split(';')[0] || "video/mp4";
                videoBuffer = Buffer.from(base64Data, 'base64');
                fileSize = videoBuffer.length;
                console.log(`✅ [YOUTUBE] User video decoded successfully. Size: ${(fileSize / 1024).toFixed(2)} KB | Type: ${mimeType}`);

                console.log("🔍 [YOUTUBE] Initializing resumable upload session on YouTube...");
                const metadata = {
                  snippet: {
                    title: `${campaignName || "Vulpinix Campaign"} - Live Video Ad`,
                    description: `${adCaption || adCopyText || "Created automatically using Vulpinix."}\n\nPublished via Vulpinix Ad Platform.`,
                    categoryId: "22" // People & Blogs
                  },
                  status: {
                    privacyStatus: "public" // Makes it live directly on their YouTube Channel
                  }
                };

                const initRes = await axios.post(
                  'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
                  metadata,
                  {
                    headers: {
                      'Authorization': `Bearer ${youtubeToken}`,
                      'Content-Type': 'application/json; charset=UTF-8',
                      'X-Upload-Content-Length': fileSize,
                      'X-Upload-Content-Type': mimeType
                    }
                  }
                );

                const uploadUrl = initRes.headers.location;
                if (!uploadUrl) throw new Error("Could not retrieve upload Location header from YouTube.");

                console.log("🔍 [YOUTUBE] Uploading video binary data to YouTube...");
                const uploadRes = await axios.put(uploadUrl, videoBuffer, {
                  headers: {
                    'Content-Length': fileSize,
                    'Content-Type': mimeType
                  }
                });

                const uploadedVideoId = uploadRes.data?.id;
                console.log(`✅ [YOUTUBE] Video uploaded successfully to YouTube! Video ID: ${uploadedVideoId}`);
                isPublishedAny = true;
                publishResults.youtube = { status: "success", id: uploadedVideoId };
              }
            } catch (ytErr) {
              let errorMsg = ytErr.message;
              if (ytErr.response?.data) {
                errorMsg = Buffer.isBuffer(ytErr.response.data) 
                  ? ytErr.response.data.toString() 
                  : JSON.stringify(ytErr.response.data);
              }
              console.error("❌ [YOUTUBE] Real YouTube upload failed:", errorMsg);
              publishResults.youtube = { status: "failed", error: errorMsg };
            }
          }
        }

        // --- STEP 8: Publish to LinkedIn ---
        if (isLinkedinSelected) {
          console.log("🔍 [LINKEDIN] Starting LinkedIn publish flow...");
          console.log("🔍 [LINKEDIN] user.socialAccounts.linkedin values:", user?.socialAccounts?.linkedin);
          const linkedinToken = user?.socialAccounts?.linkedin?.accessToken;
          const linkedinId = user?.socialAccounts?.linkedin?.linkedinId;

          if (!linkedinToken || !linkedinId) {
            console.log("⚠️ [LINKEDIN] No LinkedIn access token or Person ID found. User must connect LinkedIn first. Token:", !!linkedinToken, "Id:", !!linkedinId);
            publishResults.linkedin = { status: "failed", error: "LinkedIn account not connected or configured." };
          } else {
            try {
              let mediaAssetUrn = null;

              // Step A: Register & Upload Image to LinkedIn if exists
              if (adImage && adImage.startsWith('data:image')) {
                console.log("🔍 [LINKEDIN] Detected image upload. Registering media on LinkedIn...");
                
                // 1. Register Upload
                const registerRes = await axios.post(
                  'https://api.linkedin.com/v2/assets?action=registerUpload',
                  {
                    registerUploadRequest: {
                      recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                      owner: `urn:li:person:${linkedinId}`,
                      supportedUploadMechanism: ['SYNCHRONOUS_UPLOAD']
                    }
                  },
                  {
                    headers: {
                      'Authorization': `Bearer ${linkedinToken}`,
                      'Content-Type': 'application/json',
                      'X-Restli-Protocol-Version': '2.0.0'
                    }
                  }
                );

                const uploadUrl = registerRes.data?.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']?.uploadUrl || 
                                  registerRes.data?.value?.uploadMechanism?.['com.linkedin.digitalmedia.uploading.MediaUploadMechanism']?.uploadUrl;
                mediaAssetUrn = registerRes.data?.value?.asset;

                console.log("🔍 [LINKEDIN] registerUpload raw response data:", JSON.stringify(registerRes.data));
                console.log("🔍 [LINKEDIN] parsed uploadUrl:", !!uploadUrl, "mediaAssetUrn:", mediaAssetUrn);

                if (uploadUrl && mediaAssetUrn) {
                  console.log("🔍 [LINKEDIN] Uploading image binary to LinkedIn URL:", uploadUrl);
                  
                  const base64Data = adImage.split(';base64,').pop();
                  const imageBuffer = Buffer.from(base64Data, 'base64');
                  
                  // PUT the binary buffer (Do NOT send the Authorization header to pre-signed S3 URL)
                  await axios.put(uploadUrl, imageBuffer, {
                    headers: {
                      'Content-Type': 'image/png'
                    }
                  });
                  console.log("✅ [LINKEDIN] Image binary uploaded successfully! Asset URN:", mediaAssetUrn);

                  // 2. Poll asset status until it is AVAILABLE
                  console.log("🔍 [LINKEDIN] Polling asset status to ensure it is AVAILABLE...");
                  let isAvailable = false;
                  for (let i = 0; i < 8; i++) {
                    try {
                      const assetRes = await axios.get(`https://api.linkedin.com/v2/assets/${mediaAssetUrn}`, {
                        headers: {
                          'Authorization': `Bearer ${linkedinToken}`,
                          'X-Restli-Protocol-Version': '2.0.0'
                        }
                      });
                      const status = assetRes.data?.status;
                      console.log(`🔍 [LINKEDIN] Asset status (attempt ${i + 1}):`, status);
                      if (status === 'AVAILABLE' || status === 'ALLOWED') {
                        isAvailable = true;
                        break;
                      }
                    } catch (err) {
                      console.log(`⚠️ [LINKEDIN] Error checking asset status:`, err.response?.data || err.message);
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                  }
                  if (!isAvailable) {
                    console.log("⚠️ [LINKEDIN] Asset is not yet AVAILABLE, but proceeding with publish anyway.");
                  }
                }
              }

              // Step B: Create UGC Post on LinkedIn
              const commentary = adCaption || adCopyText || campaignName || "New Campaign from Vulpinix";
              
              const postPayload = {
                author: `urn:li:person:${linkedinId}`,
                lifecycleState: 'PUBLISHED',
                specificContent: {
                  'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                      text: commentary
                    },
                    shareMediaCategory: mediaAssetUrn ? 'IMAGE' : 'NONE'
                  }
                },
                visibility: {
                  'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                }
              };

              if (mediaAssetUrn) {
                postPayload.specificContent['com.linkedin.ugc.ShareContent'].media = [
                  {
                    status: 'READY',
                    description: {
                      text: commentary
                    },
                    media: mediaAssetUrn,
                    title: {
                      text: campaignName || 'Vulpinix Post'
                    }
                  }
                ];
              }

              console.log("🔍 [LINKEDIN] Creating UGC Post on LinkedIn...");
              const postRes = await axios.post(
                'https://api.linkedin.com/v2/ugcPosts',
                postPayload,
                {
                  headers: {
                    'Authorization': `Bearer ${linkedinToken}`,
                    'Content-Type': 'application/json',
                    'X-Restli-Protocol-Version': '2.0.0'
                  }
                }
              );

              console.log("✅ [LINKEDIN] UGC Post successfully published! ID:", postRes.data?.id);
              isPublishedAny = true;
              publishResults.linkedin = { status: "success", id: postRes.data?.id };
            } catch (liErr) {
              let errorMsg = liErr.message;
              if (liErr.response?.data) {
                errorMsg = JSON.stringify(liErr.response.data);
              }
              console.error("❌ [LINKEDIN] UGC Post creation failed:", errorMsg);
              publishResults.linkedin = { status: "failed", error: errorMsg };
            }
          }
        }

        // --- STEP 9: Publish to Pinterest ---
        if (isPinterestSelected) {
          console.log("🔍 [PINTEREST] Starting Pinterest publish flow...");
          try {
            const pinterestToken = user?.socialAccounts?.pinterest?.accessToken || process.env.PINTEREST_PERSONAL_ACCESS_TOKEN;
            if (!pinterestToken) {
              console.log("⚠️ [PINTEREST] No Pinterest access token found. User must connect Pinterest first or provide PINTEREST_PERSONAL_ACCESS_TOKEN in .env.");
              publishResults.pinterest = { status: "failed", error: "No Pinterest access token found. Please connect Pinterest." };
            } else {
              // A. Fetch User's boards
              console.log("🔍 [PINTEREST] Fetching boards...");
              let boardId = null;
              try {
                const boardsRes = await axios.get('https://api.pinterest.com/v5/boards', {
                  headers: { 'Authorization': `Bearer ${pinterestToken}` }
                });
                if (boardsRes.data?.items && boardsRes.data.items.length > 0) {
                  boardId = boardsRes.data.items[0].id;
                  console.log(`✅ [PINTEREST] Found existing board: ${boardsRes.data.items[0].name} (ID: ${boardId})`);
                }
              } catch (boardErr) {
                console.log("⚠️ [PINTEREST] Failed to fetch boards:", boardErr.response?.data || boardErr.message);
              }

              // B. If no board found, create a default board
              if (!boardId) {
                console.log("🔍 [PINTEREST] No board found. Creating a default 'Vulpinix Ads' board...");
                try {
                  const createBoardRes = await axios.post('https://api.pinterest.com/v5/boards', {
                    name: "Vulpinix Ads",
                    description: "Created via Vulpinix Ad Manager",
                    privacy: "PUBLIC"
                  }, {
                    headers: { 
                      'Authorization': `Bearer ${pinterestToken}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  boardId = createBoardRes.data?.id;
                  console.log(`✅ [PINTEREST] Default board created! ID: ${boardId}`);
                } catch (createBoardErr) {
                  console.error("❌ [PINTEREST] Failed to create default board:", createBoardErr.response?.data || createBoardErr.message);
                }
              }

              // C. Create Pin
              if (boardId) {
                const imageUrl = publicImageUrl || "https://i.ibb.co/1GVKVn5Q/e9998ace3c65.jpg"; // Default image fallback
                console.log(`🔍 [PINTEREST] Creating Pin on board ${boardId} with image: ${imageUrl}`);
                
                const pinPayload = {
                  title: campaignName?.substring(0, 100) || "Vulpinix Pin",
                  description: (adCaption || adCopyText || "Published via Vulpinix").substring(0, 800),
                  board_id: boardId,
                  media_source: {
                    source_type: "image_url",
                    url: imageUrl
                  }
                };

                const pinRes = await axios.post('https://api.pinterest.com/v5/pins', pinPayload, {
                  headers: {
                    'Authorization': `Bearer ${pinterestToken}`,
                    'Content-Type': 'application/json'
                  }
                });

                console.log("✅ [PINTEREST] Pin successfully published! ID:", pinRes.data?.id);
                isPublishedAny = true;
                publishResults.pinterest = { status: "success", id: pinRes.data?.id };
              } else {
                console.error("❌ [PINTEREST] Could not find or create a Pinterest board. Pin creation aborted.");
                publishResults.pinterest = { status: "failed", error: "Could not find or create a Pinterest board." };
              }
            }
          } catch (pinErr) {
            let errorMsg = pinErr.message;
            if (pinErr.response?.data) {
              errorMsg = pinErr.response.data.message || JSON.stringify(pinErr.response.data);
            }
            console.error("❌ [PINTEREST] Pin creation failed:", errorMsg);
            publishResults.pinterest = { status: "failed", error: errorMsg };
          }
        }

        if (isPublishedAny) {
          campaign.status = "published";
          await campaign.save();
        }
      }
    } catch (publishErr) {
      console.error("❌ Instant publishing failed:", publishErr.response?.data || publishErr.message);
    }
    // --- END INSTANT PUBLISHING LOGIC ---

    // Issue a user token so the dashboard can fetch campaigns via API
    const token = issueUserToken(userEmail || effectiveUserId, userName || "User");

    const isInstant = campaign.status === "published";

    return res.status(201).json({
      success: true,
      message: isInstant 
        ? "Campaign published successfully!" 
        : "Campaign submitted successfully. Awaiting approval.",
      campaign: {
        id: campaign._id.toString(),
        campaignName: campaign.campaignName,
        status: campaign.status,
        createdAt: campaign.createdAt,
      },
      token, // client stores this in localStorage
      publishResults
    });
  } catch (err) {
    console.error("createCampaign error:", err);
    return res.status(500).json({ success: false, message: "Server error creating campaign." });
  }
};


/**
 * GET /api/campaign/my-campaigns
 * Returns all campaigns for the authenticated user (identified by email in JWT).
 */
const getUserCampaigns = async (req, res) => {
  try {
    const userId = req.user?.email || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const campaigns = await Campaign.find({ 
      userId: { $regex: new RegExp(`^${userId}$`, "i") } 
    }, { adImage: 0 }).sort({ createdAt: -1 }).allowDiskUse(true).lean();

    // Normalize fields for frontend compatibility
    const normalized = campaigns.map((c) => ({
      id: c._id.toString(),
      businessName: c.businessName || c.userName || "My Business",
      userName: c.userName,
      userEmail: c.userEmail,
      name: c.campaignName,
      platforms: c.platforms,
      budget: c.budget,
      budgetType: c.budgetType,
      duration: c.duration,
      estimatedReach: c.estimatedReach,
      dateSubmitted: c.createdAt,
      status: c.status,
      rejectionReason: c.rejectionReason || "",
      analytics: c.analytics,
      adImage: c.adImage,
    }));

    return res.json({ success: true, campaigns: normalized });
  } catch (err) {
    console.error("getUserCampaigns error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching campaigns." });
  }
};

/**
 * GET /api/campaign/:id
 * Returns a single campaign by ID.
 */
const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.email || req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized." });
    }

    const campaign = await Campaign.findOne({ 
      _id: id, 
      userId: { $regex: new RegExp(`^${userId}$`, "i") } 
    }).lean();

    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found." });
    }

    const normalized = {
      id: campaign._id.toString(),
      businessName: campaign.businessName || campaign.userName || "My Business",
      userName: campaign.userName,
      userEmail: campaign.userEmail,
      name: campaign.campaignName,
      platforms: campaign.platforms,
      budget: campaign.budget,
      budgetType: campaign.budgetType,
      duration: campaign.duration,
      estimatedReach: campaign.estimatedReach,
      dateSubmitted: campaign.createdAt,
      status: campaign.status,
      rejectionReason: campaign.rejectionReason || "",
      analytics: campaign.analytics,
      adImage: campaign.adImage,
    };

    return res.json({ success: true, campaign: normalized });
  } catch (err) {
    console.error("getCampaignById error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching campaign details." });
  }
};

module.exports = { createCampaign, getUserCampaigns, getCampaignById };
