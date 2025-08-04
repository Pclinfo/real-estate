const express = require("express");
const router = express.Router();
const { sendOTP, verifyAndResetPassword } = require("../controllers/passwordReset");

router.post("/send-otp", sendOTP); // { email, role }
router.post("/reset-password", verifyAndResetPassword); // { email, role, otp, newPassword }

module.exports = router;
