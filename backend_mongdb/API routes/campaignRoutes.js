const express = require("express");
const router = express.Router();
const { createCampaign, getUserCampaigns, getCampaignById } = require("../controllers/campaignController");
const { requireAuth } = require("../middleware/auth");

router.post("/create", createCampaign);
router.get("/my-campaigns", requireAuth, getUserCampaigns);
router.get("/:id", requireAuth, getCampaignById);

module.exports = router;
