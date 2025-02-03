import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  platformFee: {
    type: Number,
    default: function() {
      return this.amount * 0.07; // 7% platform fee
    }
  },
  sellerPayout: {
    type: Number,
    default: function() {
      return this.amount - this.platformFee;
    }
  },
  paymentMethod: {
    type: String,
    enum: ['paypal', 'stripe', 'barter', 'cash'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionType: {
    type: String,
    enum: ['purchase', 'refund', 'service_fee'],
    default: 'purchase'
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  paymentIntentId: String, // For Stripe transactions
  barterDetails: {
    offeredItems: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing'
    }]
  },
  disputeReason: String,
  resolutionStatus: {
    type: String,
    enum: ['none', 'under_review', 'resolved'],
    default: 'none'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for faster querying
transactionSchema.index({ user: 1 });
transactionSchema.index({ listing: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

// Virtual for formatted transaction date
transactionSchema.virtual('transactionDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Pre-save hook to ensure calculations
transactionSchema.pre('save', function(next) {
  if (this.isModified('amount')) {
    this.platformFee = this.amount * 0.07;
    this.sellerPayout = this.amount - this.platformFee;
  }
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;