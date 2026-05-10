require("dotenv").config();
const mongoose = require("mongoose");
const Campaign = require("./models/campaign");
const User = require("./models/user");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected\n");

    const campaigns = await Campaign.find({}).sort({ createdAt: -1 }).lean();
    console.log(`📋 Total campaigns in DB: ${campaigns.length}`);
    campaigns.forEach((c, i) => {
      console.log(`  [${i + 1}] "${c.campaignName || c.name}" | status: ${c.status} | email: ${c.userEmail || "—"} | created: ${c.createdAt}`);
    });

    console.log("");
    const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 }).lean();
    console.log(`👥 Total users in DB: ${users.length}`);
    users.forEach((u, i) => {
      console.log(`  [${i + 1}] ${u.name} | ${u.email} | joined: ${u.createdAt}`);
    });

  } catch (err) {
    console.error("❌ ERROR:", err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
