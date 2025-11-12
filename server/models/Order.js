const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    jotformSubmissionId: { type: String, unique: true, sparse: true },
    formId: String,

    // manual / jotform / flytoget
    source: { type: String, enum: ['manual', 'jotform', 'flytoget'], default: 'manual', index: true },

    title: { type: String, required: true },
    client: { type: String, index: true },
    sov: { type: Number, default: 0 }, // decide 0-100

    start: { type: Date, required: true, index: true },
    end:   { type: Date, required: true, index: true },
    allDay: { type: Boolean, default: true },

    notes: String,
    tags: [String],

    raw: {}
  },
  { timestamps: true }
);

// Virtual "bucket": upcoming/current/expired (recently)
OrderSchema.virtual('bucket').get(function () {
  const now = new Date();
  if (this.start > now) return 'upcoming';
  if (this.end > now) return 'current';
  return 'expired';
});

module.exports = mongoose.model('Order', OrderSchema);
