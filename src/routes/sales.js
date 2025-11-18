import express from 'express';
import multer from 'multer';
import { Sale } from '../models/Sale.js';
import { authenticateToken } from '../auth.js';
import { uploadToCloudinary } from '../cloudinary.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Middleware to authenticate
const authMiddleware = (req, res, next) => {
  try {
    req.user = authenticateToken(req);
    next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

// POST /api/sales/createSale
router.post('/createSale', authMiddleware, upload.single('receipt'), async (req, res) => {
  try {
    const { item_description, amount } = req.body;

    // Input validation
    if (!item_description || !amount) {
      return res.status(400).json({ error: 'Item description and amount are required' });
    }

    if (!item_description.trim()) {
      return res.status(400).json({ error: 'Item description cannot be empty' });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // Check business hours (UTC time)
    const now = new Date();
    const hour = now.getUTCHours();
    if (hour < 7 || hour >= 21) {
      return res.status(400).json({ error: 'Sales can only be submitted between 07:00 and 21:00 UTC' });
    }

    const amountCents = Math.round(amountNum * 100);
    const commissionCents = Math.round(amountCents * 0.02);
    const timestamp = now.toISOString();

    let photoPath = null;
    if (req.file) {
      try {
        photoPath = await uploadToCloudinary(req.file.path);
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        // Continue without photo - don't fail the sale
      }
    }

    const sale = await Sale.create(req.user.id, item_description.trim(), amountCents, commissionCents, timestamp, photoPath);

    console.log(`Sale created successfully: ID ${sale.id} by user ${req.user.username}`);

    res.status(201).json({
      message: 'Sale created successfully',
      sale: {
        id: sale.id,
        item_description: item_description.trim(),
        amount_cents: amountCents,
        commission_cents: commissionCents,
        timestamp,
        photo_path: photoPath,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Create sale error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/sales/getSales
router.get('/getSales', authMiddleware, async (req, res) => {
  try {
    const sales = await Sale.findByUserId(req.user.id);

    console.log(`Retrieved ${sales.length} sales for user: ${req.user.username}`);

    res.json({
      message: 'Sales retrieved successfully',
      sales: sales.map(sale => ({
        id: sale.id,
        item_description: sale.item_description,
        amount_cents: sale.amount_cents,
        commission_cents: sale.commission_cents,
        timestamp: sale.timestamp,
        photo_path: sale.photo_path,
        status: 'pending', // Assuming all are pending
        created_at: sale.created_at
      }))
    });
  } catch (error) {
    console.error('Get sales error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;