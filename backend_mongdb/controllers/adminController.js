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

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 }).lean();

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

    const VALID_STATUSES = ["pending", "in_review", "approved", "running", "completed", "rejected"];
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

    // Seed analytics when approved or set to running
    if ((status === "approved" || status === "running") &&
        campaign.analytics.impressions === 0) {
      const budgetNum = parseInt(campaign.budget.replace(/\D/g, "")) || 5000;
      campaign.analytics = {
        impressions: Math.floor(Math.random() * 50000) + 10000,
        reach: Math.floor(Math.random() * 30000) + 5000,
        clicks: Math.floor(Math.random() * 3000) + 500,
        ctr: parseFloat((Math.random() * 3.3 + 1.2).toFixed(2)),
        conversions: Math.floor(Math.random() * 200) + 20,
        adSpend: Math.floor(budgetNum * (Math.random() * 0.4 + 0.5)),
        roas: parseFloat((Math.random() * 4 + 1.5).toFixed(2)),
      };
    }

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
      name: u.name || "—",
      email: u.email || "—",
      phone: u.phone || "",
      company: u.company || "",
      role: u.role || "user",
      authProvider: u.googleId ? "google" : "email",
      googleId: u.googleId || "",
      joinedAt: u.createdAt,
    }));
    return res.json({ success: true, users: normalized, total: normalized.length });
  } catch (err) {
    console.error("getAllUsers error:", err);
    return res.status(500).json({ success: false, message: "Server error fetching users." });
  }
};

module.exports = { adminLogin, getAllCampaigns, updateCampaignStatus, getAllUsers };
