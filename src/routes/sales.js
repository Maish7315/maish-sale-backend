const express = require('express');
const multer = require('multer');
const path = require('path');
const { submitSale, getUserSales } = require('../controllers/salesController');
const { authenticateToken } = require('../middleware/auth');
const { UPLOAD_DIR } = require('../config');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', UPLOAD_DIR));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

router.post('/create', authenticateToken, upload.single('receipt'), submitSale);
router.get('/me', authenticateToken, getUserSales);

module.exports = router;