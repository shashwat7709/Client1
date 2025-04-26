import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F1EA] py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif text-[#46392d] mb-8 text-center">Contact Us</h1>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-serif text-[#46392d] mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-[#46392d] mb-2">Address</h3>
                  <p className="text-[#46392d]/80">
                    Shop No 1, Sai Sagar Building,<br />
                    Near Kalyan Jewellers,<br />
                    MG Road, Camp,<br />
                    Pune, Maharashtra 411001
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#46392d] mb-2">Business Hours</h3>
                  <div className="text-[#46392d]/80">
                    <p>Monday - Saturday: 10:00 AM - 7:00 PM</p>
                    <p>Sunday: By Appointment Only</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#46392d] mb-2">Contact Information</h3>
                  <div className="space-y-2 text-[#46392d]/80">
                    <p className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>+91 98220 57567</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>info@thevintagecottage.com</span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-[#46392d] mb-2">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-[#46392d] hover:text-[#46392d]/80 transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                    </a>
                    <a href="#" className="text-[#46392d] hover:text-[#46392d]/80 transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-serif text-[#46392d] mb-6">Location</h2>
              <div className="aspect-square w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.2766427580735!2d73.87210057485165!3d18.517340969148916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c142459eb605%3A0x32475ea02c5c5a8a!2sThe%20vintage%20cottage!5e0!3m2!1sen!2sin!4v1708701436099!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="mt-8 bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-serif text-[#46392d] mb-6">Send us a Message</h2>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#46392d] mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#46392d] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                  placeholder="Enter your email"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-[#46392d] mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#46392d]"
                  placeholder="Enter your message"
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#46392d] text-white rounded-md hover:bg-[#5c4b3d] transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
