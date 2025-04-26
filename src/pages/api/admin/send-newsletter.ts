import { NextApiRequest, NextApiResponse } from 'next';
import Subscriber from '@/lib/db/models/Subscriber';
import { connectDB } from '@/lib/db/connection';
import { sendBulkEmail } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if user is authenticated and is admin
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.isAdmin) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await connectDB();
    const { subject, content, type, offerDetails } = req.body;

    if (!subject || !content) {
      return res.status(400).json({ error: 'Subject and content are required' });
    }

    // Get all verified subscribers
    const subscribers = await Subscriber.find({ isVerified: true });
    const subscriberEmails = subscribers.map(sub => sub.email);

    if (subscriberEmails.length === 0) {
      return res.status(400).json({ error: 'No verified subscribers found' });
    }

    // Generate email content based on type
    let htmlContent = content;
    if (type === 'offer' && offerDetails) {
      htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h1 style="color: #4A3E3E; text-align: center;">🎉 Special Offer Alert! 🎉</h1>
          
          <div style="margin: 20px 0;">
            ${content}
          </div>

          <div style="background-color: #f8f8f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #4A3E3E; margin-bottom: 15px;">Offer Details</h2>
            <p style="font-size: 18px; color: #4A3E3E;"><strong>Discount:</strong> ${offerDetails.discount}</p>
            <p style="font-size: 18px; color: #4A3E3E;"><strong>Use Code:</strong> ${offerDetails.code}</p>
            <p style="font-size: 16px; color: #666;">Valid Until: ${new Date(offerDetails.validUntil).toLocaleDateString()}</p>
          </div>

          <a href="${process.env.NEXT_PUBLIC_BASE_URL}/shop" 
             style="display: inline-block; padding: 12px 24px; background-color: #4A3E3E; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0;">
            Shop Now
          </a>

          <p style="font-size: 12px; color: #666; margin-top: 20px;">
            Terms and conditions apply. This offer is exclusive to our newsletter subscribers.
          </p>
        </div>
      `;
    } else {
      htmlContent = `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          ${content}
        </div>
      `;
    }

    // Send newsletter to all subscribers
    await sendBulkEmail({
      to: subscriberEmails,
      subject,
      html: htmlContent,
    });

    res.status(200).json({ message: 'Newsletter sent successfully' });
  } catch (error) {
    console.error('Newsletter sending error:', error);
    res.status(500).json({ error: 'Failed to send newsletter' });
  }
} 