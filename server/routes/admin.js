import express from 'express';
import {
  getUsers,
  updateUserRole,
  deleteUser,
  getAdminStats
} from '../controllers/adminController.js';
import { protect, admin } from '../middlewares/auth.js';

const router = express.Router();

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, getUsers);

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
router.put('/users/:id/role', protect, admin, updateUserRole);

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
router.delete('/users/:id', protect, admin, deleteUser);

// @desc    Get admin stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, getAdminStats);

export default router;