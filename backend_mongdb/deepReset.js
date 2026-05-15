require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/user');

async function reset() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await User.updateOne(
      { email: 'burno7584@gmail.com' },
      { $set: { socialAccounts: {} } }
    );
    console.log('--- DEEP RESET SUCCESSFUL ---');
    console.log('Matched users:', result.matchedCount);
    console.log('Updated users:', result.modifiedCount);
    console.log('All Facebook/Instagram tokens have been wiped for burno7584@gmail.com');
  } catch (err) {
    console.error('Reset failed:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

reset();
