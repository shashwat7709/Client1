import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden bg-[#F5F1EA]">
      {/* Background Image with lighter overlay */}
      <div className="absolute inset-0">
        <img 
          src="/photos/general/2021-09-26(1).png" 
          alt="Heritage Background" 
          className="object-cover w-full h-full brightness-90"
        />
        {/* Lighter overlay for better image visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-ebony/60 via-ebony/40 to-ebony/60" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 mt-0 text-center">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src="/photos/logo/2021-06-21.png" 
            alt="The Vintage Cottage Logo" 
            className="mx-auto h-64 w-auto"
          />
        </motion.div>
        <motion.h1 
          className="text-4xl md:text-6xl lg:text-7xl font-display text-gold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          The Vintage Cottage
        </motion.h1>
        <motion.p 
          className="text-lg md:text-xl text-ivory/90 max-w-2xl mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Discover timeless treasures and antique wonders in our carefully curated collection
        </motion.p>
      </div>

      {/* Decorative Corner Borders */}
      <div className="absolute top-8 left-8 w-32 h-32 border-l-2 border-t-2 border-gold/50" />
      <div className="absolute top-8 right-8 w-32 h-32 border-r-2 border-t-2 border-gold/50" />
      <div className="absolute bottom-8 left-8 w-32 h-32 border-l-2 border-b-2 border-gold/50" />
      <div className="absolute bottom-8 right-8 w-32 h-32 border-r-2 border-b-2 border-gold/50" />

      {/* Certified Authentic Badge */}
      <div className="absolute top-6 right-8 z-20">
        <div className="bg-[#46392d]/90 text-ivory px-6 py-3 rounded-lg border border-gold/20 shadow-lg backdrop-blur-sm">
          <span className="font-display text-sm uppercase tracking-wider">Certified Authentic</span>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-ivory flex flex-col items-center z-20">
        <span className="text-sm font-body mb-4 text-gold drop-shadow-lg">Scroll to Explore</span>
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-0.5 h-16 bg-gradient-to-b from-gold to-transparent"
        />
      </div>
    </section>
  );
};

export default HeroSection;
