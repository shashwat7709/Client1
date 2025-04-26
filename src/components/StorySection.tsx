import React from 'react';
import { motion } from 'framer-motion';

const StorySection = () => {
  return (
    <section id="about" className="py-24 bg-accent/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Grid */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="space-y-4">
              <img 
                src="/photos/2023-12-14 (1).jpg" 
                alt="Vintage Collection 1" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <img 
                src="/photos/2023-09-24.jpg" 
                alt="Vintage Collection 2" 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="pt-8 space-y-4">
              <img 
                src="/photos/2021-12-15 (1).jpg" 
                alt="Vintage Collection 3" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <img 
                src="/photos/2024-08-02 (1).jpg" 
                alt="Vintage Collection 4" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:pl-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-text mb-6">Our Story</h2>
            <div className="space-y-6 text-text/80">
              <p>
                Welcome to The Vintage Cottage, where every piece tells a story and every corner holds a treasure waiting to be discovered. Our journey began with a passion for preserving the elegance and craftsmanship of bygone eras.
              </p>
              <p>
                We carefully curate our collection, selecting pieces that embody the perfect blend of historical significance and timeless beauty. Each item in our collection has been thoughtfully chosen to bring character and charm to your space.
              </p>
              <p>
                Our commitment to quality and authenticity ensures that every piece we offer meets the highest standards of vintage excellence. We believe in the power of antiques to transform spaces and create connections across generations.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-6 md:gap-12">
              <div>
                <h3 className="font-serif text-xl text-text mb-2">20+</h3>
                <p className="text-text/70">Years of Experience</p>
              </div>
              <div>
                <h3 className="font-serif text-xl text-text mb-2">1000+</h3>
                <p className="text-text/70">Unique Pieces</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
