const express = require('express');
const router = express.Router();

// Import the actual controller functions that handle Stripe logic
const { createPaymentIntent, handleStripeWebhook } = require('../controllers/paymentController');

/**
 * @route POST /api/payments/create-payment-intent
 * @description Creates a Stripe Payment Intent and returns the client secret needed by the frontend.
 * @access Private (Requires authentication)
 */
// This route now matches the URL called by the Payment.jsx file (line 156)
router.post('/create-payment-intent', createPaymentIntent);

/**
 * @route POST /api/payments/webhook
 * @description Endpoint to receive payment confirmation/failure from Stripe.
 * @access Public (Payment gateways send data without authentication)
 */
router.post('/webhook', handleStripeWebhook);

module.exports = router;
