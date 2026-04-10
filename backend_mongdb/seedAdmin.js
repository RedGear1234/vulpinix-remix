const mongoose = require("mongoose");
require("dotenv").config();
const Admin = require("./models/admin");

const MONGO_URI = process.env.MONGO_URI;

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existing = await Admin.findOne({ adminId: "admin" });
    if (existing) {
      console.log("ℹ️  Admin account already exists. Skipping seed.");
      process.exit(0);
    }

    // Create the default admin
    const admin = new Admin({
      adminId: "admin",
      password: "admin@vulpinix2024", // will be hashed by pre-save hook
      name: "Vulpinix Administrator",
    });
    await admin.save();

    console.log("🎉 Admin seeded successfully!");
    console.log("   Admin ID : admin");
    console.log("   Password : admin@vulpinix2024");
    console.log("   ⚠️  Please change the password after first login.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeder error:", err.message);
    process.exit(1);
  }
};

seed();
