const pool = require("../config/db");

// ✅ Book an appointment
const bookAppointment = async (req, res) => {
  const { name, email, date, time, message } = req.body;

  if (!name || !email || !date || !time) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO appointments (name, email, date, time, message) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, date, time, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Booking Error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// ✅ Get all appointments
const getAppointments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM appointments ORDER BY date ASC, time ASC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Fetch Error:", err.message);
    res.status(500).json({ error: "Could not fetch appointments" });
  }
};

module.exports = {
  bookAppointment,
  getAppointments,
};
