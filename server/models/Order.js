const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    jotformSubmissionId: { type: String, unique: true, index: true },
    formId: String,

    title: String,
    client: String,
    sov: Number,

    start: { type: Date, required: true },
    end: { type: Date, required: true },
    allDay: { type: Boolean, default: false },

    notes: String,
    tags: [String],

    raw: {}
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
