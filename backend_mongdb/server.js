const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" })); // allow base64 image uploads
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

connectDB();

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/campaign", require("./API routes/campaignRoutes"));
app.use("/api/admin", require("./API routes/adminRoutes"));
app.use("/api/users", require("./API routes/userroutes"));
app.use("/api/social", require("./API routes/socialRoutes"));

app.get("/", (req, res) => {
  res.send("Vulpinix AI Backend is running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully", status: "OK" });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});