/**
 * Transaction API routes
 * Handles transaction history and receipts
 */

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

// Get transaction history for a user
router.get('/:userId',
  transactionController.getTransactions
);

// Get specific transaction details
router.get('/detail/:transactionId',
  transactionController.getTransactionDetail
);

// Download transaction receipt
router.get('/download/:transactionId',
  transactionController.downloadReceipt
);

// Email transaction receipt
router.post('/email/:transactionId',
  transactionController.emailReceipt
);

module.exports = router;