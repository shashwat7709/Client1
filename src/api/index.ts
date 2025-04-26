import express from 'express';
import { Product } from '../models/Product';
import { AntiqueSubmission } from '../models/AntiqueSubmission';
import { Offer } from '../models/Offer';
import { OfferDiscount } from '../models/OfferDiscount';

const router = express.Router();

// Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get a single product
router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Create a new product
router.post('/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Update a product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

// Antique Submission routes
router.get('/submissions', async (req, res) => {
  try {
    const submissions = await AntiqueSubmission.find().sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching submissions' });
  }
});

router.post('/submissions', async (req, res) => {
  try {
    const submission = new AntiqueSubmission(req.body);
    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Error creating submission' });
  }
});

router.put('/submissions/:id', async (req, res) => {
  try {
    const submission = await AntiqueSubmission.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Error updating submission' });
  }
});

router.delete('/submissions/:id', async (req, res) => {
  try {
    await AntiqueSubmission.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting submission' });
  }
});

// Offer routes
router.get('/offers', async (req, res) => {
  try {
    const offers = await Offer.find().sort({ submittedAt: -1 });
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching offers' });
  }
});

router.post('/offers', async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating offer' });
  }
});

router.put('/offers/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating offer' });
  }
});

router.delete('/offers/:id', async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting offer' });
  }
});

// Offer Discount routes
router.get('/offers-discounts', async (req, res) => {
  try {
    const offersDiscounts = await OfferDiscount.find().sort({ createdAt: -1 });
    res.json(offersDiscounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching offers and discounts' });
  }
});

router.post('/offers-discounts', async (req, res) => {
  try {
    const offerDiscount = new OfferDiscount(req.body);
    await offerDiscount.save();
    res.status(201).json(offerDiscount);
  } catch (error) {
    res.status(500).json({ message: 'Error creating offer/discount' });
  }
});

router.put('/offers-discounts/:id', async (req, res) => {
  try {
    const offerDiscount = await OfferDiscount.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(offerDiscount);
  } catch (error) {
    res.status(500).json({ message: 'Error updating offer/discount' });
  }
});

router.delete('/offers-discounts/:id', async (req, res) => {
  try {
    await OfferDiscount.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting offer/discount' });
  }
});

export default router; 