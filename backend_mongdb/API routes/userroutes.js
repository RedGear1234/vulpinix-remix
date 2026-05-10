const express = require("express");
const router = express.Router();
const { registerUser, loginUser, googleAuth } = require("../controllers/usercontrollers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);

module.exports = router;