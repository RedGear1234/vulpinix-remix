const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    // Identity
    userId: { type: String, required: true }, // email or Google ID
    userName: { type: String, default: "" },
    userEmail: { type: String, default: "" },
    businessName: { type: String, default: "" },

    // Campaign basics
    campaignName: { type: String, required: true, trim: true },
    objective: { type: String, default: "brand_awareness" },
    budget: { type: String, required: true },
    budgetType: { type: String, default: "Daily" },
    duration: { type: String, default: "" },
    estimatedReach: { type: String, default: "" },

    // Targeting
    targeting: {
      location: { type: [String], default: [] },
      audience: { type: [String], default: [] },
      ageRange: { type: String, default: "" },
      gender: { type: String, default: "all" },
      interests: { type: [String], default: [] },
      devices: { type: [String], default: ["mobile", "desktop"] },
    },

    // Language
    language: { type: [String], default: ["English"] },

    // Platforms
    platforms: { type: [String], required: true },

    // Content
    content: {
      mediaUrl: { type: String, default: "" },
      caption: { type: String, default: "" },
      hashtags: { type: [String], default: [] },
    },

    // Links
    links: {
      website: { type: String, default: "" },
      social: { type: String, default: "" },
      additional: { type: String, default: "" },
    },

    // Payment
    payment: {
      paymentId: { type: String, default: "" },
      amount: { type: String, default: "" },
      method: { type: String, default: "" },
      timestamp: { type: Date, default: Date.now },
    },

    // Status lifecycle: pending → approved → running → completed (or rejected)
    status: {
      type: String,
      enum: ["pending", "in_review", "approved", "running", "completed", "rejected"],
      default: "pending",
    },

    rejectionReason: { type: String, default: "" },

    // Analytics (seeded on approval)
    analytics: {
      impressions: { type: Number, default: 0 },
      reach: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      ctr: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      adSpend: { type: Number, default: 0 },
      roas: { type: Number, default: 0 },
    },

    // Ad preview image (base64 or URL)
    adImage: { type: String, default: "" },
  },
  { timestamps: true }
);

// Useful indexes
campaignSchema.index({ userId: 1 });
campaignSchema.index({ status: 1 });

module.exports = mongoose.model("Campaign", campaignSchema);
