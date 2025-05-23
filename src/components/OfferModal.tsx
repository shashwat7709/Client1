import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { useNotifications } from '../context/NotificationContext';
import { supabase } from '../config/supabase'; // Assuming your Supabase client is exported from here

interface OfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    description: string;
  } | null;
}

const OfferModal: React.FC<OfferModalProps> = ({ isOpen, onClose, product }) => {
  const { addOffer } = useProducts();
  const { addNotification } = useNotifications();
  const [offerAmount, setOfferAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [contactNumber, setContactNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(offerAmount);
    if (isNaN(amount) || amount <= 0) {
      addNotification('Please enter a valid offer amount', 'error', false);
      return;
    }

    if (!name.trim()) {
      addNotification('Please enter your name', 'error', false);
      return;
    }

    if (!contactNumber.trim()) {
      addNotification('Please enter your contact number', 'error', false);
      return;
    }

    if (!email.trim()) {
      addNotification('Please enter your email', 'error', false);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      addNotification('Please enter a valid email address', 'error', false);
      return;
    }

    if (!product) { // Should not happen due to the check at the beginning, but good for type safety
      addNotification('Product details missing.', 'error', false);
      return;
    }

    // Prepare data for Supabase insertion
    const offerData = {
      product_id: product.id,
      name: name,
      contact_number: contactNumber,
      email: email,
      offer_amount: amount,
      product_price: product.price,
      message: message,
      image: product.images && product.images.length > 0 ? product.images[0] : null,
    };

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('user_offer')
      .insert([offerData]);

    if (error) {
      console.error('Error submitting offer:', error);
      addNotification('Failed to submit offer. Please try again.', 'error', false);
    } else {
    addNotification('Your offer has been submitted successfully!', 'success', false);
      // Clear form fields after successful submission
    setOfferAmount('');
    setMessage('');
    setName('');
    setContactNumber('');
      setEmail('');
    onClose();
    }

  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-serif text-[#46392d]">Make Your Offer</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-6 mb-6">
            <div className="w-1/3">
              <img
                src={product.images[0] || '/placeholder-image.jpg'}
                alt={product.title}
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
            <div className="w-2/3">
              <h3 className="text-xl font-serif text-[#46392d] mb-2">{product.title}</h3>
              <p className="text-[#46392d]/70 mb-4">{product.description}</p>
              <p className="text-lg font-medium text-[#46392d]">
                Original Price: <span className="text-xl">₹{product.price}</span>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#46392d] mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-[#46392d] mb-2">
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                  placeholder="Enter your contact number"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#46392d] mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="offerAmount" className="block text-sm font-medium text-[#46392d] mb-2">
                Your Offer Amount ($)
              </label>
              <input
                type="number"
                id="offerAmount"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                min="0"
                step="0.01"
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                placeholder="Enter your offer amount"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[#46392d] mb-2">
                Message (Optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                placeholder="Add a message to the seller..."
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[#46392d] border border-[#46392d] rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#46392d] text-white rounded-md hover:bg-[#5c4b3d] transition-colors"
              >
                Submit Offer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfferModal; 