const express = require('express');
const { isValid } = require('date-fns');
const Task = require('../models/Task');

const router = express.Router();

/** GET /api/tasks?status=&type=&orderId=&dueBefore=ISO&limit= */
router.get('/tasks', async (req, res) => {
  try {
    const { status, type, orderId, dueBefore } = req.query;
    const limit = Math.min(Number(req.query.limit || 200), 1000);
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (orderId) filter.orderId = orderId;
    if (dueBefore) {
      const d = new Date(dueBefore);
      if (isValid(d)) filter.due = { $lte: d };
    }
    const rows = await Task.find(filter).sort({ due: 1, createdAt: -1 }).limit(limit).lean();
    res.json(rows);
  } catch (err) {
    console.error('Tasks fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/** POST /api/tasks */
router.post('/tasks', async (req, res) => {
  try {
    const { title, orderId, type, status, due, notes } = req.body;
    if (!title) return res.status(400).json({ error: 'title required' });

    const doc = await Task.create({
      title,
      orderId: orderId || undefined,
      type: type || 'other',
      status: status || 'open',
      due: due ? new Date(due) : undefined,
      notes: notes || ''
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error('Task create error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/** PUT /api/tasks/:id */
router.put('/tasks/:id', async (req, res) => {
  try {
    const update = { ...req.body };
    if (update.due) update.due = new Date(update.due);
    const doc = await Task.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(doc);
  } catch (err) {
    console.error('Task update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/** DELETE /api/tasks/:id */
router.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error('Task delete error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
