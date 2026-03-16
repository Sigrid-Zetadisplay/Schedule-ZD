// server/models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    client: {
      type: String,
      trim: true,
      default: '',
    },
    sov: {
      type: String,
      trim: true,
      default: '',
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    abTest: {
      type: Boolean,
      default: false,
    },
    chain: {
      type: String,
      trim: true,
      default: 'All',
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    allDay: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['new', 'scheduled'],
      default: 'new',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;