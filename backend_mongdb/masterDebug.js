require('dotenv').config();
const axios = require('axios');
const User = require('./models/user');
const mongoose = require('mongoose');

async function masterDebug() {
  await mongoose.connect(process.env.MONGO_URI);
  const user = await User.findOne({ email: 'burno7584@gmail.com' });
  
  if (!user || !user.socialAccounts?.facebook?.accessToken) {
    console.log("No token found. Please run the connection link first.");
    process.exit(0);
  }

  const token = user.socialAccounts.facebook.accessToken;
  console.log("--- MASTER DEBUG START ---");
  
  const endpoints = [
    { name: "Me Profile", url: "https://graph.facebook.com/v18.0/me?fields=id,name,email" },
    { name: "Accounts (Pages)", url: "https://graph.facebook.com/v18.0/me/accounts" },
    { name: "Permissions", url: "https://graph.facebook.com/v18.0/me/permissions" },
    { name: "Debug Token", url: `https://graph.facebook.com/debug_token?input_token=${token}&access_token=${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}` },
    { name: "Instagram Accounts", url: "https://graph.facebook.com/v18.0/me/accounts?fields=instagram_business_account,name" }
  ];

  for (const ep of endpoints) {
    try {
      const res = await axios.get(ep.url + (ep.url.includes('?') ? '&' : '?') + `access_token=${token}`);
      console.log(`\n[${ep.name}] SUCCESS:`);
      console.log(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.log(`\n[${ep.name}] FAILED:`, err.response?.data?.error?.message || err.message);
    }
  }

  await mongoose.disconnect();
}

masterDebug();
