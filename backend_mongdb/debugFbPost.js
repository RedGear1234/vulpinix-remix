require('dotenv').config();
const axios = require('axios');
const User = require('./models/user');
const mongoose = require('mongoose');

async function post() {
  await mongoose.connect(process.env.MONGO_URI);
  const u = await User.findOne({email: 'burno7584@gmail.com'});
  const token = u.socialAccounts.facebook.accessToken;
  try {
    const res = await axios.post('https://graph.facebook.com/v18.0/me/feed', {
      message: 'Hello from Vulpinix test! This is a test post directly to the timeline.',
      access_token: token
    });
    console.log('Success:', res.data);
  } catch(e) {
    console.error('Error:', e.response?.data || e.message);
  }
  process.exit(0);
}

post();
