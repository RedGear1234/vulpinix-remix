require('dotenv').config();
const User = require('./models/user');
const mongoose = require('mongoose');
async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({});
  for (const u of users) {
    if (u.socialAccounts?.facebook?.accessToken || u.socialAccounts?.instagram?.accessToken) {
      console.log(`=========================================`);
      console.log(`EMAIL: ${u.email} | NAME: ${u.name}`);
      console.log(`FACEBOOK PAGE ACCESS TOKEN:`);
      console.log(u.socialAccounts?.facebook?.pageAccessToken || "None");
      console.log(`INSTAGRAM PAGE ACCESS TOKEN:`);
      console.log(u.socialAccounts?.instagram?.pageAccessToken || "None");
    }
  }
  process.exit(0);
}
check();
