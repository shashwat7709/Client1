import express from 'express';
import twilio from 'twilio';

const router = express.Router();

// Add your non-MongoDB routes here

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
const whatsappTo = 'whatsapp:+918668945632';

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

router.post('/whatsapp-notify', async (req, res) => {
  if (!client) {
    return res.status(500).json({ message: 'Twilio client not configured' });
  }
  const { name, phone, itemTitle, description, askingPrice } = req.body;
  const message =
    `Hello! A new antique submission has been received on The Vintage Cottage.\n\n` +
    `Details:\n` +
    `- Name: ${name}\n` +
    `- Phone: ${phone}\n` +
    `- Item Title: ${itemTitle}\n` +
    `- Description: ${description}\n` +
    `- Asking Price: ₹${askingPrice}\n\n` +
    `Please check the admin dashboard for more details.`;
  try {
    await client.messages.create({
      from: whatsappFrom,
      to: whatsappTo,
      body: message,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('WhatsApp send error:', err);
    res.status(500).json({ message: 'Failed to send WhatsApp message' });
  }
});

export default router; 