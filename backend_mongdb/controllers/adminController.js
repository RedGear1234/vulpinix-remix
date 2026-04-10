const Campaign = require("../models/campaign");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

/**
 * POST /api/admin/login
 * Validates adminId + password against the seeded Admin document in MongoDB.
 * Returns a signed JWT with role "admin".
 */
const adminLogin = async (req, res) => {
  try {
    const { adminId, password } = req.body;

    if (!adminId || !password) {
      return res.status(400).json({ success: false, message: "Admin ID and password are required." });
    }

    const admin = await Admin.findOne({ adminId: adminId.trim() });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

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
      message: `Welcome, ${admin.name}`,
      token,
      admin: { adminId: admin.adminId, name: admin.name },
    });
  } catch (err) {
    console.error("adminLogin error:", err);
    return res.status(500).json({ success: false, message: "Server error during login." });
  }
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
      businessName: c.businessName || c.userName || "Unknown",
      userName: c.userName || "",
      userEmail: c.userEmail || "",
      adImage: c.adImage || "",
      name: c.campaignName,
      platforms: c.platforms || [],
      budget: c.budget,
      budgetType: c.budgetType,
      duration: c.duration,
      dateSubmitted: c.createdAt,
      status: c.status,
      rejectionReason: c.rejectionReason || "",
      analytics: c.analytics,
      targeting: c.targeting,
      language: c.language,
      content: c.content,
      links: c.links,
      payment: c.payment,
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

module.exports = { adminLogin, getAllCampaigns, updateCampaignStatus };
