require('dotenv').config();
const User = require('./models/user');
const mongoose = require('mongoose');
async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({}).sort({updatedAt: -1});
  for (const u of users) {
    if (u.socialAccounts?.facebook?.accessToken || u.socialAccounts?.instagram?.accessToken) {
      console.log(`Email: ${u.email}, UpdatedAt: ${u.updatedAt || u.updated_at || "N/A"}`);
    }
  }
  process.exit(0);
}
check();
