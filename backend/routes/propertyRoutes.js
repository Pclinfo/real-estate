const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const propertyController = require('../controllers/property');

// Public routes
router.put("/:id/like",auth,propertyController.toggleLikeProperty);
router.get('/filter',propertyController.getFilteredProperties);
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getPropertyById);

// Protected routess

router.post('/', auth, upload.array('photos'), propertyController.postProperty);

router.put('/:id', auth, upload.array('photos'), propertyController.updateProperty);
router.delete('/:id', auth, propertyController.deleteProperty);

module.exports = router;
