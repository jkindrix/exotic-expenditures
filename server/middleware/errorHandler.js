/**
 * Centralized error handler for the API
 * Provides consistent error responses and logging
 */

const logger = require('../utils/logger');

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('API Error', { 
    error: err.message, 
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Default status code and message
  let statusCode = 500;
  let message = 'Internal server error';
  let errors = null;

  // Handle different types of errors
  if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation error';
    errors = Object.values(err.errors).map(e => e.message);
  } else if (err.name === 'CastError') {
    // Mongoose cast error (invalid ID)
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    // MongoDB duplicate key error
    statusCode = 409;
    message = 'Duplicate key error';
  } else if (err.statusCode) {
    // Error with explicitly set status code
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.status) {
    // Error with status property
    statusCode = err.status;
    message = err.message;
  } else if (err.type === 'StripeCardError') {
    // Stripe card error
    statusCode = 400;
    message = err.message;
  } else if (err.type === 'StripeInvalidRequestError') {
    // Stripe invalid request error
    statusCode = 400;
    message = err.message;
  } else if (err.type === 'PlaidError') {
    // Plaid error
    statusCode = 400;
    message = err.message;
  }

  // Return error response
  res.status(statusCode).json({
    success: false,
    message,
    errors: errors || undefined,
    // Include request ID if available for support reference
    requestId: req.id
  });
};

module.exports = errorHandler;