import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/api/send-whatsapp', async (req, res) => {
  const { to, antiqueDetails } = req.body;
  const apiKey = process.env.WHATSAPP_API_KEY;
  const url = 'https://api.gupshup.io/sm/api/v1/msg';
  const sender = '7709400619'; // Replace with your Gupshup sender number

  const message = `New Antique Submission:\nName: ${antiqueDetails.seller}\nTitle: ${antiqueDetails.title}\nDescription: ${antiqueDetails.description}\nAddress: ${antiqueDetails.address}\nContact: ${antiqueDetails.contact}\nPrice: ₹${antiqueDetails.price}`;

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({
        channel: 'whatsapp',
        source: sender,
        destination: to,
        message,
        type: 'text'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'apikey': apiKey
        }
      }
    );
    res.json({ status: 'success', data: response.data });
  } catch (error) {
    res.status(500).json({ status: 'error', error: error.response?.data || error.message });
  }
});

export default router; 