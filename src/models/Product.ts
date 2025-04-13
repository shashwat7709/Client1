import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  subject: { type: String, required: true }
}, {
  timestamps: true
});

export const Product = mongoose.model('Product', productSchema);

export default Product; 