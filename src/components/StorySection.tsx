import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { registerLenisScrollTrigger } from '@/lib/utils';

const storyParagraphs = [
  "Welcome to The Vintage Cottage, where every piece tells a story and every corner holds a treasure waiting to be discovered. Our journey began with a passion for preserving the elegance and craftsmanship of bygone eras.",
  "We carefully curate our collection, selecting pieces that embody the perfect blend of historical significance and timeless beauty. Each item in our collection has been thoughtfully chosen to bring character and charm to your space.",
  "Our commitment to quality and authenticity ensures that every piece we offer meets the highest standards of vintage excellence. We believe in the power of antiques to transform spaces and create connections across generations."
];

const imageSources = [
  "/photos/2023-12-14 (1).jpg",
  "/photos/2023-09-24.jpg",
  "/photos/2021-12-15 (1).jpg",
  "/photos/2024-08-02 (1).jpg"
];

const StorySection = () => {
  // Refs for images
  const imgRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    registerLenisScrollTrigger();
    imgRefs.forEach((ref, i) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current,
          { scale: 1, filter: 'brightness(0.95)' },
          {
            scale: 1.08,
            filter: 'brightness(1.08)',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 80%',
              end: 'bottom 20%',
              scrub: true,
            },
            ease: 'power1.out',
            duration: 1.2,
          }
        );
      }
    });
  }, []);

  return (
    <section id="about" className="py-24 bg-accent/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Grid with GSAP zoom/pan */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                ref={imgRefs[0]}
                src={imageSources[0]}
                alt="Vintage Collection 1"
                className="w-full h-64 object-cover rounded-lg"
              />
              <img
                ref={imgRefs[1]}
                src={imageSources[1]}
                alt="Vintage Collection 2"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="pt-8 space-y-4">
              <img
                ref={imgRefs[2]}
                src={imageSources[2]}
                alt="Vintage Collection 3"
                className="w-full h-48 object-cover rounded-lg"
              />
              <img
                ref={imgRefs[3]}
                src={imageSources[3]}
                alt="Vintage Collection 4"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Content: Staggered text reveal */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.25,
                },
              },
            }}
            className="lg:pl-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif text-text mb-6">Our Story</h2>
            <div className="space-y-6 text-text/80">
              {storyParagraphs.map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.2 }}
                  viewport={{ once: true, amount: 0.7 }}
                  className="text-lg md:text-xl mb-2 fade-in-up"
                >
                  {text}
                </motion.p>
              ))}
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
