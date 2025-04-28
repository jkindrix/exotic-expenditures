/**
 * Plaid API routes
 * Handles bank account linking and token exchange
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const plaidController = require('../plaid/plaidController');

// Create a link token for Plaid Link
router.post('/create-link-token',
  body('userId').notEmpty().withMessage('User ID is required'),
  plaidController.createLinkToken
);

// Exchange public token for access token
router.post('/exchange-public-token',
  body('publicToken').notEmpty().withMessage('Public token is required'),
  body('accountId').notEmpty().withMessage('Account ID is required'),
  plaidController.exchangePublicToken
);

// Get connected accounts
router.get('/accounts/:userId',
  plaidController.getAccounts
);

// Plaid webhook handler
router.post('/webhook',
  plaidController.handleWebhook
);

module.exports = router;