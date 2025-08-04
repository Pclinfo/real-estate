const pool = require("../config/db");
const path = require("path");

exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, content, type } = req.body;
  const media = req.files?.map(file => `/uploads/messages/${file.filename}`) || [];

  try {
    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content, media, type)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [senderId, receiverId, content, media, type || "text"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  const { userId, partnerId } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [userId, partnerId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
