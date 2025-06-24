import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function registerLenisScrollTrigger() {
  const lenis = (window as any).lenis;
  if (!lenis) return;
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      return arguments.length ? lenis.scrollTo(value) : lenis.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
  });
  ScrollTrigger.addEventListener('refresh', () => lenis.update());
  ScrollTrigger.refresh();
}
