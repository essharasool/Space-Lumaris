import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

export default function Karaoke({ track, activeLineIndex }) {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const activeEl = containerRef.current.querySelector('.karaoke-active');
    if (!activeEl) return;

    try {
      const split = new SplitText(activeEl, { type: 'words' });
      gsap.fromTo(
        split.words,
        { opacity: 0.25, y: 3 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.04,
          duration: 0.35,
          ease: 'power1.out',
          overwrite: 'auto',
          onComplete: () => split.revert(),
        }
      );
    } catch {
      // Graceful fallback if SplitText can't initialize
      gsap.fromTo(activeEl, { opacity: 0.4 }, { opacity: 1, duration: 0.3 });
    }
  }, { scope: containerRef, dependencies: [activeLineIndex, track?.id] });

  if (!track || !track.lines) return null;

  return (
    <div
      ref={containerRef}
      className="space-y-3 p-4 sm:p-6 rounded-xl border border-[var(--muted)]/20 bg-[var(--surface)]/60 my-6 transition-all"
      aria-live="polite"
      aria-label="Narration captions"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
        <span className="hud-label text-xs text-[var(--accent)]">
          Voice of the Cosmic Relay
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        {track.lines.map((line, idx) => {
          const isActive = idx === activeLineIndex;
          const isPast = idx < activeLineIndex;

          return (
            <p
              key={`${track.id}-${idx}`}
              className={`transition-colors duration-300 leading-relaxed ${
                isActive
                  ? 'karaoke-active text-[var(--ink)] font-medium text-lg md:text-xl'
                  : isPast
                  ? 'text-[var(--muted)]/50 text-base md:text-lg line-through-none'
                  : 'text-[var(--muted)]/30 text-base md:text-lg'
              }`}
            >
              {line.text}
            </p>
          );
        })}
      </div>
    </div>
  );
}
