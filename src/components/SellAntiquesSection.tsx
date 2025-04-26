import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SellAntiquesSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    itemType: '',
    description: '',
    images: null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <section className="py-24 bg-[#F5F1EA] relative overflow-hidden" id="sell-antiques">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-pattern opacity-5 pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-serif text-[#46392d] mb-6">
                  Sell Your Antiques
                </h2>
                <p className="text-[#46392d]/80 text-lg leading-relaxed">
                  Have a cherished antique piece you're looking to sell? We're always interested in acquiring unique items with history and character.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[#46392d] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#F5F1EA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[#46392d] mb-2">Fair Evaluation</h3>
                    <p className="text-[#46392d]/70">Our experts will provide a fair and transparent evaluation of your antique items.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[#46392d] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#F5F1EA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[#46392d] mb-2">Competitive Pricing</h3>
                    <p className="text-[#46392d]/70">Get the best value for your antiques with our competitive pricing structure.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-full bg-[#46392d] flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#F5F1EA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-[#46392d] mb-2">Simple Process</h3>
                    <p className="text-[#46392d]/70">Easy and straightforward selling process with professional handling.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-[#46392d] font-medium mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-[#46392d] font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
                    placeholder="Your email address"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-[#46392d] font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
                    placeholder="Your phone number"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="itemType" className="block text-[#46392d] font-medium mb-2">Type of Item</label>
                  <select
                    id="itemType"
                    className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
                    required
                  >
                    <option value="">Select item type</option>
                    <option value="furniture">Furniture</option>
                    <option value="jewelry">Jewelry</option>
                    <option value="art">Art</option>
                    <option value="collectibles">Collectibles</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-[#46392d] font-medium mb-2">Description</label>
                  <textarea
                    id="description"
                    rows={4}
                    className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
                    placeholder="Please describe your item, including its condition, age, and any known history"
                    required
                  ></textarea>
                </div>

                <div>
                  <label htmlFor="images" className="block text-[#46392d] font-medium mb-2">Upload Images</label>
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    className="w-full px-4 py-2 border border-[#46392d]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]/50"
                  />
                  <p className="text-sm text-[#46392d]/60 mt-1">You can upload multiple images (max 5)</p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#46392d] text-[#F5F1EA] py-3 rounded-md hover:bg-[#46392d]/90 transition-colors duration-300"
                >
                  Submit Request
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellAntiquesSection; 