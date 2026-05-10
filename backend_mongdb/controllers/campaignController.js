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
    }).sort({ createdAt: -1 }).lean();

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
