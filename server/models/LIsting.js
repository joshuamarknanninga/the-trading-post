import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String,
    enum: ['eggs', 'vegetables', 'dairy', 'meat', 'services', 'pdf', 'other'],
    required: true
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'sold', 'archived'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('Listing', listingSchema);