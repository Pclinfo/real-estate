// 📁 controllers/property.js
const pool = require('../config/db');

// Utility to safely convert input to array
function convertToPostgresArray(input) {
  if (!input) return [];
  try {
    if (typeof input === 'string') {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed.map(String);
      return String(input).split(',').map((v) => v.trim());
    }
    if (Array.isArray(input)) return input.map(String);
    return [String(input)];
  } catch {
    return String(input).split(',').map((v) => v.trim());
  }
}

exports.postProperty = async (req, res) => {
  let {
    location,
    property_type,
    budget,
    bedrooms,
    posted_by,
    sharing,
    propertyCategory,
    area
  } = req.body;

  const user_id = req.user?.userId;

  try {
    if (!user_id) {
      return res.status(400).json({ error: 'User not authenticated' });
    }

    const photos = req.files?.map((file) => file.filename) || [];
if (!photos.length) {
      return res.status(400).json({ error: 'Photos are required' });
  
}
if (!propertyCategory) {
  return res.status(400).json({ error: 'Property category is required' });
}
if (budget < 0) {
  return res.status(400).json({ error: 'Budget cannot be negative' });
  
}
if (!property_type) {
  return res.status(400).json({ error: 'Property type is required' });
}
if (!location) {
  return res.status(400).json({ error: 'Location is required' });
}
    // Parse strings into arrays
    if (typeof posted_by === 'string') posted_by = JSON.parse(posted_by);
    if (typeof sharing === 'string') sharing = JSON.parse(sharing);
    if (typeof bedrooms === 'string') bedrooms = JSON.parse(bedrooms);

    // Convert location into stringified array
    const locationArray = Array.isArray(location)
      ? location
      : String(location).split(',').map((s) => s.trim());
    const locationString = JSON.stringify(locationArray);

    const result = await pool.query(
      `INSERT INTO properties (
        user_id, location, property_type, budget, bedrooms,
        posted_by, photos, sharing, propertyCategory, area
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        user_id,
        locationString,
        property_type,
        budget,
        bedrooms,
        posted_by,
        photos,
        sharing,
        propertyCategory,
        area
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Create Error:', err);
    res.status(500).json({ error: 'Failed to create property' });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties ORDER BY id DESC');
    res.json({ properties: result.rows });
  } catch (err) {
    console.error('❌ Fetch Error:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

exports.getPropertyById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties WHERE id = $1', [req.params.id]);
    res.json({ property: result.rows[0] });
  } catch (err) {
    console.error('❌ Fetch by ID Error:', err);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
};

exports.updateProperty = async (req, res) => {
  const {
    location,
    propertyType,
    price,
    budget,
    bedrooms,
    postedBy,
    sharing,
    area
  } = req.body;

  const photos = req.files?.map((file) => file.filename) || [];

  try {
    const locationArray = Array.isArray(location)
      ? location
      : String(location).split(',').map((s) => s.trim());
    const locationString = JSON.stringify(locationArray);

    const result = await pool.query(
      `UPDATE properties SET 
        location = $1,
        property_type = $2,
        price = $3,
        budget = $4,
        bedrooms = $5,
        posted_by = $6::text[],
        photos = $7::text[],
        sharing = $8::text[],
        area = $9
      WHERE id = $10 RETURNING *;`,
      [
        locationString,
        propertyType,
        price,
        budget,
        bedrooms,
        convertToPostgresArray(postedBy),
        photos,
        convertToPostgresArray(sharing),
        area,
        req.params.id
      ]
    );
    res.json({ updated: result.rows[0] });
  } catch (err) {
    console.error('❌ Update Error:', err);
    res.status(500).json({ error: 'Failed to update property' });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    await pool.query('DELETE FROM properties WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Delete Error:', err);
    res.status(500).json({ error: 'Failed to delete property' });
  }
};

exports.getFilteredProperties = async (req, res) => {
  try {
    const {
      city,
      property_type,
      min_price,
      max_price,
      propertyCategory,
      user_id,
    } = req.query;

    const conditions = [];
    const values = [];
    let index = 1;

    // 🔍 City filter
    if (city) {
      const cityPattern = `%${city.toLowerCase().split(",")[0].trim()}%`;
      conditions.push(`LOWER(location::text) LIKE $${index++}`);
      values.push(cityPattern);
    }

    // 🔍 Property Type filter
    if (property_type) {
      conditions.push(`TRIM(LOWER(property_type)) = TRIM(LOWER($${index++}))`);
      values.push(property_type);
    }

    // 🔍 Min Budget filter
    if (min_price) {
      conditions.push(`budget IS NOT NULL AND budget::int >= $${index++}`);
      values.push(min_price);
    }

    // 🔍 Max Budget filter
    if (max_price) {
      conditions.push(`budget IS NOT NULL AND budget::int <= $${index++}`);
      values.push(max_price);
    }

    // 🔍 Category filter
    if (propertyCategory) {
      conditions.push(`LOWER(propertycategory) = LOWER($${index++})`);
      values.push(propertyCategory);
    }

    // 🔧 Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // ✅ Parse user_id safely
    const parsedUserId = user_id && user_id !== "null" ? parseInt(user_id, 10) : null;
    values.push(parsedUserId);

    // 📦 Query
    let query = `
      SELECT 
        p.*, 
        CASE 
          WHEN pl.user_id IS NULL THEN false 
          ELSE true 
        END AS "likedByCurrentUser"
      FROM properties p
      LEFT JOIN property_likes pl 
        ON p.id = pl.property_id AND pl.user_id = $${index}
      ${whereClause}
      ORDER BY p.id DESC;
    `;

    const result = await pool.query(query, values);
    res.json({ properties: result.rows });
    
  } catch (err) {
    console.error("❌ Filter Error:", err);
    res.status(500).json({ error: "Failed to filter properties" });
  }
};


exports.toggleLikeProperty = async (req, res) => {
  const { id: property_id } = req.params;
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    // Check if user already liked the property
    const result = await pool.query(
      `SELECT * FROM property_likes WHERE user_id = $1 AND property_id = $2`,
      [user_id, property_id]
    );

    let likedByCurrentUser;

    if (result.rows.length === 0) {
      // Not liked yet — Add like
      await pool.query(
        `INSERT INTO property_likes (user_id, property_id) VALUES ($1, $2)`,
        [user_id, property_id]
      );

      await pool.query(
        `UPDATE properties SET likes = likes + 1 WHERE id = $1`,
        [property_id]
      );

      likedByCurrentUser = true;
    } else {
      // Already liked — Remove like
      await pool.query(
        `DELETE FROM property_likes WHERE user_id = $1 AND property_id = $2`,
        [user_id, property_id]
      );

      await pool.query(
        `UPDATE properties SET likes = likes - 1 WHERE id = $1 AND likes > 0`,
        [property_id]
      );

      likedByCurrentUser = false;
    }

    // Return updated like count and like status
    const updated = await pool.query(
      `SELECT likes FROM properties WHERE id = $1`,
      [property_id]
    );

    res.json({
      likes: updated.rows[0].likes,
      likedByCurrentUser, // 👈 Include this
    });

  } catch (error) {
    console.error("Toggle Like Error:", error);
    res.status(500).json({ error: "Failed to toggle likes" });
  }
};
