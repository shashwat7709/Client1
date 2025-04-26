import React from 'react';
import { FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

interface ContactOwnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
}

const ContactOwnerModal: React.FC<ContactOwnerModalProps> = ({ isOpen, onClose, productTitle }) => {
  if (!isOpen) return null;

  // Owner's contact information
  const ownerInfo = {
    name: "The Vintage Cottage",
    phone: "+91 7709400619",
    email: "thevintagecottage@gmail.com",
    whatsapp: "+91 7709400619"
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-serif text-[#46392d] mb-2">Contact the Owner</h2>
          <p className="text-[#46392d]/70 mb-6">
            Interested in "{productTitle}"? Here's how you can reach us:
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-serif text-[#46392d] mb-2">{ownerInfo.name}</h3>
            </div>

            <div className="space-y-4">
              <a 
                href={`tel:${ownerInfo.phone}`}
                className="flex items-center gap-3 text-[#46392d] hover:text-[#5c4b3d] transition-colors"
              >
                <FaPhone className="w-5 h-5" />
                <span>{ownerInfo.phone}</span>
              </a>

              <a 
                href={`https://wa.me/${ownerInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#46392d] hover:text-[#5c4b3d] transition-colors"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>Message on WhatsApp</span>
              </a>

              <a 
                href={`mailto:${ownerInfo.email}`}
                className="flex items-center gap-3 text-[#46392d] hover:text-[#5c4b3d] transition-colors"
              >
                <FaEnvelope className="w-5 h-5" />
                <span>{ownerInfo.email}</span>
              </a>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#46392d] text-white rounded-md hover:bg-[#5c4b3d] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactOwnerModal; 