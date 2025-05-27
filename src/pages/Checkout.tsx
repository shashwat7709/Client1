import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Surat', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara'
];

const Checkout: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Integrate Razorpay or further logic here
    console.log('Form submitted:', formData);
    navigate('/order-success');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F1EA] py-12">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#46392d]">Checkout</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#46392d] focus:border-[#46392d]" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#46392d] focus:border-[#46392d]" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#46392d] focus:border-[#46392d]" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <select name="city" value={formData.city} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#46392d] focus:border-[#46392d]" required>
                <option value="">Select City</option>
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              <select name="state" value={formData.state} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#46392d] focus:border-[#46392d]" required>
                <option value="">Select State</option>
                {STATES.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP</label>
              <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#46392d] focus:border-[#46392d]" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-[#46392d] focus:border-[#46392d]" required />
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={() => navigate('/cart')} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-[#46392d] text-white rounded-md hover:bg-[#5c4b3d] transition-colors font-semibold">Continue</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout; 