import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import SellAntiquesModal from './SellAntiquesModal';
import { useCart } from '../context/CartContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Shop', to: '/shop' },
];

const SECTION_IDS = ['home', 'about', 'contact', 'shop'];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const { getItemCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const lastScrollY = useRef(window.scrollY);
  const ticking = useRef(false);
  const location = useLocation();

  // Sticky style change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 24);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll spy (section highlight)
  useEffect(() => {
    const sectionElements = SECTION_IDS.map(id => document.getElementById(id));
    const handleScrollSpy = () => {
      let found = '';
      for (let i = 0; i < sectionElements.length; i++) {
        const el = sectionElements[i];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) {
            found = SECTION_IDS[i];
            break;
          }
        }
      }
      setActiveSection(found);
    };
    window.addEventListener('scroll', handleScrollSpy);
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <>
      <nav
        className={`bg-white fixed w-full z-50 top-0 transition-all duration-300
          ${scrolled ? 'shadow-lg bg-white/95 backdrop-blur-md' : 'shadow-none bg-white/80'}
          ${hidden ? '-translate-y-full' : 'translate-y-0'}
        `}
        style={{ willChange: 'transform, box-shadow, background' }}
      >
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
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-[#46392d] hover:text-[#5c4b3d] font-medium transition-colors relative px-2 py-1
                    ${activeSection && link.to.includes(activeSection) ? 'text-gold font-bold underline underline-offset-8' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
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
        {isOpen && (
          <div 
            className="md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out opacity-100 translate-y-0"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 py-2 text-[#46392d] hover:text-[#5c4b3d] font-medium transition-colors
                    ${activeSection && link.to.includes(activeSection) ? 'text-gold font-bold underline underline-offset-8' : ''}`}
                  onClick={() => { scrollToTop(); toggleMenu(); }}
                >
                  {link.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setIsSellModalOpen(true);
                  scrollToTop();
                  toggleMenu();
                }}
                className="block w-full text-left px-3 py-2 text-[#46392d] hover:text-[#5c4b3d] font-medium transition-colors"
              >
                Sell Your Antiques
              </button>
            </div>
          </div>
        )}
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