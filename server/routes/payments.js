import express from 'express';
import {
  createPaymentIntent,
  handleWebhook,
  getPaymentHistory
} from '../controllers/paymentController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// @desc    Create payment intent
// @route   POST /api/payments/intent
// @access  Private
router.post('/intent', protect, createPaymentIntent);

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
router.get('/history', protect, getPaymentHistory);

// @desc    Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;