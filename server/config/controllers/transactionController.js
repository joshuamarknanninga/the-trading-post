import Transaction from '../models/Transaction.js';
import Listing from '../models/Listing.js';
import User from '../models/User.js';

// @desc    Create new transaction
// @route   POST /api/transactions
// @access  Private
export const createTransaction = async (req, res) => {
  try {
    const { listingId, paymentMethod, amount } = req.body;
    
    // Get listing and seller
    const listing = await Listing.findById(listingId);
    const seller = await User.findById(listing.user);

    // Create transaction
    const transaction = await Transaction.create({
      user: req.user._id,
      listing: listingId,
      amount,
      paymentMethod,
      participants: [req.user._id, seller._id]
    });

    // Update listing status
    listing.status = 'sold';
    await listing.save();

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user transactions
// @route   GET /api/transactions/user/:userId
// @access  Private
export const getUserTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      participants: req.params.userId
    })
      .populate('listing', 'title price category')
      .populate('participants', 'name email')
      .sort('-createdAt');

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update transaction dispute
// @route   PUT /api/transactions/:id/dispute
// @access  Private
export const updateDispute = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        disputeReason: req.body.reason,
        resolutionStatus: 'under_review'
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};