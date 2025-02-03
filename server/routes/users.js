import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getUserListings,
  updatePassword
} from '../controllers/userController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserAccount);

router.route('/listings')
  .get(protect, getUserListings);

router.route('/password')
  .put(protect, updatePassword);

export default router;