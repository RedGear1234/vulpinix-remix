require('dotenv').config();
const User = require('./models/user');
const mongoose = require('mongoose');
async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({});
  for (const u of users) {
    if (JSON.stringify(u).includes("1111932568671242")) {
      console.log(`User who has page 1111932568671242 is: ${u.email}`);
    }
  }
  process.exit(0);
}
check();
