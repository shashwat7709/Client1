import express from 'express';
import twilio from 'twilio';

const router = express.Router();

// Add your non-MongoDB routes here

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
const whatsappTo = 'whatsapp:+918668945632';

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

export default router; 