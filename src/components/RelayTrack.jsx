import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { lenis } from '../lib/smoothScroll';

const STOPS = [
  { id: 'prologue', label: 'Earth', target: '#prologue' },
  { id: 'surveyor', label: 'Moon (Surveyor)', target: '#act-surveyor' },
  { id: 'sojourner', label: 'Mars (Sojourner)', target: '#act-sojourner' },
  { id: 'opportunity', label: 'Mars (Oppy)', target: '#act-opportunity' },
  { id: 'epilogue', label: 'Your Lap', target: '#epilogue' },
];

export default function RelayTrack() {
  const barRef = useRef(null);
  const batonRef = useRef(null);
  const [activeStop, setActiveStop] = useState('prologue');

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const st = ScrollTrigger.create({
      start: 'top top',
      end: 'bottom bottom',
      scrub: isReduced ? false : 0.3,
      onUpdate: (self) => {
        if (batonRef.current) {
          const progress = self.progress * 100;
          batonRef.current.style.left = `${progress}%`;
        }

        // Determine current stop based on progress
        const stopIndex = Math.min(
          Math.floor(self.progress * STOPS.length),
          STOPS.length - 1
        );
        setActiveStop(STOPS[stopIndex].id);
      },
    });

    return () => st.kill();
  }, []);

  const handleScrollTo = (target) => {
    if (lenis) {
      lenis.scrollTo(target, { offset: -60, duration: 1.2 });
    } else {
      const el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={barRef}
      className="fixed top-0 left-0 right-0 z-40 bg-[var(--bg)]/90 backdrop-blur-md border-b border-[var(--muted)]/20 px-4 py-2.5 transition-colors"
      aria-label="Cosmic relay progress"
    >
      <div className="max-w-5xl mx-auto flex flex-col gap-1.5">
        {/* Track trackline with baton */}
        <div className="relative w-full h-1.5 bg-[var(--muted)]/20 rounded-full">
          <div
            ref={batonRef}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--accent)] border-2 border-[var(--bg)] shadow-md transition-none flex items-center justify-center"
            title="The Cosmic Baton"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>

        {/* Milestone stops */}
        <div className="flex justify-between items-center text-[10px] md:text-xs">
          {STOPS.map((stop) => {
            const isCurrent = activeStop === stop.id;
            return (
              <button
                key={stop.id}
                type="button"
                onClick={() => handleScrollTo(stop.target)}
                className={`cursor-pointer min-h-[30px] px-1 md:px-2 py-0.5 rounded font-mono uppercase tracking-wider transition-colors ${
                  isCurrent
                    ? 'text-[var(--accent)] font-bold'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {stop.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
