require('dotenv').config();
const User = require('./models/user');
const mongoose = require('mongoose');
async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const u = await User.findOne({email: 'burno7584@gmail.com'});
  if (!u) {
    console.log("User not found");
    process.exit(0);
  }
  console.log("FACEBOOK PAGE ACCESS TOKEN:");
  console.log(u.socialAccounts?.facebook?.pageAccessToken);
  console.log("\nINSTAGRAM PAGE ACCESS TOKEN:");
  console.log(u.socialAccounts?.instagram?.pageAccessToken);
  process.exit(0);
}
check();
