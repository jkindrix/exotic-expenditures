/**
 * Plaid configuration and client setup
 */

const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const logger = require('../utils/logger');

// Determine which Plaid environment to use
const getPlaidEnvironment = () => {
  switch (process.env.PLAID_ENV) {
    case 'sandbox':
      return PlaidEnvironments.sandbox;
    case 'development':
      return PlaidEnvironments.development;
    case 'production':
      return PlaidEnvironments.production;
    default:
      return PlaidEnvironments.sandbox;
  }
};

// Configure the Plaid client
const configuration = new Configuration({
  basePath: getPlaidEnvironment(),
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

// Create and export the Plaid client
const plaidClient = new PlaidApi(configuration);

// Log the Plaid connection in development mode
if (process.env.NODE_ENV === 'development') {
  logger.info('Plaid client initialized', {
    environment: process.env.PLAID_ENV,
    clientId: process.env.PLAID_CLIENT_ID ? '[PROVIDED]' : '[MISSING]'
  });
}

/**
 * Helper function to handle Plaid API errors
 * @param {Error} error - The error from Plaid
 * @param {string} operationName - Name of the operation that failed
 * @throws {Error} - Rethrows the error with additional context
 */
const handlePlaidError = (error, operationName) => {
  logger.error(`Plaid API error during ${operationName}`, {
    error_code: error.error_code,
    error_message: error.error_message,
    error_type: error.error_type
  });

  // Enhance error with operation context
  const enhancedError = new Error(`${operationName} failed: ${error.error_message}`);
  enhancedError.type = 'PlaidError';
  enhancedError.plaidError = error;
  
  throw enhancedError;
};

module.exports = {
  plaidClient,
  handlePlaidError
};