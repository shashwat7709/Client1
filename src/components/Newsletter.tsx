import React from 'react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  return (
    <section className="py-24 bg-[#F5F1EA] relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-paisley-pattern opacity-5" />
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-saffron/10 rounded-full mix-blend-multiply filter blur-xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indianRed/10 rounded-full mix-blend-multiply filter blur-xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-display text-[#46392d] mb-4">
            Join Our Heritage Circle
          </h2>
          <p className="text-[#46392d]/70 mb-8 max-w-2xl mx-auto font-body text-base">
            Subscribe to receive updates about new arrivals, exclusive invitations to cultural events, and insights into Indian heritage
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full px-4 py-2.5 rounded-md bg-white border border-[#46392d]/20 text-[#46392d] placeholder-[#46392d]/50"
            />
            <button className="whitespace-nowrap px-6 py-2.5 bg-[#46392d] text-[#F5F1EA] rounded-md hover:bg-[#46392d]/90 transition-colors duration-300 font-display text-sm tracking-wide">
              Subscribe Now
            </button>
          </div>

          <p className="text-[#46392d]/60 text-sm mt-4">
            By subscribing, you agree to receive our newsletter. Your privacy is important to us.
          </p>

          {/* Social Proof with Indian Context */}
          <div className="mt-16 pt-12 border-t border-primary/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <h3 className="text-3xl font-display text-text mb-2">5000+</h3>
                <p className="text-text/70 font-body">Artisanal Products</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-display text-text mb-2">1000+</h3>
                <p className="text-text/70 font-body">Happy Families</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-display text-text mb-2">25+</h3>
                <p className="text-text/70 font-body">Indian States</p>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-display text-text mb-2">100%</h3>
                <p className="text-text/70 font-body">Authentic Heritage</p>
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -left-4 top-1/4 w-24 h-24 border-2 border-primary/20 rounded-full opacity-20" />
          <div className="absolute -right-4 bottom-1/4 w-32 h-32 border-2 border-primary/20 rounded-full opacity-20" />
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter; 