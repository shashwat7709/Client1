import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import AppRoutes from './AppRoutes';
import UserRegistrationModal from './components/UserRegistrationModal';

// Wrapper component to handle modal visibility based on route
const ModalWrapper: React.FC = () => {
  const location = useLocation();
  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    // Don't show registration modal on admin routes
    if (location.pathname.startsWith('/admin')) {
      setShowRegistration(false);
      return;
    }
    // Always show registration modal after 5 seconds
    const timer = setTimeout(() => {
      setShowRegistration(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleRegistration = () => {
    setShowRegistration(false);
  };

  return (
    <>
      {!location.pathname.startsWith('/admin') && (
        <UserRegistrationModal 
          isOpen={showRegistration} 
          onSubmit={handleRegistration} 
        />
      )}
      <Navbar />
      <AppRoutes />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <NotificationProvider>
        <ProductProvider>
          <CartProvider>
            <div className="min-h-screen bg-[#F5F1EA]">
              <ModalWrapper />
            </div>
          </CartProvider>
        </ProductProvider>
      </NotificationProvider>
    </Router>
  );
};

export default App;
