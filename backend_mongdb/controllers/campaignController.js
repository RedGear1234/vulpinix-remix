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
      creativeFiles, adImage,
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

    await campaign.save();

    // --- INSTANT PUBLISHING LOGIC (META) ---
    try {
      const platformsLower = platforms ? platforms.map(p => p.toLowerCase()) : [];
      console.log("🔍 [PUBLISH] Platforms received:", platforms, "→ lowercased:", platformsLower);

      const isFacebookSelected = platformsLower.includes('facebook');
      const isInstagramSelected = platformsLower.includes('instagram');

      if (isFacebookSelected || isInstagramSelected) {
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

        // --- STEP 2: Load user & tokens ---
        // Try by email first (most reliable), then by userId
        let user = null;
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
        // --- STEP 2: Resolve Meta access token ---
        // Check both facebook and instagram entries — either can provide the Meta token
        // (user may have disconnected one platform but the other still has valid tokens)
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
                } else {
                  // Text-only post
                  await axios.post(`https://graph.facebook.com/v18.0/${pageId}/feed`, {
                    message: adCaption || adCopyText || campaignName,
                    access_token: pageToken
                  });
                  console.log("✅ [FB] Text feed post success.");
                }
              } catch (fbErr) {
                console.error("❌ [FB] Publish failed:", fbErr.response?.data || fbErr.message);
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
                  console.log("   → Make sure your Instagram account is a Business/Creator account");
                  console.log("   → And it's connected to the Facebook Page in Meta Business Suite.");
                } else if (!publicImageUrl) {
                  console.log("⚠️ [IG] No public image URL available. Instagram requires an image to post.");
                  console.log("   → Either upload an image, or set IMGBB_API_KEY in .env");
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
                    } else {
                      console.log("⚠️ [IG] Container never reached FINISHED state. Post not published.");
                    }
                  }
                }
              } catch (igErr) {
                console.error("❌ [IG] Failed:", JSON.stringify(igErr.response?.data || igErr.message, null, 2));
              }
            } else {
              console.log("🔍 [PUBLISH] Instagram NOT selected. Skipping IG flow.");
            }

            campaign.status = "published";
            await campaign.save();
          }
          } // closes the token-valid block
        }
      }
    } catch (publishErr) {
      console.error("❌ Instant publishing failed:", publishErr.response?.data || publishErr.message);
      // We don't throw here so the frontend still gets a success response for saving the campaign
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
