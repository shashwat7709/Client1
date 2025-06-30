import express from 'express';
import sendWhatsappRoute from './server/send-whatsapp.js';

const app = express();
app.use(express.json());
app.use(sendWhatsappRoute);

// ... existing code ...

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 