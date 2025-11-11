const express = require('express');
const { DateTime } = require('luxon');
const { createEvents } = require('ics');
const Order = require('../models/Order');

const router = express.Router();

/**
 * Public calendar feed:
 * Outlook/Google/etc can subscribe to:
 * http://localhost:4000/calendar.ics
 */
router.get('/calendar.ics', async (req, res) => {
  try {
    const orders = await Order.find().sort({ start: 1 }).lean();

    const events = orders.map((o) => {
      const start = DateTime.fromJSDate(o.start).setZone('Europe/Oslo');
      const end = DateTime.fromJSDate(o.end).setZone('Europe/Oslo');

      return {
        title: o.title || 'Order',
        description: `Client: ${o.client || ''}\nSOV: ${o.sov || ''}\nNotes: ${
          o.notes || ''
        }`,
        start: [start.year, start.month, start.day, start.hour, start.minute],
        end: [end.year, end.month, end.day, end.hour, end.minute],
        startInputType: 'local',
        startOutputType: 'local',
        endInputType: 'local',
        endOutputType: 'local',
        uid: `order-${o.jotformSubmissionId || o._id}@schedule-zd`,
        calName: 'Schedule ZD Orders',
        productId: '//Schedule-ZD//Orders//EN'
      };
    });

    createEvents(events, (error, value) => {
      if (error) {
        console.error('ICS error:', error);
        return res.status(500).send('ICS generation error');
      }

      res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="schedule-zd-orders.ics"'
      );
      return res.send(value);
    });
  } catch (err) {
    console.error('Calendar error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
