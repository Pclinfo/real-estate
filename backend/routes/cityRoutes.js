// routes/cityRoutes.js
const express = require('express');
const router = express.Router();
const { getCities } = require('../controllers/cityController');

router.get('/cities', getCities);

module.exports = router;
