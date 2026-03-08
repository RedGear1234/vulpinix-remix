const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("Vulpinix AI Backend is running 🚀");
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend connected successfully",
    status: "OK"
  });
});