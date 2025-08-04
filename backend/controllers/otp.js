const nodemailer = require('nodemailer');
const pool = require('../config/db');

// ✅ Send OTP to user's email
exports.sendOtp = async (req, res) => {
  const { phone, email } = req.body;

  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes



  try {
    await pool.query(`
      INSERT INTO otps (phone, code, expires_at)
      VALUES ($1, $2, $3)
      ON CONFLICT (phone) DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at
    `, [phone, otp, expiresAt]);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Your OTP for Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
          <h2 style="color: #2563eb;">🔐 OTP Verification</h2>
          <p>Use this OTP to verify your identity. Valid for <strong>5 minutes</strong>.</p>
          <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #10b981;">${otp}</div>
          <p>Ignore if not requested.</p>
          <br/>
          <p>Thanks,<br/>PCL INFO TECH Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');
    res.json({ success: true, message: 'OTP sent to email' });

  } catch (error) {
    console.error('❌ Error sending OTP:', error);
    res.status(500).json({ success: false, error: 'Failed to send OTP' });
  }
};
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required.' });
  }

  const sanitizedPhone = phone.toString().replace(/\D/g, '');
  const sanitizedOtp = otp.toString().trim();

  try {
    const result = await pool.query(
      `SELECT * FROM otps WHERE phone = $1 AND code = $2 AND expires_at > NOW()`,
      [sanitizedPhone, sanitizedOtp]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await pool.query(`DELETE FROM otps WHERE phone = $1`, [sanitizedPhone]);
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('❌ OTP Verify Error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};