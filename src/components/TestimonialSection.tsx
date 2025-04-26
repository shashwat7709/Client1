
import React from 'react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    id: 1,
    quote: "The Mughal miniature painting I acquired from Gilded Heritage has become the centerpiece of my collection. Their authentication process and detailed provenance gave me complete confidence in my purchase.",
    author: "Rajiv Mehta",
    title: "Art Collector, Mumbai"
  },
  {
    id: 2,
    quote: "As a designer specializing in heritage properties, I've found Gilded Heritage to be an invaluable resource for authentic period pieces. Their knowledge and collection are truly unmatched.",
    author: "Sarah Williams",
    title: "Interior Designer, London"
  },
  {
    id: 3,
    quote: "The antique jewelry from Gilded Heritage has an extraordinary quality that simply cannot be replicated today. Each piece tells a story of craftsmanship that has been lost to time.",
    author: "Priya Singhania",
    title: "Jewelry Connoisseur, Delhi"
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-20 bg-antique-burgundy relative overflow-hidden">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <pattern id="pattern-circles" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
            <circle id="pattern-circle" cx="10" cy="10" r="1.6257413380501518" fill="#D4AF37"></circle>
          </pattern>
          <rect id="rect" x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-4">
            Collector Testimonials
          </h2>
          <div className="w-20 h-1 bg-antique-gold mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-lg text-white/80">
            Discover what discerning collectors and connoisseurs have to say about 
            their experiences with Gilded Heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-sm border border-white/20 transition-all duration-300 hover:shadow-lg"
            >
              <svg className="text-antique-gold mb-6" width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C12 17.21 10.21 19 8 19H7C6.45 19 6 18.55 6 18V17C6 16.45 6.45 16 7 16H8C8.55 16 9 15.55 9 15V12C9 11.45 8.55 11 8 11H7C6.45 11 6 10.55 6 10V9C6 8.45 6.45 8 7 8H8C10.21 8 12 9.79 12 12V15ZM22 15C22 17.21 20.21 19 18 19H17C16.45 19 16 18.55 16 18V17C16 16.45 16.45 16 17 16H18C18.55 16 19 15.55 19 15V12C19 11.45 18.55 11 18 11H17C16.45 11 16 10.55 16 10V9C16 8.45 16.45 8 17 8H18C20.21 8 22 9.79 22 12V15Z" fill="currentColor"/>
              </svg>
              
              <p className="text-white/90 italic mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              
              <div>
                <p className="font-playfair font-bold text-antique-gold">
                  {testimonial.author}
                </p>
                <p className="text-white/70 text-sm">
                  {testimonial.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
