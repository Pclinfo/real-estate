const express = require('express');
const router = express.Router();
const { updateProfile } = require('../controllers/profileController');
const authMiddleware = require('../middleware/auth');
const {getProfile} =require('../controllers/profileController')
const multer = require('multer');
const path = require('path');

// Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Routes
router.put('/update', authMiddleware, upload.single('profileImage'), updateProfile);
router.get('/profile/getprofile', authMiddleware, getProfile);

module.exports = router;
