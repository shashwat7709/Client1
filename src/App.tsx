import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { ProductProvider } from './context/ProductContext';
import { NotificationProvider } from './context/NotificationContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import AppRoutes from './AppRoutes';
import UserRegistrationModal from './components/UserRegistrationModal';
import { supabase } from './config/supabase';

// Wrapper component to handle modal visibility based on route
const ModalWrapper: React.FC = () => {
  const location = useLocation();
  const [showRegistration, setShowRegistration] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);

  useEffect(() => {
    const checkRegistration = async () => {
      // Don't show registration modal on admin routes
      if (location.pathname.startsWith('/admin')) {
        setShowRegistration(false);
        setIsCheckingRegistration(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data } = await supabase
            .from('user_registrations')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (data) {
            setShowRegistration(false);
          } else {
            // Show registration modal after 5 seconds if user hasn't registered
            const timer = setTimeout(() => {
              setShowRegistration(true);
            }, 5000);
            return () => clearTimeout(timer);
          }
        } else {
          // Create anonymous session if no session exists
          const { data: { session: newSession } } = await supabase.auth.signInAnonymously();
          if (newSession) {
            // Check if this anonymous user has registered
            const { data } = await supabase
              .from('user_registrations')
              .select('*')
              .eq('user_id', newSession.user.id)
              .single();
            
            if (!data) {
              // Show registration modal after 5 seconds if user hasn't registered
              const timer = setTimeout(() => {
                setShowRegistration(true);
              }, 5000);
              return () => clearTimeout(timer);
            }
          }
        }
      } catch (error) {
        console.error('Error checking registration:', error);
      } finally {
        setIsCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, [location.pathname]);

  const handleRegistration = () => {
    setShowRegistration(false);
  };

  if (isCheckingRegistration) {
    return null; // Or a loading spinner if you prefer
  }

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
