const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/auth');

router.post('/create-payment-intent', protect, paymentController.createPaymentIntent);
router.post('/confirm-payment', protect, paymentController.confirmPayment);

module.exports = router; 