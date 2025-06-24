import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import Newsletter from './components/Newsletter';
import ContactSection from './components/ContactSection';
import Shop from './pages/Shop';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetail from './components/ProductDetail';
import Footer from './components/Footer';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import { AnimatePresence, motion } from 'framer-motion';

const AppRoutes: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <>
              <HeroSection />
              <Newsletter />
            </>
          } />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/contact" element={<ContactSection />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/shop/product/:productId" element={<ProductDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default AppRoutes; 