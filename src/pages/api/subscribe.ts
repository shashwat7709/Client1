import { NextApiRequest, NextApiResponse } from 'next';
import Subscriber from '@/lib/db/models/Subscriber';
import { connectDB } from '@/lib/db/connection';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.isVerified) {
        return res.status(400).json({ error: 'Email already subscribed' });
      } else {
        // Resend verification email
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        existingSubscriber.verificationToken = verificationToken;
        existingSubscriber.verificationExpires = verificationExpires;
        await existingSubscriber.save();

        await sendVerificationEmail(email, verificationToken);
        return res.status(200).json({ message: 'Verification email resent' });
      }
    }

    // Create new subscriber
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const subscriber = new Subscriber({
      email,
      verificationToken,
      verificationExpires,
    });

    await subscriber.save();
    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({ message: 'Please check your email to verify your subscription' });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
} 