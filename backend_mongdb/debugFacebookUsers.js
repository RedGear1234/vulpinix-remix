require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({});
  users.forEach(u => {
    if (u.socialAccounts && u.socialAccounts.facebook && u.socialAccounts.facebook.accessToken) {
      console.log(`User ${u.email} HAS facebook token`);
    } else {
      console.log(`User ${u.email} does NOT have facebook token`);
    }
  });
  process.exit(0);
}
check();
