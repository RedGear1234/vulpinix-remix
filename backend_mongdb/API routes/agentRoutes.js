const express = require("express");
const router = express.Router();
const { handleAgentChat, handleImageProxy } = require("../controllers/agentController");
const { requireAuth } = require("../middleware/auth");

router.post("/chat", requireAuth, handleAgentChat);
router.get("/image-proxy", handleImageProxy);

module.exports = router;
