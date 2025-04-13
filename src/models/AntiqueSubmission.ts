import mongoose from 'mongoose';

const antiqueSubmissionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  phone: { type: String, required: true },
  address: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  subject: { type: String, required: true },
  userId: { type: String },
  submittedAt: { 
    type: Date,
    default: Date.now
  }
});

export const AntiqueSubmission = mongoose.model('AntiqueSubmission', antiqueSubmissionSchema);

export default AntiqueSubmission; 