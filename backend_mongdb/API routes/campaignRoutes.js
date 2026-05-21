const express = require("express");
const router = express.Router();
const { createCampaign, getUserCampaigns, getCampaignById, updateCampaign, deleteCampaign, getAnalyticsSummary, refreshCampaignAnalytics } = require("../controllers/campaignController");
const { requireAuth } = require("../middleware/auth");

router.post("/create", createCampaign);
router.get("/analytics/summary", requireAuth, getAnalyticsSummary);
router.post("/analytics/refresh", requireAuth, refreshCampaignAnalytics);
router.get("/my-campaigns", requireAuth, getUserCampaigns);
router.get("/:id", requireAuth, getCampaignById);
router.put("/:id", requireAuth, updateCampaign);
router.delete("/:id", requireAuth, deleteCampaign);

module.exports = router;
