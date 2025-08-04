

const pool = require("../config/db");

const createTables = async () => {
  try {
    // Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        fullname TEXT,
        email TEXT UNIQUE,
        phone TEXT UNIQUE,
        password_hash TEXT,
        profileimage TEXT
      );
    `);

    // Admins Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        fullname TEXT,
        email TEXT UNIQUE,
        phone TEXT UNIQUE,
        password_hash TEXT,
        profileimage TEXT
      );
    `);

    // Superadmins Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS superadmins (
        id SERIAL PRIMARY KEY,
        fullname TEXT,
        email TEXT UNIQUE,
        phone TEXT UNIQUE,
        password_hash TEXT,
        profileimage TEXT
      );
    `);

    // Unified OTPs Table (✅ updated)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE,
        phone TEXT UNIQUE,
        code TEXT NOT NULL,
        expires_at TIMESTAMP DEFAULT NOW() + interval '5 minutes'
      );
    `);

    // Appointments Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        date DATE NOT NULL,
        time TEXT NOT NULL,
        message TEXT
      );
    `);

    // Properties Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id),
        location JSONB,
        property_type TEXT,
        budget TEXT,
        bedrooms TEXT,
        posted_by TEXT[],
        photos TEXT[],
        sharing TEXT[],
        propertyCategory TEXT,
        area TEXT,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // Property Likes Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS property_likes (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id),
        property_id INT NOT NULL REFERENCES properties(id),
        UNIQUE (user_id, property_id)
      );
    `);
// Messages Table for Chatting
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INT NOT NULL REFERENCES users(id),
        receiver_id INT NOT NULL REFERENCES users(id),
        message TEXT,
        media TEXT,
        media_type TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("✅ All tables created or already exist.");
  } catch (err) {
    console.error("❌ Error creating tables:", err.message);
    process.exit(1);
  }
};

module.exports = createTables;
