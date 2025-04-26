import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "Fashion Designer",
    image: "/photos/2023-12-14 (2).jpg",
    quote: "The collection of traditional sarees at The Heritage Emporium is absolutely stunning. Each piece tells a story of our rich cultural heritage and craftsmanship."
  },
  {
    id: 2,
    name: "Rajesh Patel",
    role: "Art Collector",
    image: "/photos/2023-09-24 (1).jpg",
    quote: "I've found some of the most exquisite Tanjore paintings here. The authenticity and quality of their artifacts are unmatched in the market."
  },
  {
    id: 3,
    name: "Meera Reddy",
    role: "Interior Stylist",
    image: "/photos/2024-08-02 (2).jpg",
    quote: "Their collection of traditional brass items and handicrafts adds the perfect touch of Indian elegance to my clients' homes. Each piece is a masterpiece."
  }
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((current) => (current + newDirection + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden" id="testimonials">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-mandala-dark opacity-5 pointer-events-none" />
      
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block">
            <h2 className="text-3xl md:text-4xl font-display text-text mb-4 relative">
              Customer Stories
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-primary/20" />
            </h2>
          </div>
          <p className="text-text/70 max-w-2xl mx-auto font-body">
            Hear from our valued customers about their experience with our heritage collection
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden relative h-[400px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);
                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute w-full"
              >
                <div className="flex flex-col md:flex-row items-center gap-8 p-8">
                  <div className="w-full md:w-1/3">
                    <div className="relative aspect-square rounded-full overflow-hidden border-4 border-primary/20">
                      <img
                        src={testimonials[current].image}
                        alt={testimonials[current].name}
                        className="w-full h-full object-cover"
                      />
                      {/* Decorative Border */}
                      <div className="absolute inset-0 border-8 border-primary/10 rounded-full" />
                    </div>
                  </div>
                  <div className="w-full md:w-2/3 text-center md:text-left">
                    <blockquote className="text-xl md:text-2xl text-text/90 italic mb-6 font-body relative">
                      <span className="absolute -left-4 -top-4 text-6xl text-primary/20">"</span>
                      {testimonials[current].quote}
                      <span className="absolute -right-4 bottom-0 text-6xl text-primary/20">"</span>
                    </blockquote>
                    <div className="font-display">
                      <cite className="not-italic font-medium text-text block">
                        {testimonials[current].name}
                      </cite>
                      <p className="text-text/70 text-sm mt-1">{testimonials[current].role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > current ? 1 : -1);
                  setCurrent(index);
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
                  index === current 
                    ? 'bg-primary border-primary scale-125' 
                    : 'bg-transparent border-primary/20 hover:border-primary'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            className="absolute top-1/2 -translate-y-1/2 -left-12 md:-left-16 w-12 h-12 rounded-full bg-background shadow-lg flex items-center justify-center text-text hover:bg-primary hover:text-text-light transition-colors duration-300 border-2 border-primary/20"
            onClick={() => paginate(-1)}
            aria-label="Previous testimonial"
          >
            ←
          </button>
          <button
            className="absolute top-1/2 -translate-y-1/2 -right-12 md:-right-16 w-12 h-12 rounded-full bg-background shadow-lg flex items-center justify-center text-text hover:bg-primary hover:text-text-light transition-colors duration-300 border-2 border-primary/20"
            onClick={() => paginate(1)}
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 