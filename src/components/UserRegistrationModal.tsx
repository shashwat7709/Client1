import React, { useState } from 'react';

interface UserRegistrationModalProps {
  isOpen: boolean;
  onSubmit: (name: string, contactNumber: string) => void;
}

const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({ isOpen, onSubmit }) => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!contactNumber.trim()) {
      setError('Please enter your contact number');
      return;
    }

    onSubmit(name, contactNumber);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-serif text-[#46392d] mb-6 text-center">Welcome to The Vintage Cottage</h2>
          <p className="text-[#46392d]/70 mb-6 text-center">
            Please enter your details to explore our collection
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#46392d] mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-[#46392d] mb-2">
                Contact Number *
              </label>
              <input
                type="tel"
                id="contactNumber"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                placeholder="Enter your contact number"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-[#46392d] text-white rounded-md hover:bg-[#5c4b3d] transition-colors"
            >
              Continue to Website
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegistrationModal; 