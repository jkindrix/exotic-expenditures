/**
 * Stripe API routes
 * Handles payment methods and subscriptions
 */

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const stripeController = require('../stripe/stripeController');

// Create a payment method with bank details
router.post('/create-payment-method',
  body('userId').notEmpty().withMessage('User ID is required'),
  body('accountId').notEmpty().withMessage('Account ID is required'),
  stripeController.createPaymentMethod
);

// Create a subscription (recurring contribution)
router.post('/create-subscription',
  body('userId').notEmpty().withMessage('User ID is required'),
  body('paymentMethodId').notEmpty().withMessage('Payment method ID is required'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('frequency').isIn(['monthly', 'biweekly']).withMessage('Frequency must be monthly or biweekly'),
  body('startDate').isISO8601().withMessage('Start date must be a valid date'),
  stripeController.createSubscription
);

// Update a subscription
router.patch('/update-subscription/:subscriptionId',
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('frequency').optional().isIn(['monthly', 'biweekly']).withMessage('Frequency must be monthly or biweekly'),
  stripeController.updateSubscription
);

// Pause a subscription
router.post('/pause-subscription/:subscriptionId',
  stripeController.pauseSubscription
);

// Resume a subscription
router.post('/resume-subscription/:subscriptionId',
  stripeController.resumeSubscription
);

// Cancel a subscription
router.delete('/cancel-subscription/:subscriptionId',
  stripeController.cancelSubscription
);

// Stripe webhook handler
router.post('/webhook',
  express.raw({type: 'application/json'}),
  stripeController.handleWebhook
);

module.exports = router;