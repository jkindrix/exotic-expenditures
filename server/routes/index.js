/**
 * API routes index
 * Routes all API requests to appropriate controllers
 */

const express = require('express');
const router = express.Router();

// Import route modules
const plaidRoutes = require('./plaidRoutes');
const stripeRoutes = require('./stripeRoutes');
const transactionRoutes = require('./transactionRoutes');

// API status endpoint
router.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Mount route modules
router.use('/plaid', plaidRoutes);
router.use('/stripe', stripeRoutes);
router.use('/transactions', transactionRoutes);

module.exports = router;