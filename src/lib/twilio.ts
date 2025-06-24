const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const sendAntiqueSubmissionNotification = async (
  to: string,
  antiqueDetails: {
    title: string;
    price: number;
    seller: string;
    contact: string;
    description: string;
  }
) => {
  try {
    const response = await fetch(`${API_URL}/api/send-whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        antiqueDetails
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send WhatsApp message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    throw error;
  }
}; 