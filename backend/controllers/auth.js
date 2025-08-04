const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { fullname, email, phone, password, otp } = req.body;

  if (!phone || !otp || !fullname || !email || !password) {
    return res
      .status(400)
      .json({ error: "All fields including OTP are required" });
  }

  try {
    const sanitizedPhone = phone.toString().replace(/\D/g, "");

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (fullname, email, phone, password_hash)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [fullname, email, sanitizedPhone, hashed]
    );

    await pool.query(`DELETE FROM otps WHERE phone = $1`, [sanitizedPhone]);

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        fullname,
        email,
        phone: sanitizedPhone,
      },
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email or phone already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Signup failed" });
  }
};


const hash = '$2b$10$z5n2dOvOXe8zC/8pGH8mxe4dU5TqZfXKq1OtFQ0E8H6SGZuZXZDOm';

async function check() {
  const password = ''; // try your guess here
  const match = await bcrypt.compare(password, hash);
  console.log(match ? '✅ Match' : '❌ No match');
}

check();




const loginHandler = async (req, res, tableName) => {
  const { emailOrPhone, password } = req.body;

  if (!emailOrPhone || !password) return res.status(400).json({ message: "Missing credentials" });

  const result = await pool.query(`SELECT * FROM ${tableName} WHERE email = $1 OR phone = $1`, [emailOrPhone]);

  if (!result.rows.length) return res.status(400).json({ error: 'User not found' });

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(400).json({ error: 'Invalid credentials' });

  // 🟢 Add role here based on table
  let role = '';
  if (tableName === 'users') role = 'user';
  else if (tableName === 'admins') role = 'admin';
  else if (tableName === 'superadmins') role = 'superadmin';

  // 🛠️ Include role in token
  const token = jwt.sign({ userId: user.id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });

  res.json({
    token,
    user: {
      user_id: user.id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      profileimage: user.profileimage
    }
  });
};

exports.loginUser = (req, res) => loginHandler(req, res, "users");
exports.loginAdmin = (req, res) => loginHandler(req, res, "admins");
exports.loginSuperAdmin = (req, res) => loginHandler(req, res, "superadmins");

exports.logout = async (req, res) => {
  res.clearCookie("token"); // optional if using cookie
  res.status(200).json({ message: "Logged out successfully" });
};