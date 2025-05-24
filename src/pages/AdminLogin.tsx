import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase'; // Assuming your Supabase client is exported from here

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const { data, error } = await supabase.rpc('verify_admin_password', {
        admin_email: email,
        plain_password: password,
      });

      if (error) {
        console.error('Error calling verify_admin_password:', error);
        setError('An error occurred during login. Please try again.');
        return;
      }

      if (data === true) {
        // Store a simple indicator that the admin is logged in.
        // For a real application, you might want a more robust session management.
        localStorage.setItem('adminLoggedIn', 'true'); 
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }

    } catch (err) {
      console.error('Unexpected error during login:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F1EA] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-serif text-[#46392d] text-center mb-8">Admin Login</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-[#46392d] text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-[#46392d] text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#46392d]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#46392d] text-[#F5F1EA] py-2 px-4 rounded hover:bg-[#46392d]/90 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin; 