

const pool = require("../config/db");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Utility to find role and table from email
const getUserTableByEmail = async (email) => {
  const checkUser = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  if (checkUser.rows.length) return { table: "users", user: checkUser.rows[0] };

  const checkAdmin = await pool.query(`SELECT * FROM admins WHERE email = $1`, [email]);
  if (checkAdmin.rows.length) return { table: "admins", user: checkAdmin.rows[0] };

  const checkSuper = await pool.query(`SELECT * FROM superadmins WHERE email = $1`, [email]);
  if (checkSuper.rows.length) return { table: "superadmins", user: checkSuper.rows[0] };

  return null;
};

// === SEND OTP ===
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const userData = await getUserTableByEmail(email);
    if (!userData) return res.status(404).json({ error: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP
    await pool.query(`
      INSERT INTO otps (email, code, expires_at) 
      VALUES ($1, $2, NOW() + interval '5 minutes')
      ON CONFLICT (email) DO UPDATE SET code = EXCLUDED.code, expires_at = NOW() + interval '5 minutes'
    `, [email, otp]);

    // Mail config
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email Template
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #4CAF50;">Password Reset Request</h2>
        <p>Hi,</p>
        <p>Your OTP for resetting your password is:</p>
        <h1 style="background-color: #f4f4f4; padding: 15px; display: inline-block; border-radius: 5px;">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
        <br>
        <p>If you didn't request a password reset, you can ignore this email.</p>
        <p style="color: gray;">— Real Estate Team</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Real Estate Support" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Your OTP for Password Reset",
      html: htmlContent,
    });

    res.json({ message: "OTP sent to email." });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ error: "Server error sending OTP" });
  }
};

// === VERIFY & RESET PASSWORD ===
exports.verifyAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const validOtp = await pool.query(
      `SELECT * FROM otps WHERE email = $1 AND code = $2 AND expires_at > NOW()`,
      [email, otp]
    );

    if (!validOtp.rows.length)
      return res.status(400).json({ error: "Invalid or expired OTP" });

    const userData = await getUserTableByEmail(email);
    if (!userData) return res.status(404).json({ error: "User not found" });

    const hashed = await bcrypt.hash(newPassword, 10);

    await pool.query(
      `UPDATE ${userData.table} SET password_hash = $1 WHERE email = $2`,
      [hashed, email]
    );

    await pool.query(`DELETE FROM otps WHERE email = $1`, [email]);

    res.json({ message: "Password reset successful." });
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json({ error: "Server error resetting password" });
  }
};
