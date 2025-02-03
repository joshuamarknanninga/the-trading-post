import express from 'express';
import {
  createTransaction,
  getUserTransactions,
  updateDispute
} from '../controllers/transactionController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protect, createTransaction);
router.get('/user/:userId', protect, getUserTransactions);
router.put('/:id/dispute', protect, updateDispute);

export default router;