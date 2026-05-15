const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    // ── User Identity ─────────────────────────────────────────────────────────
    userId:        { type: String, required: true }, // email or Google ID
    userName:      { type: String, default: "" },
    userEmail:     { type: String, default: "" },
    userPhone:     { type: String, default: "" },

    // ── Business Info ─────────────────────────────────────────────────────────
    businessName:     { type: String, default: "" },
    businessGoal:     { type: String, default: "" },
    businessCategory: { type: String, default: "" },

    // ── Campaign Basics ───────────────────────────────────────────────────────
    campaignName:   { type: String, required: true, trim: true },
    objective:      { type: String, default: "brand_awareness" },
    budget:         { type: String, required: true },
    budgetType:     { type: String, default: "Daily" },
    currency:       { type: String, default: "INR" },
    duration:       { type: String, default: "" },
    estimatedReach: { type: String, default: "" },
    startDatePreference: { type: String, default: "" },

    // ── Ad Creative ───────────────────────────────────────────────────────────
    adContentDescription: { type: String, default: "" },
    adCaption:            { type: String, default: "" },
    adCopyText:           { type: String, default: "" },
    callToAction:         { type: String, default: "" },
    adImage:              { type: String, default: "" }, // base64 or URL
    creativeFiles: [
      {
        url:      { type: String, default: "" },
        type:     { type: String, default: "image" }, // "image" | "video"
        filename: { type: String, default: "" },
      },
    ],

    // ── Targeting ─────────────────────────────────────────────────────────────
    targeting: {
      location:  { type: [String], default: [] },
      audience:  { type: [String], default: [] },
      ageRange:  { type: String, default: "" },
      gender:    { type: String, default: "all" },
      interests: { type: [String], default: [] },
      devices:   { type: [String], default: ["mobile", "desktop"] },
    },

    // ── Language ──────────────────────────────────────────────────────────────
    language: { type: [String], default: ["English"] },

    // ── Platform(s) ───────────────────────────────────────────────────────────
    platforms: { type: [String], required: true },
    platform:  { type: String, default: "" }, // primary selected platform

    // ── Social Handles ────────────────────────────────────────────────────────
    socialHandles: {
      instagram: { type: String, default: "" },
      facebook:  { type: String, default: "" },
      twitter:   { type: String, default: "" },
      linkedin:  { type: String, default: "" },
    },

    // ── Content ───────────────────────────────────────────────────────────────
    content: {
      mediaUrl:  { type: String, default: "" },
      caption:   { type: String, default: "" },
      hashtags:  { type: [String], default: [] },
    },

    // ── Links ─────────────────────────────────────────────────────────────────
    links: {
      website:    { type: String, default: "" },
      social:     { type: String, default: "" },
      additional: { type: String, default: "" },
    },

    // ── Payment ───────────────────────────────────────────────────────────────
    payment: {
      paymentId:     { type: String, default: "" },
      transactionId: { type: String, default: "" },
      amount:        { type: String, default: "" },
      method:        { type: String, default: "" },
      timestamp:     { type: Date, default: Date.now },
    },
    paymentAmount:  { type: String, default: "" },
    paymentStatus:  { type: String, default: "paid" },
    paymentId:      { type: String, default: "" },
    transactionId:  { type: String, default: "" },
    paymentDate:    { type: Date, default: Date.now },

    // ── Status Lifecycle ──────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "in_review", "approved", "running", "completed", "rejected", "published"],
      default: "pending",
    },

    rejectionReason: { type: String, default: "" },
    adminMessage:    { type: String, default: "" },

    // ── Analytics (seeded on approval) ───────────────────────────────────────
    analytics: {
      impressions: { type: Number, default: 0 },
      reach:       { type: Number, default: 0 },
      clicks:      { type: Number, default: 0 },
      ctr:         { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      adSpend:     { type: Number, default: 0 },
      roas:        { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

campaignSchema.index({ userId: 1 });
campaignSchema.index({ status: 1 });

module.exports = mongoose.model("Campaign", campaignSchema);
