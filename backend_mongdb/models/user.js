const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    industry: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    businessType: { type: String, default: "" },
    googleId: { type: String, default: "" },
    appleId: { type: String, default: "" },
    picture: { type: String, default: "" },
    onboardingCompleted: { type: Boolean, default: false },
    socialAccounts: {
      facebook: { accessToken: String, pageId: String, pageAccessToken: String },
      instagram: { 
        accessToken: String, 
        igAccountId: String, 
        username: String, 
        pageId: String, 
        pageAccessToken: String,
        name: { type: String, default: "" },
        profilePictureUrl: { type: String, default: "" },
        biography: { type: String, default: "" },
        followersCount: { type: Number, default: 0 },
        followsCount: { type: Number, default: 0 },
        mediaCount: { type: Number, default: 0 }
      },
      twitter: { accessToken: String, refreshToken: String, username: String, tokenSecret: String },
      linkedin: { accessToken: String, linkedinId: String, linkedinName: String },
      youtube: { accessToken: String, refreshToken: String, channelId: String, channelTitle: String },
      pinterest: { accessToken: String, refreshToken: String, username: String }
    },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true, minimize: false }
);

// Compare password helper
userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);