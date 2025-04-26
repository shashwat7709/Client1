import { NextApiRequest, NextApiResponse } from 'next';
import Subscriber from '@/lib/db/models/Subscriber';
import { connectDB } from '@/lib/db/connection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    const subscriber = await Subscriber.findOne({
      verificationToken: token,
      verificationExpires: { $gt: new Date() },
      isVerified: false,
    });

    if (!subscriber) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    subscriber.isVerified = true;
    subscriber.verificationToken = undefined;
    subscriber.verificationExpires = undefined;
    await subscriber.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
} 