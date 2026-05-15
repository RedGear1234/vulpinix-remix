require('dotenv').config(); 
const axios = require('axios'); 
const User = require('./models/user'); 
const mongoose = require('mongoose'); 
async function check() { 
  await mongoose.connect(process.env.MONGO_URI); 
  const u = await User.findOne({email: 'burno7584@gmail.com'}); 
  if (!u || !u.socialAccounts || !u.socialAccounts.facebook) {
    console.log("No facebook token for user.");
    process.exit(0);
  }
  const token = u.socialAccounts.facebook.accessToken; 
  console.log('Token starts with:', token.substring(0,15)); 
  try { 
    const res1 = await axios.get('https://graph.facebook.com/v18.0/me?fields=name,id,accounts&access_token=' + token); 
    console.log('User Profile:', res1.data); 
    try {
      const res3 = await axios.get('https://graph.facebook.com/v18.0/me/businesses?access_token=' + token);
      console.log('Businesses:', res3.data);
    } catch (e) { console.log("No business access"); }
    const res2 = await axios.get('https://graph.facebook.com/v18.0/me/permissions?access_token=' + token); 
    console.log('Permissions:', res2.data.data); 
  } catch(e) { 
    console.error(e.response?.data || e.message); 
  } 
  process.exit(0); 
} 
check();
