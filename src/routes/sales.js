const express = require('express');
const multer = require('multer');
const path = require('path');
const { submitSale, getUserSales } = require('../controllers/salesController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/', authenticateToken, upload.single('receipt'), submitSale);
router.get('/me', authenticateToken, getUserSales);

module.exports = router;