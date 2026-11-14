import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export let lenis = null;

export function initSmoothScroll() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null; // native scroll
  }
  lenis = new Lenis({
    lerp: 0.075,          // smoother (default 0.1 is a bit snappy)
    wheelMultiplier: 0.85, // gentler wheel sensitivity
    smoothWheel: true,
    smoothTouch: false,    // keep native on touch (cheap + correct)
    autoRaf: false,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
