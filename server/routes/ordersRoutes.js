// server/routes/ordersRoutes.js
import express from 'express';
import Order from '../models/Order.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

function getBucketFilter(bucket) {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  if (bucket === 'current') {
    return {
      start: { $lte: endOfToday },
      end: { $gte: startOfToday },
    };
  }

  if (bucket === 'upcoming') {
    return {
      start: { $gt: endOfToday },
    };
  }

  if (bucket === 'recent') {
    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return {
      end: { $gte: sevenDaysAgo, $lt: startOfToday },
    };
  }

  if (bucket === 'expired') {
    return {
      end: { $lt: startOfToday },
    };
  }

  return {};
}

// GET /api/orders
router.get('/orders', requireAuth, async (req, res) => {
  try {
    const { bucket, limit = 100 } = req.query;

    const query = {
      createdBy: req.user._id,
      ...getBucketFilter(bucket),
    };

    const orders = await Order.find(query)
      .sort({ start: 1, createdAt: -1 })
      .limit(Number(limit));

    return res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// POST /api/orders
router.post('/orders', requireAuth, async (req, res) => {
  try {
    const {
      title,
      client,
      sov,
      start,
      end,
      notes,
      b2b,
      direction,
      imageUrl,
      allDay,
      status,
    } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!start || !end) {
      return res.status(400).json({ message: 'Start and end are required' });
    }

    const order = await Order.create({
      title: title.trim(),
      client: client || '',
      sov: sov || '',
      start,
      end,
      notes: notes || '',
      b2b: !!b2b,
      direction: direction || 'Begge retning',
      imageUrl: imageUrl || '',
      allDay: allDay ?? true,
      status: status || 'new',
      createdBy: req.user._id,
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ message: 'Failed to create order' });
  }
});

// PATCH /api/orders/:id
router.patch('/orders/:id', requireAuth, async (req, res) => {
  try {
    const allowedFields = [
      'title',
      'client',
      'sov',
      'start',
      'end',
      'notes',
      'b2b',
      'direction',
      'imageUrl',
      'allDay',
      'status',
    ];

    const patch = {};

    for (const key of allowedFields) {
      if (key in req.body) {
        patch[key] = req.body[key];
      }
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      patch,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json(order);
  } catch (error) {
    console.error('Update order error:', error);
    return res.status(500).json({ message: 'Failed to update order' });
  }
});

// DELETE /api/orders/:id
router.delete('/orders/:id', requireAuth, async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.json({ message: 'Order deleted' });
  } catch (error) {
    console.error('Delete order error:', error);
    return res.status(500).json({ message: 'Failed to delete order' });
  }
});

export default router;