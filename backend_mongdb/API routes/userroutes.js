const express = require("express");
const router = express.Router();
const { registerUser, loginUser, googleAuth, updateProfile, getSettings, updateSettings } = require("../controllers/usercontrollers");
const { requireAuth } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.patch("/profile", requireAuth, updateProfile);
router.get("/settings", requireAuth, getSettings);
router.patch("/settings", requireAuth, updateSettings);

module.exports = router;