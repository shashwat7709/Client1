import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeroSection from './HeroSection';
import GallerySection from './GallerySection';
import Shop from './Shop';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HeroSection />} />
      <Route path="/gallery" element={<GallerySection />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/about" element={<AboutSection />} />
      <Route path="/contact" element={<ContactSection />} />
    </Routes>
  );
};

export default AppRoutes; 