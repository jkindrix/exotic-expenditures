/**
 * Plaid API Controller
 * Manages bank account authentication and token exchange
 */

const { validationResult } = require('express-validator');
const { plaidClient, handlePlaidError } = require('../config/stripe');
const logger = require('../utils/logger');
const { CountryCode, Products } = require('plaid');

/**
 * Create a link token for Plaid Link
 * Required to initialize Plaid Link client-side
 */
exports.createLinkToken = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.body;

    // Create configuration for link token
    const configs = {
      user: {
        client_user_id: userId
      },
      client_name: 'Exotic Expenditures, LLC',
      products: [Products.Auth], // Use Auth product for ACH data
      country_codes: [CountryCode.Us],
      language: 'en',
      webhook: process.env.PLAID_WEBHOOK_URL
    };

    // Create the link token
    const createTokenResponse = await plaidClient.linkTokenCreate(configs);
    
    logger.info('Plaid link token created', {
      userId,
      linkTokenExpiration: createTokenResponse.data.expiration
    });

    // Return the link token to the client
    return res.json({
      success: true,
      linkToken: createTokenResponse.data.link_token,
      expiration: createTokenResponse.data.expiration
    });
  } catch (error) {
    return next(handlePlaidError(error, 'creating link token'));
  }
};

/**
 * Exchange a public token for an access token
 * Called after user completes Plaid Link flow
 */
exports.exchangePublicToken = async (req, res, next) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { publicToken, accountId } = req.body;

    // Exchange public token for access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    // Get account information
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken
    });

    // Find the selected account
    const selectedAccount = accountsResponse.data.accounts.find(
      account => account.account_id === accountId
    );

    if (!selectedAccount) {
      throw new Error('Selected account not found');
    }

    // Get account and routing numbers for ACH
    const authResponse = await plaidClient.authGet({
      access_token: accessToken
    });

    // Find ACH numbers for the selected account
    const accountNumbers = authResponse.data.numbers.ach.find(
      account => account.account_id === accountId
    );

    if (!accountNumbers) {
      throw new Error('ACH account information not available');
    }

    // Store the tokens and account info in your database
    // This is simplified - in a real implementation you would save to DB
    // For example: await saveToDatabase(userId, accessToken, itemId, accountId, selectedAccount, accountNumbers);

    logger.info('Successfully exchanged Plaid public token', {
      itemId,
      accountId
    });

    // Return account information to client (exclude sensitive data)
    return res.json({
      success: true,
      accountInfo: {
        id: selectedAccount.account_id,
        name: selectedAccount.name,
        mask: selectedAccount.mask,
        type: selectedAccount.type,
        subtype: selectedAccount.subtype,
        institution: accountsResponse.data.item.institution_id,
        last4: accountNumbers.account.slice(-4)
      }
    });
  } catch (error) {
    return next(handlePlaidError(error, 'exchanging public token'));
  }
};

/**
 * Get accounts for a user
 */
exports.getAccounts = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // In a real implementation, fetch from database:
    // const userAccounts = await Account.find({ userId });

    // Simplified response for demo
    return res.json({
      success: true,
      accounts: [] // Would contain accounts from database
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Handle webhooks from Plaid
 */
exports.handleWebhook = async (req, res, next) => {
  try {
    const { webhook_type, webhook_code, item_id } = req.body;

    logger.info('Received Plaid webhook', {
      webhook_type,
      webhook_code,
      item_id
    });

    // Verify webhook signature in production
    if (process.env.NODE_ENV === 'production') {
      // Implement webhook signature verification here
    }

    // Handle different webhook types
    switch (webhook_type) {
      case 'ITEM':
        await handleItemWebhook(req.body);
        break;
      case 'AUTH':
        await handleAuthWebhook(req.body);
        break;
      // Add other webhook types as needed
    }

    // Acknowledge receipt of webhook
    return res.status(200).json({ received: true });
  } catch (error) {
    logger.error('Error processing Plaid webhook', {
      error: error.message,
      body: req.body
    });
    
    // Always acknowledge webhook receipt, even on error
    return res.status(200).json({ received: true });
  }
};

/**
 * Handle item-related webhooks
 */
async function handleItemWebhook(webhook) {
  const { webhook_code, item_id } = webhook;

  switch (webhook_code) {
    case 'ERROR':
      // Handle authentication errors
      logger.error('Plaid item error', { item_id, webhook });
      // Update item status in database
      break;
    
    case 'PENDING_EXPIRATION':
      // Handle items that are about to expire
      logger.warn('Plaid item pending expiration', { item_id });
      // Notify user to re-authenticate
      break;
      
    // Handle other item webhook codes
  }
}

/**
 * Handle auth-related webhooks
 */
async function handleAuthWebhook(webhook) {
  const { webhook_code, item_id } = webhook;

  switch (webhook_code) {
    case 'AUTOMATICALLY_VERIFIED':
      // Account numbers are verified and ready to use
      logger.info('Plaid auth automatically verified', { item_id });
      // Update account status in database
      break;
      
    case 'VERIFICATION_EXPIRED':
      // Micro-deposit verification has expired
      logger.warn('Plaid auth verification expired', { item_id });
      // Update account status in database
      break;
      
    // Handle other auth webhook codes
  }
}