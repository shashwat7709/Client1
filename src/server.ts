import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import dotenv from 'dotenv';
import apiRoutes from './api';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// Routes
app.use('/api', apiRoutes);

app.post('/api/send-whatsapp', async (req, res) => {
  try {
    const { to, antiqueDetails } = req.body;
    
    const message = `🏺 New Antique Submission!\n\n` +
      `Item: ${antiqueDetails.title}\n` +
      `Price: ₹${antiqueDetails.price}\n` +
      `Seller: ${antiqueDetails.seller}\n` +
      `Contact: ${antiqueDetails.contact}\n\n` +
      `Description: ${antiqueDetails.description.substring(0, 100)}${antiqueDetails.description.length > 100 ? '...' : ''}`;

    const response = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:+${to}`
    });

    res.json({ success: true, messageId: response.sid });
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 