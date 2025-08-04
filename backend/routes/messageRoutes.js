const express = require("express");
const router = express.Router();
const upload = require("../middleware/messageUpload");
const {
  sendMessage,
  getMessages,
} = require("../controllers/messageController");
const authMiddleware = require('../middleware/auth');
router.post("/send", upload.array("media"),authMiddleware, sendMessage);
router.get("/:userId/:partnerId", authMiddleware, getMessages);

module.exports = router;
