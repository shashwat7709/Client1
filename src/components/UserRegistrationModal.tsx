import React, { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

interface UserRegistrationModalProps {
  isOpen: boolean;
  onSubmit: (name: string, contactNumber: string) => void;
  onClose: () => void;
}

const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({ isOpen, onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    // Check if user has already registered
    const checkRegistration = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data, error } = await supabase
            .from('user_registrations')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          if (error) {
            console.error('Error checking registration:', error);
            return;
          }
          
          if (data) {
            setHasRegistered(true);
            onSubmit(data.name, data.contact_number);
          }
        }
      } catch (err) {
        console.error('Error checking registration:', err);
      }
    };
    
    checkRegistration();
  }, []);

  if (!isOpen || hasRegistered) return null;

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

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Create anonymous session
        const { data: { session: newSession }, error: authError } = await supabase.auth.signInAnonymously();
        if (authError) throw authError;
        
        // Store registration in Supabase
        const { error: insertError } = await supabase
          .from('user_registrations')
          .insert([{ 
            user_id: newSession?.user.id,
            name: normalizedName,
            contact_number: normalizedPhone,
            registered_at: new Date().toISOString()
          }])
          .select()
          .single();
          
        if (insertError) throw insertError;
      } else {
        // Store registration for existing session
        const { error: insertError } = await supabase
          .from('user_registrations')
          .insert([{ 
            user_id: session.user.id,
            name: normalizedName,
            contact_number: normalizedPhone,
            registered_at: new Date().toISOString()
          }])
          .select()
          .single();
          
        if (insertError) throw insertError;
      }

      setHasRegistered(true);
      onSubmit(normalizedName, normalizedPhone);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Failed to save your details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
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