const Campaign = require("../models/campaign");
const { publishCampaign } = require("../controllers/campaignController");

const checkScheduledCampaigns = async () => {
  try {
    const now = new Date();
    // Find all scheduled campaigns where the scheduled time is less than or equal to now
    const scheduled = await Campaign.find({
      status: "scheduled",
      scheduledAt: { $lte: now }
    });

    if (scheduled.length > 0) {
      console.log(`⏰ [SCHEDULER] Found ${scheduled.length} campaigns due for publishing.`);
      for (const campaign of scheduled) {
        console.log(`🚀 [SCHEDULER] Starting publish for campaign: "${campaign.campaignName}" (${campaign._id})`);
        
        // Use a lock state "running" to prevent multiple concurrent publish runs for the same campaign
        campaign.status = "running";
        await campaign.save();

        try {
          const results = await publishCampaign(campaign);
          console.log(`✅ [SCHEDULER] Finished publishing campaign "${campaign.campaignName}":`, results);
        } catch (publishErr) {
          console.error(`❌ [SCHEDULER] Failed to publish campaign "${campaign.campaignName}":`, publishErr);
          campaign.status = "failed";
          campaign.publishResults = { status: "failed", error: publishErr.message };
          await campaign.save();
        }
      }
    }
  } catch (err) {
    console.error("❌ [SCHEDULER] Error during scheduled campaign check:", err);
  }
};

const startScheduler = () => {
  console.log("⏰ [SCHEDULER] Background campaign scheduler started. Running every 60 seconds.");
  // Run every 60 seconds
  setInterval(checkScheduledCampaigns, 60 * 1000);
  
  // Also run immediately on start to pick up any missed campaigns
  checkScheduledCampaigns();
};

module.exports = { startScheduler };
