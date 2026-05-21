const Campaign = require("../models/campaign");
const Admin = require("../models/admin");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

/**
 * POST /api/admin/login
 * Validates adminId + password against the seeded Admin document in MongoDB.
 * Returns a signed JWT with role "admin".
 */
const adminLogin = async (req, res) => {
  const { adminId, password } = req.body;

  if (!adminId || !password) {
    return res.status(400).json({ success: false, message: "Admin ID and password are required." });
  }

  // ── Try MongoDB first ─────────────────────────────────────────────────────
  try {
    const admin = await Admin.findOne({ adminId: adminId.trim() });
    if (admin) {
      const isValid = await admin.comparePassword(password);
      if (!isValid) {
        return res.status(401).json({ success: false, message: "Invalid credentials." });
      }
      const token = jwt.sign(
        { id: admin._id.toString(), adminId: admin.adminId, name: admin.name, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );
      return res.json({
        success: true,
        token,
        admin: { adminId: admin.adminId, name: admin.name },
      });
    }
    // Admin not found in DB — fall through to hardcoded fallback below
  } catch (err) {
    // MongoDB not connected — fall through to hardcoded fallback
    console.warn("MongoDB unavailable, trying fallback credentials:", err.message);
  }

  // ── Hardcoded fallback (dev/demo mode when DB is down) ────────────────────
  const FALLBACK_ID  = process.env.ADMIN_ID  || "admin";
  const FALLBACK_PWD = process.env.ADMIN_PWD || "admin";
  if (adminId.trim() === FALLBACK_ID && password === FALLBACK_PWD) {
    const token = jwt.sign(
      { id: "local-admin", adminId: FALLBACK_ID, name: "Administrator", role: "admin" },
      process.env.JWT_SECRET || "vulpinix_fallback_secret",
      { expiresIn: "8h" }
    );
    return res.json({
      success: true,
      token,
      admin: { adminId: FALLBACK_ID, name: "Administrator" },
    });
  }

  return res.status(401).json({ success: false, message: "Invalid credentials." });
};


/**
 * GET /api/admin/campaigns
 * Returns all campaigns. Supports ?status=pending&search=query filters.
 */
const getAllCampaigns = async (req, res) => {
  try {
    const { status, search } = req.query;

    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { campaignName: { $regex: search, $options: "i" } },
        { businessName: { $regex: search, $options: "i" } },
        { userEmail: { $regex: search, $options: "i" } },
      ];
    }

    const campaigns = await Campaign.find(query, { adImage: 0 }).sort({ createdAt: -1 }).allowDiskUse(true).lean();

    // Normalize for frontend compatibility (matching existing AdminDashboard Campaign type)
    const normalized = campaigns.map((c) => ({
      id: c._id.toString(),
      // User identity
      businessName: c.businessName || c.userName || "Unknown",
      userName: c.userName || "",
      userEmail: c.userEmail || "",
      userPhone: c.userPhone || "",
      // Business
      businessGoal: c.businessGoal || "",
      businessCategory: c.businessCategory || "",
      // Campaign basics
      adImage: c.adImage || "",
      name: c.campaignName,
      platforms: c.platforms || [],
      platform: c.platform || (c.platforms && c.platforms[0]) || "",
      budget: c.budget,
      budgetType: c.budgetType,
      currency: c.currency || "INR",
      duration: c.duration,
      estimatedReach: c.estimatedReach,
      startDatePreference: c.startDatePreference || "",
      dateSubmitted: c.createdAt,
      // Ad creative
      adContentDescription: c.adContentDescription || "",
      adCaption: c.adCaption || c.content?.caption || "",
      adCopyText: c.adCopyText || "",
      callToAction: c.callToAction || "",
      creativeFiles: c.creativeFiles || [],
      // Targeting
      targeting: c.targeting,
      language: c.language,
      // Social handles
      socialHandles: c.socialHandles || {},
      // Content / links
      content: c.content,
      links: c.links,
      // Payment
      payment: c.payment,
      paymentAmount: c.paymentAmount || c.payment?.amount || "",
      paymentStatus: c.paymentStatus || "paid",
      paymentId: c.paymentId || c.payment?.paymentId || "",
      transactionId: c.transactionId || c.payment?.transactionId || "",
      paymentDate: c.paymentDate || c.payment?.timestamp || c.createdAt,
      // Status
      status: c.status,
      rejectionReason: c.rejectionReason || "",
      adminMessage: c.adminMessage || "",
      analytics: c.analytics,
    }));


    // Stats for the header
    const stats = {
      total: await Campaign.countDocuments(),
      pending: await Campaign.countDocuments({ status: "pending" }),
      in_review: await Campaign.countDocuments({ status: "in_review" }),
      approved: await Campaign.countDocuments({ status: "approved" }),
      running: await Campaign.countDocuments({ status: "running" }),
      published: await Campaign.countDocuments({ status: "published" }),
      completed: await Campaign.countDocuments({ status: "completed" }),
      rejected: await Campaign.countDocuments({ status: "rejected" }),
    };

    return res.json({ success: true, campaigns: normalized, stats });
  } catch (err) {
    console.error("getAllCampaigns error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching campaigns." });
  }
};

