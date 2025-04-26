import React from 'react';
import { motion } from 'framer-motion';

const AboutSection: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F1EA] py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif text-[#46392d] mb-8 text-center">About The Vintage Cottage</h1>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-serif text-[#46392d] mb-4">Our Story</h2>
            <p className="text-[#46392d]/80 leading-relaxed mb-6">
              The Vintage Cottage is Pune's premier destination for exquisite antiques and vintage collectibles. 
              Established with a passion for preserving history and beauty, we curate a unique collection of timeless pieces 
              that tell stories of the past while adding elegance to modern spaces.
            </p>
            <p className="text-[#46392d]/80 leading-relaxed">
              Our carefully selected inventory includes vintage furniture, crystal & glass pieces, decorative accents, 
              lighting fixtures, mirrors, tableware, wall art, antique books, and garden accessories. Each item in our 
              collection is chosen for its historical significance, craftsmanship, and aesthetic appeal.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-serif text-[#46392d] mb-4">Our Mission</h2>
            <p className="text-[#46392d]/80 leading-relaxed">
              We are dedicated to:
            </p>
            <ul className="list-disc list-inside text-[#46392d]/80 leading-relaxed space-y-2 mt-4">
              <li>Preserving and sharing the beauty of antique craftsmanship</li>
              <li>Helping our clients find unique pieces that tell their own stories</li>
              <li>Supporting sustainable decorating through the reuse of quality vintage items</li>
              <li>Building a community of antique enthusiasts and collectors</li>
              <li>Providing expert guidance and authentication for vintage pieces</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-serif text-[#46392d] mb-4">Visit Us</h2>
            <p className="text-[#46392d]/80 leading-relaxed mb-4">
              Experience our collection in person at our charming location in Pune. Our knowledgeable staff is ready to 
              assist you in finding the perfect piece for your space.
            </p>
            <div className="text-[#46392d]/80">
              <p className="font-medium">Business Hours:</p>
              <p>Monday - Saturday: 10:00 AM - 7:00 PM</p>
              <p>Sunday: By Appointment Only</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-serif text-[#46392d] mb-4">Services</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#46392d]/80">
              <li className="flex items-start space-x-2">
                <svg className="w-6 h-6 text-[#46392d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Expert Authentication</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-6 h-6 text-[#46392d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Restoration Services</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-6 h-6 text-[#46392d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Antique Appraisals</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg className="w-6 h-6 text-[#46392d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Custom Sourcing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection; 