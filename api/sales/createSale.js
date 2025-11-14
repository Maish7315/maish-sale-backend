const Sale = require('../../src/models/Sale');
const { authenticateToken } = require('../../src/utils/auth');
const { uploadToCloudinary } = require('../../src/utils/cloudinary');
const { initDb } = require('../../src/db');
const formidable = require('formidable');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const user = authenticateToken(req);

    // Initialize DB if needed
    await initDb();

    // Parse multipart form data
    const form = formidable({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB
    });

    const [fields, files] = await form.parse(req);
    const { item_description, amount } = fields;

    if (!item_description || !amount) {
      return res.status(400).json({ error: 'Item description and amount are required' });
    }

    // Check business hours
    const now = new Date();
    const hour = now.getHours();
    if (hour < 7 || hour >= 21) {
      return res.status(400).json({ error: 'Sales can only be submitted between 07:00 and 21:00' });
    }

    const amountCents = Math.round(parseFloat(amount[0]) * 100);
    const commissionCents = Math.round(amountCents * 0.02);
    const timestamp = now.toISOString();

    let photoPath = null;
    if (files.receipt && files.receipt[0]) {
      const file = files.receipt[0];
      // Upload to Cloudinary
      photoPath = await uploadToCloudinary(file.filepath || file._writeStream.path);
    }

    const sale = await Sale.create(user.id, item_description[0], amountCents, commissionCents, timestamp, photoPath);
    console.log(`Sale created: ${sale.id} by user ${user.id}`);

    res.status(201).json(sale);
  } catch (error) {
    console.error('Create sale error:', error);
    if (error.message === 'Access token required' || error.message === 'Invalid token') {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
}