const express = require('express');
const { DateTime } = require('luxon');
const Order = require('../models/Order');

const router = express.Router();

/**
 * Helper: parse Jotform-style date values
 * Supports:
 * - "MM/DD/YYYY"
 * - ISO strings
 * - { month, day, year } objects (Jotform date component)
 */
function parseJotformDate(value, tz) {
  if (!value) return null;

  // If Jotform sends an object: { day: '01', month: '12', year: '2025' }
  if (typeof value === 'object' && value.year && value.month && value.day) {
    return DateTime.fromObject(
      {
        year: Number(value.year),
        month: Number(value.month),
        day: Number(value.day)
      },
      { zone: tz }
    );
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    // Try MM/DD/YYYY
    let dt = DateTime.fromFormat(trimmed, 'MM/dd/yyyy', { zone: tz });
    if (dt.isValid) return dt;

    // Try ISO
    dt = DateTime.fromISO(trimmed, { zone: tz });
    if (dt.isValid) return dt;
  }

  return null;
}

router.post('/jotform', async (req, res) => {
  try {
    const data = req.body || {};

    console.log('🔔 Jotform webhook hit:');
    console.log(JSON.stringify(data, null, 2));

    const tz = process.env.TZ || 'Europe/Oslo';

    // --- 1) Submission ID ---
    // Prefer official submission_id, but fall back to "id" field if needed.
    let submissionId =
      data.submission_id ||
      data.submissionID ||
      data['submission_id'] ||
      data.id || // your form has an "id" field label, but Jotform also uses id internally
      null;

    if (!submissionId) {
      submissionId = `jf-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      console.warn('⚠️ No submission id found, using generated:', submissionId);
    }

    // --- 2) Title / Client / SOV ---

    // Title: from your "title" field
    const title =
      data.title ||
      data['q1_title'] ||
      'Marketing Campaign';

    // Client: from "client"
    const client =
      data.client ||
      data['q2_client'] ||
      '';

    // SOV: from "sov"
    let sovRaw =
      data.sov ||
      data.SOV ||
      data['q3_sov'] ||
      0;

    const sov = Number(String(sovRaw).replace(',', '.')) || 0;

    // --- 3) Start / End dates ---

    // Based on your labels: "start" and "end"
    // Jotform might send:
    // - start: "11/11/2025"
    // - or start[day], start[month], start[year]
    const startValue =
      data.start ||
      data['q4_start'] ||
      data['start_date'] ||
      data['startDate'] ||
      data['start[date]'] ||
      data['start[day]'] && {
        day: data['start[day]'],
        month: data['start[month]'],
        year: data['start[year]']
      };

    const endValue =
      data.end ||
      data['q5_end'] ||
      data['end_date'] ||
      data['endDate'] ||
      data['end[date]'] ||
      data['end[day]'] && {
        day: data['end[day]'],
        month: data['end[month]'],
        year: data['end[year]']
      };

    let start = parseJotformDate(startValue, tz);
    let end = parseJotformDate(endValue, tz);

    if (!start || !end || !start.isValid || !end.isValid || end <= start) {
      console.warn('⚠️ Invalid or missing start/end; rejecting payload');
      return res.status(400).json({ error: 'Invalid start/end date' });
    }

    // Here we treat them as all-day or full-day ranges; adjust if you later add times.
    // I'll set to 00:00 at start and 23:59 end if they are date-only.
    if (start.hour === 0 && start.minute === 0) {
      start = start.startOf('day');
    }
    if (end.hour === 0 && end.minute === 0) {
      // Interpret end as inclusive date end.
      end = end.endOf('day');
    }

    // --- 4) Notes (optional) ---

    const notes =
      data.notes ||
      data['q6_notes'] ||
      '';

    const orderDoc = {
      jotformSubmissionId: submissionId,
      formId: data.formID || data.form_id || '',
      title,
      client,
      sov,
      start: start.toUTC().toJSDate(),
      end: end.toUTC().toJSDate(),
      allDay: true,
      notes,
      raw: data
    };

    await Order.updateOne(
      { jotformSubmissionId: submissionId },
      { $set: orderDoc },
      { upsert: true }
    );

    console.log('✅ Order stored/updated:', submissionId);
    return res.json({ ok: true });
  } catch (err) {
    console.error('❌ Webhook error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
