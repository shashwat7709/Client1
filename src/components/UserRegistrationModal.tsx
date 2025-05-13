import React, { useState } from 'react';
import { supabase } from '../config/supabase';

interface UserRegistrationModalProps {
  isOpen: boolean;
  onSubmit: (name: string, contactNumber: string) => void;
}

const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({ isOpen, onSubmit }) => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedName = name.trim().toLowerCase();
    const normalizedPhone = contactNumber.trim();

    if (!normalizedName) {
      setError('Please enter your name');
      return;
    }

    if (!normalizedPhone) {
      setError('Please enter your contact number');
      return;
    }

    setLoading(true);
    setError('');
    // Fetch all matching records (normalized)
    const { data: existing, error: fetchError } = await supabase
      .from('site_visitors')
      .select('id')
      .eq('name', normalizedName)
      .eq('phone', normalizedPhone);
    if (fetchError) {
      setLoading(false);
      setError('Failed to check your details. Please try again.');
      return;
    }
    if (existing && existing.length > 0) {
      setLoading(false);
      setError('Thank you for registering.');
      setTimeout(() => {
        setError('');
        onSubmit(normalizedName, normalizedPhone);
      }, 2000);
      return;
    }
    // Insert into Supabase if not found (normalized)
    const { error: supabaseError } = await supabase
      .from('site_visitors')
      .insert([{ name: normalizedName, phone: normalizedPhone }]);
    setLoading(false);
    if (supabaseError) {
      if (
        supabaseError.code === '23505' || // Postgres unique violation
        (supabaseError.message && supabaseError.message.includes('duplicate key'))
      ) {
        setError('Thank you for registering.');
        setTimeout(() => {
          setError('');
          onSubmit(normalizedName, normalizedPhone);
        }, 2000);
        return;
      }
      setError('Failed to save your details. Please try again.');
      return;
    }
    onSubmit(normalizedName, normalizedPhone);
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
              <div className={`px-4 py-3 rounded ${error === 'Thank you for registering.' ? 'bg-green-100 border border-green-400 text-green-700' : 'bg-red-100 border border-red-400 text-red-700'}`}>
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
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Continue to Website'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRegistrationModal; 