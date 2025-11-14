const Sale = require('../models/Sale');

const submitSale = async (req, res) => {
  const { item_description, amount } = req.body;
  const userId = req.user.id;

  if (!item_description || !amount) {
    return res.status(400).json({ error: 'Item description and amount are required' });
  }

  const now = new Date();
  const hour = now.getHours();
  if (hour < 7 || hour >= 21) {
    return res.status(400).json({ error: 'Sales can only be submitted between 07:00 and 21:00' });
  }

  const amountCents = Math.round(parseFloat(amount) * 100);
  const commissionCents = Math.round(amountCents * 0.02);
  const timestamp = now.toISOString();
  const photoPath = req.file ? req.file.filename : null;

  try {
    const sale = await Sale.create(userId, item_description, amountCents, commissionCents, timestamp, photoPath);
    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getUserSales = async (req, res) => {
  const userId = req.user.id;

  try {
    const sales = await Sale.findByUserId(userId);
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { submitSale, getUserSales };