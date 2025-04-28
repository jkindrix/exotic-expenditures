/**
 * Exotic Expenditures Payment Server
 * Handles secure communication with Stripe and Plaid APIs
 */

// Load environment variables
require('dotenv').config();

// Required packages
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import routes
const routes = require('./routes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// App initialization
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://exoticexpenditures.com' 
    : 'http://localhost:8000',
  credentials: true
}));
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Request logging

// Static files (for development/testing only)
if (process.env.NODE_ENV === 'development') {
  app.use(express.static(path.join(__dirname, '../')));
}

// Routes
app.use('/api', routes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = app; // For testing