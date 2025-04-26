import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import Newsletter from './components/Newsletter';
import ContactSection from './components/ContactSection';
import Shop from './pages/Shop';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './components/ProductDetail';
import Footer from './components/Footer';

const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={
          <>
            <HeroSection />
            <Newsletter />
          </>
        } />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/contact" element={<ContactSection />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/product/:productId" element={<ProductDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
};

export default AppRoutes; 