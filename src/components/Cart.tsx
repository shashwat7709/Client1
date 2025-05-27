// Deprecated: Use CartPage instead for the full cart experience.
// This component is no longer used as a modal/drawer.
// You may safely remove this file if not needed elsewhere.

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can integrate Razorpay
    console.log('Form submitted:', formData);
    setShowCheckoutForm(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-[#46392d]">Your Cart</h2>
          <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowCheckoutForm(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 bg-white rounded-lg shadow p-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-[#46392d]">{item.title}</h3>
                    <p className="text-[#46392d] font-bold">₹{item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-500 hover:text-[#46392d]"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-500 hover:text-[#46392d]"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-[#46392d]">Total:</span>
              <span className="text-2xl font-bold text-[#46392d]">
                ₹{getCartTotal().toFixed(2)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={clearCart}
                className="px-4 py-2 text-[#46392d] border border-[#46392d] rounded-md hover:bg-gray-100 transition-colors"
              >
                Clear Cart
              </button>
              <button
                onClick={() => setShowCheckoutForm(true)}
                className="px-4 py-2 bg-[#46392d] text-white rounded-md hover:bg-[#5c4b3d] transition-colors"
              >
                Checkout
              </button>
            </div>
          </div>
        )}

        {showCheckoutForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Checkout</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">ZIP</label>
                  <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowCheckoutForm(false)} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#46392d] text-white rounded-md hover:bg-[#5c4b3d] transition-colors">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 