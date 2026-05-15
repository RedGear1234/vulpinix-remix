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

      if (platformsLower.includes('facebook') || platformsLower.includes('instagram')) {
        const User = require("../models/user");
        const axios = require("axios");
        
        // Grab the token from the user who submitted the campaign
        const user = await User.findOne({ email: userEmail || effectiveUserId });
        console.log(`🔍 [PUBLISH] User found for ${userEmail || effectiveUserId}:`, !!user);
        
        const fbToken = user?.socialAccounts?.facebook?.accessToken;
        console.log("🔍 [PUBLISH] Token found:", !!fbToken);
        
        if (fbToken) {
          console.log("✅ Found Meta access token! Attempting to publish...");
          
          // 1. Get the list of Facebook Pages this user manages
          const pagesRes = await axios.get(`https://graph.facebook.com/v18.0/me/accounts?access_token=${fbToken}`);
          let pages = pagesRes.data.data || [];
          
          // FALLBACK: If Facebook returns 0 pages (common with New Page Experience), 
          // but our debug token showed we have access to ID 1111932568671242, try to fetch it directly.
          if (pages.length === 0) {
            console.log("🔍 [PUBLISH] Standard list empty. Attempting force-fetch for Page ID 1111932568671242...");
            try {
              const forceRes = await axios.get(`https://graph.facebook.com/v18.0/1111932568671242?fields=access_token,name&access_token=${fbToken}`);
              if (forceRes.data && forceRes.data.access_token) {
                pages = [forceRes.data];
                console.log("✅ [PUBLISH] Force-fetch successful! Found page:", forceRes.data.name);
              }
            } catch (forceErr) {
              console.log("❌ [PUBLISH] Force-fetch failed:", forceErr.response?.data?.error?.message || forceErr.message);
            }
          }

          if (pages.length > 0) {
            const targetPage = pages[0];
            const pageId = targetPage.id;
            const pageToken = targetPage.access_token;
            console.log("🔍 [PUBLISH] Publishing to Facebook Page:", targetPage.name, "ID:", pageId);
            
            // --- FACEBOOK PUBLISHING ---
            let fbPhotoId = null;
            if (platformsLower.includes('facebook')) {
              try {
                if (adImage && adImage.startsWith('data:image')) {
                  const FormData = require('form-data');
                  const form = new FormData();
                  const base64Data = adImage.split(';base64,').pop();
                  const imageBuffer = Buffer.from(base64Data, 'base64');
                  form.append('source', imageBuffer, { filename: 'post_image.png', contentType: 'image/png' });
                  form.append('message', adCaption || adCopyText || campaignName);
                  form.append('access_token', pageToken);
                  const fbRes = await axios.post(`https://graph.facebook.com/v18.0/${pageId}/photos`, form, { headers: { ...form.getHeaders() } });
                  fbPhotoId = fbRes.data.id;
                  console.log(`✅ [FB] Successfully published IMAGE to Facebook Page: ${targetPage.name}`);
                } else {
                  const payload = { message: adCaption || adCopyText || campaignName, access_token: pageToken };
                  if (adImage && adImage.startsWith('http')) payload.url = adImage;
                  await axios.post(`https://graph.facebook.com/v18.0/${pageId}/feed`, payload);
                  console.log(`✅ [FB] Successfully published TEXT/URL to Facebook Page: ${targetPage.name}`);
                }
              } catch (fbErr) {
                console.error("❌ [FB] Publishing failed:", fbErr.response?.data || fbErr.message);
              }
            }

            // --- INSTAGRAM PUBLISHING ---
            if (platformsLower.includes('instagram')) {
              try {
                const igAccountRes = await axios.get(`https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${pageToken}`);
                const igAccountId = igAccountRes.data?.instagram_business_account?.id;
                
                if (igAccountId) {
                  console.log("🔍 [IG] Found linked Instagram Account ID:", igAccountId);
                  
                  let igImageUrl = adImage && adImage.startsWith('http') ? adImage : null;
                  
                  // Bridge: If we have an FB photo ID, get its public source URL for Instagram
                  if (!igImageUrl && fbPhotoId) {
                    const photoDetail = await axios.get(`https://graph.facebook.com/v18.0/${fbPhotoId}?fields=images&access_token=${pageToken}`);
                    igImageUrl = photoDetail.data.images[0]?.source;
                    console.log("🔍 [IG] Bridged image URL from Facebook:", !!igImageUrl);
                  }

                  if (igImageUrl) {
                    console.log("🔍 [IG] Creating media container...");
                    const containerRes = await axios.post(`https://graph.facebook.com/v18.0/${igAccountId}/media`, {
                      image_url: igImageUrl,
                      caption: adCaption || adCopyText || campaignName,
                      access_token: pageToken // IG uses Page Token for linked accounts
                    });
                    
                    const creationId = containerRes.data.id;
                    if (creationId) {
                      console.log("🔍 [IG] Publishing container:", creationId);
                      await axios.post(`https://graph.facebook.com/v18.0/${igAccountId}/media_publish`, {
                        creation_id: creationId,
                        access_token: pageToken
                      });
                      console.log(`✅ [IG] Successfully published to Instagram!`);
                    }
                  } else {
                    console.log("⚠️ [IG] Skipping Instagram: No public image URL available (Instagram requires an image URL).");
                  }
                } else {
                  console.log("⚠️ [IG] No Instagram Business Account linked to this Facebook Page.");
                }
              } catch (igErr) {
                console.error("❌ [IG] Publishing failed:", igErr.response?.data || igErr.message);
              }
            }

            campaign.status = "published";
            await campaign.save();
          } else {
            console.log("⚠️ User has connected Facebook but does not own any Business Pages.");
          }
        } else {
           console.log("⚠️ User has not connected their Facebook account yet.");
        }
      }
    } catch (publishErr) {
      console.error("❌ Instant publishing failed:", publishErr.response?.data || publishErr.message);
      // We don't throw here so the frontend still gets a success response for saving the campaign
    }
    // --- END INSTANT PUBLISHING LOGIC ---

    // Issue a user token so the dashboard can fetch campaigns via API
    const token = issueUserToken(userEmail || effectiveUserId, userName || "User");

    return res.status(201).json({
      success: true,
      message: "Campaign submitted successfully. Awaiting approval.",
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
