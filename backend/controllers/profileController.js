const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.updateProfile = async (req, res) => {
  const { fullname, email, phone, removeImage } = req.body;
  const userId = req.user?.userId;
  const role = req.user?.role;

  if (!userId || !role) {
    return res.status(400).json({ message: 'Missing user ID or role' });
  }

  let tableName;
  if (role === 'user') tableName = 'users';
  else if (role === 'admin') tableName = 'admins';
  else if (role === 'superadmin') tableName = 'superadmins';
  else return res.status(400).json({ message: 'Invalid role' });

  try {
    // 🔍 Get existing image
    const { rows: existingRows } = await pool.query(
      `SELECT profileimage FROM ${tableName} WHERE id = $1`,
      [userId]
    );

    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const oldImage = existingRows[0].profileimage;
    let newProfileImage = oldImage;

    // 📤 If a new file is uploaded
    if (req.file) {
      newProfileImage = req.file.filename;

      // 🧹 Delete old image if exists
      if (oldImage) {
        const oldPath = path.join(__dirname, '../uploads/profiles/', oldImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
    }

    // ❌ Remove image manually
    if (removeImage === 'true' && !req.file) {
      if (oldImage) {
        const oldPath = path.join(__dirname, '../uploads/profiles/', oldImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      newProfileImage = null;
    }

    // 🔄 Update query
    const updateQuery = `
      UPDATE ${tableName}
      SET fullname = $1, email = $2, phone = $3, profileimage = $4
      WHERE id = $5
      RETURNING id, fullname, email, phone, profileimage
    `;
    const values = [fullname, email, phone, newProfileImage, userId];

    const { rows } = await pool.query(updateQuery, values);

    res.json({
      message: 'Profile updated successfully',
      updatedUser: rows[0],
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const role = req.user?.role; // 'user', 'admin', or 'superadmin'

    if (!userId || !role) {
      return res.status(400).json({ message: 'Missing user ID or role from token' });
    }

    let tableName;
    if (role === 'user') tableName = 'users';
    else if (role === 'admin') tableName = 'admins';
    else if (role === 'superadmin') tableName = 'superadmins';
    else return res.status(400).json({ message: 'Invalid role' });

    const query = `SELECT id, fullname, email, phone, profileimage FROM ${tableName} WHERE id = $1`;
    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get Profile Error:', error.message);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
};