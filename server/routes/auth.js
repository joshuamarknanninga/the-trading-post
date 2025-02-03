import express from 'express';
import {
  register,
  login,
  socialLogin
} from '../controllers/authController.js';

const router = express.Router();

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', register);

// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', login);

// @desc    Social login
// @route   POST /api/auth/social
// @access  Public
router.post('/social', socialLogin);

export default router;