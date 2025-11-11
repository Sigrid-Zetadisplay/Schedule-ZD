const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', require('./routes/orders'));


// MongoDB connect - use MONGODB_URI from .env
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('❌ MONGODB_URI is not set in .env');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Health route
app.get('/health', (req, res) => {
  res.json({ ok: true, message: 'API running' });
});

// Feature routes
app.use('/webhooks', require('./routes/jotformWebhook'));
app.use('/', require('./routes/calendar'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
