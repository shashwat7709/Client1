import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background-dark text-text-light py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <h3 className="font-serif text-xl mb-4">The Vintage Cottage</h3>
            <p className="text-text-light/70 mb-6">
              Curating timeless elegance through carefully selected vintage and antique pieces.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-text-light/70 hover:text-text-light transition-colors">
                  Our Collection
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-light/70 hover:text-text-light transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-light/70 hover:text-text-light transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-xl mb-4">Contact Us</h3>
            <ul className="space-y-2 text-text-light/70">
              <li>Address - 919, Synagogue St, Camp, Pune, Maharashtra 411001</li>
              <li>Phone: +9 86689 45632</li>
              <li>Email: vintagecottage919@yahoo.com</li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="font-serif text-xl">Follow Us</h3>
              <a
                href="https://www.instagram.com/the_vintage_cottagee/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-text-light/20 flex items-center justify-center text-text-light/70 hover:bg-primary hover:border-primary hover:text-text-light transition-all duration-300"
                aria-label="Instagram"
              >
                <span className="sr-only">Instagram</span>
                <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-text-light/10 mt-12 pt-8 text-center text-text-light/50">
          <p>&copy; {currentYear} The Vintage Cottage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
