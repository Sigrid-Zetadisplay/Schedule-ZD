// server/models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    // Manual campaign title: "Customer / Product"
    title: { type: String, required: true },

    // Flytoget client (Alexander / Ingar / etc.)
    client: { type: String, index: true },

    // Share of voice (percentage, e.g. 4.16, 8.33, 16.66)
    sov: { type: Number, default: 0 },

    // Campaign period
    start: { type: Date, required: true, index: true },
    end:   { type: Date, required: true, index: true },
    allDay: { type: Boolean, default: true },

    // Optional note
    notes: String,

    // Optional tags if you ever want to use them later
    tags: [String],

    b2b: { type: Boolean, default: false },
    direction: {
      type: String,
      enum: ['Begge retning', 'Til OSL', 'Fra OSL'],
      default: 'Begge retning'
    },
    imageUrl: { type: String },

    source: { type: String, default: 'manual', index: true },

    // NEW: status of the campaign
    status: {
      type: String,
      enum: ['new', 'scheduled'],
      default: 'new',
      index: true
    }
  },
  { timestamps: true }
);

// Virtual "bucket": upcoming/current/expired
OrderSchema.virtual('bucket').get(function () {
  const now = new Date();
  if (this.start > now) return 'upcoming';
  if (this.end > now) return 'current';
  return 'expired';
});

module.exports = mongoose.model('Order', OrderSchema);
