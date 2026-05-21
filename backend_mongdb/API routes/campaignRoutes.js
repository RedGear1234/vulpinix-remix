const express = require("express");
const router = express.Router();
const { createCampaign, getUserCampaigns, getCampaignById, updateCampaign, deleteCampaign } = require("../controllers/campaignController");
const { requireAuth } = require("../middleware/auth");

router.post("/create", createCampaign);
router.get("/my-campaigns", requireAuth, getUserCampaigns);
router.get("/:id", requireAuth, getCampaignById);
router.put("/:id", requireAuth, updateCampaign);
router.delete("/:id", requireAuth, deleteCampaign);

module.exports = router;
