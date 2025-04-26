import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import SellAntiquesModal from './SellAntiquesModal';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="bg-white shadow-md fixed w-full z-50 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-3xl font-serif text-[#46392d]">
                The Vintage Cottage
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-[#46392d] hover:text-[#5c4b3d] focus:outline-none"
              >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>

            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link 
                to="/" 
                className="text-[#46392d] hover:text-[#5c4b3d] font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-[#46392d] hover:text-[#5c4b3d] font-medium transition-colors"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-[#46392d] hover:text-[#5c4b3d] font-medium transition-colors"
              >
                Contact
              </Link>
              <Link 
                to="/shop" 
                className="text-[#46392d] hover:text-[#5c4b3d] font-medium transition-colors"
              >
                Shop
              </Link>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="text-[#46392d] hover:text-[#5c4b3d] font-medium transition-colors"
              >
                Sell Your Antiques
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div 
          className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
          }`}
        >
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-[#46392d] hover:text-[#5c4b3d] font-medium transition-colors"
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-[#46392d] hover:text-[#5c4b3d] font-medium transition-colors"
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 text-[#46392d] hover:text-[#5c4b3d] font-medium transition-colors"
              onClick={toggleMenu}
            >
              Contact
            </Link>
            <Link
              to="/shop"
              className="block px-3 py-2 text-[#46392d] hover:text-[#5c4b3d] font-medium transition-colors"
              onClick={toggleMenu}
            >
              Shop
            </Link>
            <button
              onClick={() => {
                setIsSellModalOpen(true);
                toggleMenu();
              }}
              className="block w-full text-left px-3 py-2 text-[#46392d] hover:text-[#5c4b3d] font-medium transition-colors"
            >
              Sell Your Antiques
            </button>
          </div>
        </div>
      </nav>

      {/* Add spacing below navbar */}
      <div className="h-20"></div>

      <SellAntiquesModal 
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
      />
    </>
  );
};

export default Navbar; 