const express = require('express');
const Order = require('../models/Order');

const router = express.Router();

// GET /api/orders - list recent orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100).lean();
    res.json(orders);
  } catch (err) {
    console.error('Orders fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
