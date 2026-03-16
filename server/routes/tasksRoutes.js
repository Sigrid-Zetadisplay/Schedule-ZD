// server/routes/tasksRoutes.js
import express from 'express';
import Task from '../models/Task.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/tasks
router.get('/tasks', requireAuth, async (req, res) => {
  try {
    const { limit = 100 } = req.query;

    const tasks = await Task.find({ createdBy: req.user._id })
      .sort({ status: 1, due: 1, createdAt: -1 })
      .limit(Number(limit));

    return res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

// POST /api/tasks
router.post('/tasks', requireAuth, async (req, res) => {
  try {
    const { title, type, status, due, notes } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      title: title.trim(),
      type: type || 'other',
      status: status || 'open',
      due: due || null,
      notes: notes || '',
      createdBy: req.user._id,
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    return res.status(500).json({ message: 'Failed to create task' });
  }
});

// PATCH /api/tasks/:id
router.patch('/tasks/:id', requireAuth, async (req, res) => {
  try {
    const allowedFields = ['title', 'type', 'status', 'due', 'notes'];
    const patch = {};

    for (const key of allowedFields) {
      if (key in req.body) {
        patch[key] = req.body[key];
      }
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      patch,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    return res.status(500).json({ message: 'Failed to update task' });
  }
});

// DELETE /api/tasks/:id
router.delete('/tasks/:id', requireAuth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error);
    return res.status(500).json({ message: 'Failed to delete task' });
  }
});

export default router;