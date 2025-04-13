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
  const [isRegistered, setIsRegistered] = useState(() => {
    const userData = localStorage.getItem('userData');
    return !!userData;
  });

  useEffect(() => {
    // Don't show registration modal on admin routes
    if (location.pathname.startsWith('/admin')) {
      setShowRegistration(false);
      return;
    }

    // Check if user is already registered
    if (!isRegistered) {
      console.log('User not registered, setting up timer...');
      // Show registration modal after 5 seconds
      const timer = setTimeout(() => {
        console.log('Timer completed, showing registration modal...');
        setShowRegistration(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isRegistered, location.pathname]);

  const handleRegistration = (name: string, contactNumber: string) => {
    console.log('Registering user:', { name, contactNumber });
    // Save user data to localStorage
    localStorage.setItem('userData', JSON.stringify({ name, contactNumber }));
    setIsRegistered(true);
    setShowRegistration(false);
  };

  return (
    <>
      {!location.pathname.startsWith('/admin') && (
        <UserRegistrationModal 
          isOpen={!isRegistered && showRegistration} 
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
