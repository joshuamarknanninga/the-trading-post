import express from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing
} from '../controllers/listingController.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
router.get('/', getListings);

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
router.get('/:id', getListingById);

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
router.post('/', protect, createListing);

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
router.put('/:id', protect, updateListing);

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
router.delete('/:id', protect, deleteListing);

export default router;