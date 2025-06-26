import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { ParallaxProvider } from 'react-scroll-parallax';
import Lenis from '@studio-freight/lenis';
import { useEffect } from 'react';

function LenisProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      touchMultiplier: 1.5,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    (window as any).lenis = lenis; // Expose for GSAP/ScrollTrigger
    return () => {
      lenis.destroy();
      delete (window as any).lenis;
    };
  }, []);
  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <ParallaxProvider>
        <LenisProvider>
          <App />
        </LenisProvider>
      </ParallaxProvider>
    </ThemeProvider>
  </React.StrictMode>
);
