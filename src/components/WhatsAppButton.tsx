import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = '918668945632'; // Your business WhatsApp number
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        backgroundColor: '#25D366',
        color: 'white',
        borderRadius: '50%',
        width: '56px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        textDecoration: 'none',
        fontSize: '2rem',
      }}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp />
    </a>
  );
};

export default WhatsAppButton; 