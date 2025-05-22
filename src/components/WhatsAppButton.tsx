import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = '918668945632'; // Replace with your number
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappLink}
      className="fixed bottom-6 right-6 bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 z-50 flex items-center justify-center"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-6 h-6" />
    </a>
  );
};

export default WhatsAppButton; 