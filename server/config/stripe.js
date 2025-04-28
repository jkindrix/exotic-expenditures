/**
 * Stripe configuration and client setup
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../utils/logger');

// Initialize Stripe with the appropriate API version
stripe.setApiVersion('2023-08-16');

// Log the Stripe connection in development mode
if (process.env.NODE_ENV === 'development') {
  logger.info('Stripe initialized', {
    environment: process.env.NODE_ENV,
    apiVersion: stripe.getApiField('version')
  });
}

/**
 * Helper function to handle Stripe API errors
 * @param {Error} error - The error from Stripe
 * @param {string} operationName - Name of the operation that failed
 * @throws {Error} - Rethrows the error with additional context
 */
const handleStripeError = (error, operationName) => {
  logger.error(`Stripe API error during ${operationName}`, {
    type: error.type,
    code: error.code,
    message: error.message
  });

  // Enhance the error with operation context
  error.message = `${operationName} failed: ${error.message}`;
  throw error;
};

module.exports = {
  stripe,
  handleStripeError
};