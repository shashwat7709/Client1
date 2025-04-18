import mongoose from 'mongoose';

const offerDiscountSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdAt: { 
    type: Date,
    default: Date.now
  }
});

export const OfferDiscount = mongoose.model('OfferDiscount', offerDiscountSchema);

export default OfferDiscount; 