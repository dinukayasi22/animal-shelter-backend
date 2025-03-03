const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const { protect, admin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Add file type validation
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, `${Date.now()}-${file.originalname}`);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 
  }
});

// Public routes
router.get('/', animalController.getAnimals);
router.get('/:id', animalController.getAnimalById);

// Admin routes
router.post(
  '/', 
  protect, 
  admin, 
  upload.single('image'), 
  animalController.createAnimal
);

router.put(
  '/:id', 
  protect, 
  admin, 
  upload.single('image'), 
  animalController.updateAnimal
);

// Delete route
router.delete(
  '/:id',
  protect,
  admin,
  animalController.deleteAnimal
);

// Error handling middleware
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File size is too large. Maximum size is 5MB'
      });
    }
  }
  
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      message: error.message
    });
  }

  next(error);
});

module.exports = router;