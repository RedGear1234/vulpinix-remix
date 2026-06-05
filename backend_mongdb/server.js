const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(o => o.trim())
  : ["http://localhost:3000", "http://localhost:5173"];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin '${origin}' not allowed`));
  },
  credentials: true,
}));
app.use(express.json({ limit: "25mb" })); // allow base64 image uploads (4MB img ≈ 5.5MB base64)
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

connectDB().then(() => {
  const { startScheduler } = require("./config/scheduler");
  startScheduler();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/campaign", require("./API routes/campaignRoutes"));
app.use("/api/admin", require("./API routes/adminRoutes"));
app.use("/api/users", require("./API routes/userroutes"));
app.use("/api/social", require("./API routes/socialRoutes"));
app.use("/api/agent", require("./API routes/agentRoutes"));

app.get("/", (req, res) => {
  res.send("Vulpinix AI Backend is running 🚀");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully", status: "OK" });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});