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
        console.log('ModalWrapper: On admin route, hiding modal.'); // Debug log
        return;
      }

      try {
        console.log('ModalWrapper: Checking for existing session...'); // Debug log
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('ModalWrapper: Session found.', session.user.id); // Debug log
          console.log('ModalWrapper: Checking user_registrations table...'); // Debug log
          const { data, error: selectError } = await supabase
            .from('user_registrations')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (selectError) {
            console.error('ModalWrapper: Error fetching registration:', selectError);
          }

          if (data) {
            console.log('ModalWrapper: User registered, hiding modal.', data); // Debug log
            setShowRegistration(false);
          } else {
            console.log('ModalWrapper: User not registered, setting timeout to show modal.'); // Debug log
            // Show registration modal after 5 seconds if user hasn't registered
            const timer = setTimeout(() => {
              console.log('ModalWrapper: Timeout finished, showing modal.'); // Debug log
              setShowRegistration(true);
            }, 5000);
            return () => clearTimeout(timer);
          }
        } else {
          console.log('ModalWrapper: No session found, attempting anonymous sign-in...'); // Debug log
          // Create anonymous session if no session exists
          const { data: { session: newSession }, error: authError } = await supabase.auth.signInAnonymously();
          if (authError) {
             console.error('ModalWrapper: Anonymous sign-in error:', authError); // Debug log
             throw authError;
          }

          if (newSession) {
             console.log('ModalWrapper: Anonymous session created.', newSession.user.id); // Debug log
            // Check if this anonymous user has registered
            console.log('ModalWrapper: Checking user_registrations for new anonymous user...'); // Debug log
            const { data, error: selectError } = await supabase
              .from('user_registrations')
              .select('*')
              .eq('user_id', newSession.user.id)
              .single();
            
            if (selectError) {
              console.error('ModalWrapper: Error fetching registration for new user:', selectError); // Debug log
            }

            if (!data) {
              console.log('ModalWrapper: New anonymous user not registered, setting timeout to show modal.'); // Debug log
              // Show registration modal after 5 seconds if user hasn't registered
              const timer = setTimeout(() => {
                 console.log('ModalWrapper: Timeout finished for new user, showing modal.'); // Debug log
                setShowRegistration(true);
              }, 5000);
              return () => clearTimeout(timer);
            } else {
               console.log('ModalWrapper: New anonymous user found existing registration.', data); // Debug log
            }
          } else {
             console.log('ModalWrapper: Anonymous sign-in returned no session.'); // Debug log
          }
        }
      } catch (error) {
        console.error('ModalWrapper: General error during registration check:', error); // Debug log
      } finally {
        console.log('ModalWrapper: Finished registration check.'); // Debug log
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
