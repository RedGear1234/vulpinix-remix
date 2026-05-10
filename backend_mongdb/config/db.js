const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.warn("⚠️  Server continuing without MongoDB. Some features may not work.");
    // Don't exit — let the server start anyway
  }
};

module.exports = connectDB;
