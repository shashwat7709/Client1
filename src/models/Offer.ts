import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  amount: { type: Number, required: true },
  message: { type: String },
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
  status: { 
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  userId: { type: String },
  submittedAt: { 
    type: Date,
    default: Date.now
  }
});

export const Offer = mongoose.model('Offer', offerSchema);

export default Offer; 