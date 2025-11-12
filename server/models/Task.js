const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    // optional link to an order/campaign
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    type: { type: String, enum: ['report', 'followup', 'other'], default: 'other', index: true },
    status: { type: String, enum: ['open', 'in_progress', 'done'], default: 'open', index: true },
    due: { type: Date, index: true },
    notes: String
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', TaskSchema);
