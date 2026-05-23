const express = require("express");
const router = express.Router();
const { handleAgentChat } = require("../controllers/agentController");
const { requireAuth } = require("../middleware/auth");

router.post("/chat", requireAuth, handleAgentChat);

module.exports = router;
