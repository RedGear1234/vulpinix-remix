require("dotenv").config();
const axios = require("axios");
const User = require("./models/user");
const mongoose = require("mongoose");

async function checkPages() {
  await mongoose.connect(process.env.MONGO_URI);
  
  // Find users with socialAccounts.facebook
  const users = await User.find({ "socialAccounts.facebook.accessToken": { $exists: true, $ne: "" } });
  
  if (users.length === 0) {
    console.log("No user found with a connected Facebook account in DB.");
    process.exit(0);
  }

  for (const user of users) {
    console.log(`\nChecking Facebook connection for user: ${user.email}`);
    const token = user.socialAccounts.facebook.accessToken;
    
    try {
      const url = `https://graph.facebook.com/v18.0/me/accounts?access_token=${token}`;
      
      const response = await axios.get(url);
      const pages = response.data.data;
      
      console.log(`Found ${pages.length} pages attached to this token.`);
      pages.forEach(p => {
        console.log(`- Page Name: ${p.name}`);
        console.log(`  Page ID: ${p.id}`);
      });

    } catch (err) {
      console.error("Facebook API Error for this user:", err.response?.data?.error?.message || err.message);
    }
  }
  
  await mongoose.disconnect();
}

checkPages();
