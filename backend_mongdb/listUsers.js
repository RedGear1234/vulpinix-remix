require('dotenv').config();
const User = require('./models/user');
const mongoose = require('mongoose');
async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const users = await User.find({}, 'email name socialAccounts');
  console.log('Users in database:');
  for (const u of users) {
    console.log(`Email: ${u.email}, Name: ${u.name}`);
    console.log(`Has Facebook Token: ${!!u.socialAccounts?.facebook?.accessToken}`);
    console.log(`Has Instagram Token: ${!!u.socialAccounts?.instagram?.accessToken}`);
    console.log('---');
  }
  process.exit(0);
}
check();