/**
 * PATCH /api/admin/campaigns/:id/status
 * Updates campaign status. Optionally seeds analytics on approval.
 * Body: { status, rejectionReason? }
 */
const updateCampaignStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const VALID_STATUSES = ["pending", "in_review", "approved", "running", "completed", "rejected", "published"];
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status: ${status}` });
    }

    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found." });
    }

    campaign.status = status;

    if (status === "rejected") {
      campaign.rejectionReason = rejectionReason || "Did not meet content guidelines.";
    }

    // NOTE: Analytics are NOT seeded here. They are fetched from real
    // platform APIs (Facebook, Instagram, Twitter, LinkedIn, YouTube)
    // via POST /api/campaign/analytics/refresh using stored OAuth tokens.
    // Analytics start at 0 and update only with real platform data.


    await campaign.save();

    return res.json({
      success: true,
      message: `Campaign status updated to "${status}".`,
      campaign: {
        id: campaign._id.toString(),
        status: campaign.status,
        rejectionReason: campaign.rejectionReason,
        analytics: campaign.analytics,
      },
    });
  } catch (err) {
    console.error("updateCampaignStatus error:", err);
    return res.status(500).json({ success: false, message: "Server error updating campaign." });
  }
};

/**
 * GET /api/admin/users
 * Returns all registered users (excluding password hashes).
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();
    const normalized = users.map((u) => ({
      id: u._id.toString(),
      _id: u._id.toString(),
      name: u.name || "—",
      email: u.email || "—",
      phone: u.phone || "",
      company: u.company || "",
      industry: u.industry || "",
      location: u.location || "",
      website: u.website || "",
      businessType: u.businessType || "",
      role: u.role || "user",
      authProvider: u.googleId ? "google" : "email",
      googleId: u.googleId || "",
      picture: u.picture || "",
      onboardingCompleted: u.onboardingCompleted || false,
      joinedAt: u.createdAt,
      createdAt: u.createdAt,
    }));
    return res.json({ success: true, users: normalized, total: normalized.length });
  } catch (err) {
    console.error("getAllUsers error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching users." });
  }
};

/**
 * GET /api/admin/campaigns/:id
 * Returns a single campaign WITH full adImage for the detail modal.
 */
const getCampaignDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id).lean();
    if (!campaign) {
      return res.status(404).json({ success: false, message: "Campaign not found." });
    }

    const normalized = {
      id: campaign._id.toString(),
      businessName: campaign.businessName || campaign.userName || "Unknown",
      userName: campaign.userName || "",
      userEmail: campaign.userEmail || "",
      userPhone: campaign.userPhone || "",
      businessGoal: campaign.businessGoal || "",
      businessCategory: campaign.businessCategory || "",
      adImage: campaign.adImage || "",
      name: campaign.campaignName,
      platforms: campaign.platforms || [],
      platform: campaign.platform || (campaign.platforms && campaign.platforms[0]) || "",
      budget: campaign.budget,
      budgetType: campaign.budgetType,
      currency: campaign.currency || "INR",
      duration: campaign.duration,
      estimatedReach: campaign.estimatedReach,
      startDatePreference: campaign.startDatePreference || "",
      dateSubmitted: campaign.createdAt,
      adContentDescription: campaign.adContentDescription || "",
      adCaption: campaign.adCaption || campaign.content?.caption || "",
      adCopyText: campaign.adCopyText || "",
      callToAction: campaign.callToAction || "",
      creativeFiles: campaign.creativeFiles || [],
      targeting: campaign.targeting,
      language: campaign.language,
      socialHandles: campaign.socialHandles || {},
      content: campaign.content,
      links: campaign.links,
      payment: campaign.payment,
      paymentAmount: campaign.paymentAmount || campaign.payment?.amount || "",
      paymentStatus: campaign.paymentStatus || "paid",
      paymentId: campaign.paymentId || campaign.payment?.paymentId || "",
      transactionId: campaign.transactionId || campaign.payment?.transactionId || "",
      paymentDate: campaign.paymentDate || campaign.payment?.timestamp || campaign.createdAt,
      status: campaign.status,
      rejectionReason: campaign.rejectionReason || "",
      adminMessage: campaign.adminMessage || "",
      analytics: campaign.analytics,
    };

    return res.json({ success: true, campaign: normalized });
  } catch (err) {
    console.error("getCampaignDetail error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching campaign." });
  }
};

module.exports = { adminLogin, getAllCampaigns, getCampaignDetail, updateCampaignStatus, getAllUsers };
