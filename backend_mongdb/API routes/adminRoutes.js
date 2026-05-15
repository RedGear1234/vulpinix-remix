const express = require("express");
const router = express.Router();
const { adminLogin, getAllCampaigns, getCampaignDetail, updateCampaignStatus, getAllUsers } = require("../controllers/adminController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

router.post("/login", adminLogin);
router.get("/campaigns", requireAuth, requireAdmin, getAllCampaigns);
router.get("/campaigns/:id", requireAuth, requireAdmin, getCampaignDetail);
router.patch("/campaigns/:id/status", requireAuth, requireAdmin, updateCampaignStatus);
router.get("/users", requireAuth, requireAdmin, getAllUsers);

module.exports = router;
