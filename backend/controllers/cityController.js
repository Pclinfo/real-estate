// controllers/cityController.js
const axios = require('axios');

const getCities = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ error: 'City name is required in query' });
  }

  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: name,
        format: 'json',
        
      },
    
    });

    if (response.data.length === 0) {
      return res.status(404).json({ error: 'No results found' });
    }

    const cities = response.data.map(item => ({
      name: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }));

    res.json(cities);
  } catch (error) {
    console.error('API error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: 'Server error' });
  }
};

module.exports = { getCities };
