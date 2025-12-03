// server/routes/orders.js
const express = require("express");
const { isValid, parseISO } = require("date-fns");
const Order = require("../models/Order");

const router = express.Router();

/**
 * GET /api/orders
 * Query:
 *  - from, to (ISO)
 *  - bucket=upcoming|current|expired|recent
 *  - q (text search in title/client/tags/notes)
 *  - client, source
 *  - limit (default 200, max 1000)
 */
router.get("/orders", async (req, res) => {
  try {
    const { from, to, bucket, q, client, source } = req.query;
    const limit = Math.min(Number(req.query.limit || 200), 1000);
    const now = new Date();

    const filter = {};

    if (client) filter.client = client;
    if (source) filter.source = source;

    // Time filters
    if (from || to) {
      filter.$and = [];
      if (from) filter.$and.push({ end: { $gte: parseISO(from) } });
      if (to) filter.$and.push({ start: { $lte: parseISO(to) } });
      if (!filter.$and.length) delete filter.$and;
    } else if (bucket) {
      if (bucket === "upcoming") {
        filter.start = { $gt: now };
      } else if (bucket === "current") {
        filter.$and = [{ start: { $lte: now } }, { end: { $gt: now } }];
      } else if (bucket === "expired" || bucket === "recent") {
        // "recently expired" = ended in last 30 days
        const dt = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filter.$and = [{ end: { $lt: now } }];
        if (bucket === "recent") filter.$and.push({ end: { $gte: dt } });
      }
    }

    // Naive text search
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { client: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
        { notes: { $regex: q, $options: "i" } },
      ];
    }

    const rows = await Order.find(filter)
      .sort({ start: 1 })
      .limit(limit)
      .lean();

    res.json(rows);
  } catch (err) {
    console.error("Orders fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * POST /api/orders  (manual entry)
 */
router.post("/orders", async (req, res) => {
  try {
    const {
      title,
      client,
      sov,
      start,
      end,
      notes,
      tags,
      b2b,
      direction,
      imageUrl,
    } = req.body;

    if (!title || !start || !end) {
      return res.status(400).json({ error: "title, start, end required" });
    }

    const s = new Date(start);
    const e = new Date(end);

    if (!(isValid(s) && isValid(e)) || e <= s) {
      return res.status(400).json({ error: "Invalid date range" });
    }

    const doc = await Order.create({
      title,
      client: client || "",
      sov:
        typeof sov === "string"
          ? Number(sov.replace(",", "."))
          : Number(sov || 0),
      start: s,
      end: e,
      allDay: true,
      notes: notes || "",
      tags: Array.isArray(tags)
        ? tags
        : tags
        ? String(tags)
            .split(",")
            .map((t) => t.trim())
        : [],

      b2b: !!b2b,
      direction: direction || "Begge retning",
      imageUrl: imageUrl || "",

      source: "manual",
      status: "new",
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error("Order create error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * PUT /api/orders/:id
 */
router.put('/orders/:id', async (req, res) => {
  try {
    const update = { ...req.body };

    if (update.sov != null && typeof update.sov === 'string') {
      update.sov = Number(update.sov.replace(',', '.'));
    }
    if (update.tags && !Array.isArray(update.tags)) {
      update.tags = String(update.tags).split(',').map(t => t.trim());
    }
    if (update.start) update.start = new Date(update.start);
    if (update.end)   update.end   = new Date(update.end);

    if (Object.prototype.hasOwnProperty.call(update, 'b2b')) {
      update.b2b = !!update.b2b;
    }

    // status (new / scheduled) just passes through

    const doc = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(doc);
  } catch (err) {
    console.error('Order update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * DELETE /api/orders/:id
 */
router.delete("/orders/:id", async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    console.error("Order delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /api/orders/summary — for dashboard counters
 */
router.get("/orders/summary", async (req, res) => {
  try {
    const now = new Date();
    const recentCut = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [upcoming, current, expiredRecent, sovCurrent] = await Promise.all([
      Order.countDocuments({ start: { $gt: now } }),
      Order.countDocuments({ start: { $lte: now }, end: { $gt: now } }),
      Order.countDocuments({ end: { $lt: now, $gte: recentCut } }),
      Order.aggregate([
        { $match: { start: { $lte: now }, end: { $gt: now } } },
        { $group: { _id: null, total: { $sum: "$sov" } } },
      ]),
    ]);

    res.json({
      upcoming,
      current,
      expiredRecent,
      sovCurrent: sovCurrent?.[0]?.total || 0,
    });
  } catch (err) {
    console.error("Orders summary error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
