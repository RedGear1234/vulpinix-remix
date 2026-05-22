const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// â”€â”€ Register â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, googleId, picture } = req.body;

    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ success: false, message: "An account with this email already exists" });

    const name = [firstName, lastName].filter(Boolean).join(" ").trim() || email.split("@")[0];
    const hashedPassword = password ? bcrypt.hashSync(password, 10) : undefined;

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      googleId: googleId || "",
      company: "",
      phone: "",
    });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, googleId: user.googleId, onboardingCompleted: user.onboardingCompleted },
    });
  } catch (err) {
    console.error("Register error full:", err.stack || err);
    res.status(500).json({ success: false, message: err.message || "Server error during registration" });
  }
};

// â”€â”€ Login â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ success: false, message: "No account found with this email" });
    if (!user.password) return res.status(401).json({ success: false, message: "This account uses Google Sign-In. Please continue with Google." });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Logged in successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, googleId: user.googleId, onboardingCompleted: user.onboardingCompleted },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
};

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// â”€â”€ Google Auth (upsert) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ success: false, message: "Missing Google credential" });
    }

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email || !googleId) {
      return res.status(400).json({ success: false, message: "Invalid token payload" });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

    if (user) {
      // Update googleId or picture if it was missing/changed
      let updated = false;
      if (!user.googleId) { user.googleId = googleId; updated = true; }
      if (picture && user.picture !== picture) { user.picture = picture; updated = true; }
      if (updated) await user.save();
    } else {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        googleId,
        picture: picture || "",
        company: "",
        phone: "",
      });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Google auth successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
        picture: user.picture
      },
    });
  } catch (err) {
    console.error("Google auth error:", err);
    res.status(500).json({ success: false, message: "Authentication failed. Please try again." });
  }
};
// â”€â”€ Update Profile (Onboarding) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const updateProfile = async (req, res) => {
  try {
    const { phone, company, industry, location, website, businessType } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (phone !== undefined)        user.phone        = phone.trim();
    if (company !== undefined)      user.company      = company.trim();
    if (industry !== undefined)     user.industry     = industry.trim();
    if (location !== undefined)     user.location     = location.trim();
    if (website !== undefined)      user.website      = website.trim();
    if (businessType !== undefined) user.businessType = businessType.trim();

    user.onboardingCompleted = true;
    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        industry: user.industry || "",
        location: user.location || "",
        website: user.website || "",
        businessType: user.businessType || "",
        onboardingCompleted: true,
      },
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ success: false, message: "Server error updating profile" });
  }
};

// ── Settings (Get and Update) ──────────────────────────────────────────────────
const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, settings: user.settings || {} });
  } catch (err) {
    console.error("getSettings error:", err);
    res.status(500).json({ success: false, message: "Server error getting settings" });
  }
};

const updateSettings = async (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ success: false, message: "Invalid settings data" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Merge settings
    user.settings = { ...user.settings, ...settings };
    
    // Using markModified since Mixed type changes aren't tracked automatically
    user.markModified("settings");
    await user.save();

    res.json({ success: true, message: "Settings updated successfully", settings: user.settings });
  } catch (err) {
    console.error("updateSettings error:", err);
    res.status(500).json({ success: false, message: "Server error updating settings" });
  }
};

module.exports = { registerUser, loginUser, googleAuth, updateProfile, getSettings, updateSettings };