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
    const apiKey = process.env.GUPSHUP_API_KEY;
    const url = 'https://api.gupshup.io/sm/api/v1/msg';
    const sender = '15557946085'; // Gupshup sender number, no plus
    const recipient = to.replace(/^\+/, ''); // Remove plus if present

    const message = `Hey! a new antique received\n\nName: ${antiqueDetails.seller}\nItem Title: ${antiqueDetails.title}\nDescription: ${antiqueDetails.description}\nAddress: ${antiqueDetails.address || ''}\nPhone: ${antiqueDetails.contact}\nPrice: ${antiqueDetails.price}`;

    const payload = {
      channel: 'whatsapp',
      source: sender,
      destination: recipient,
      message: message,
      type: 'text'
    };

    const formBody = Object.entries(payload)
      .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
      .join('&');

    const fetchResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'apikey': apiKey,
      },
      body: formBody,
    });
    const data = await fetchResponse.json();
    res.json(data);
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