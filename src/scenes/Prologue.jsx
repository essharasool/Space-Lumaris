import { useRef } from 'react';
import { gsap } from 'gsap';
import Karaoke from '../components/Karaoke';

function DotStarfield() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
      <div
        className="w-full h-full"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 150px 80px, #ffd3b0, rgba(0,0,0,0)), radial-gradient(1px 1px at 300px 220px, #b9a3e3, rgba(0,0,0,0)), radial-gradient(1.5px 1.5px at 450px 140px, #ffffff, rgba(0,0,0,0))',
          backgroundSize: '400px 300px',
        }}
      />
    </div>
  );
}

export default function Prologue({ narration }) {
  const { isPlaying, play, currentTrack, activeLineIndex } = narration;
  const sceneRef = useRef(null);

  const handleEngage = () => {
    play();

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isReduced) {
      gsap.to('.hero-window', {
        scale: 1.05,
        opacity: 0.95,
        duration: 1.2,
        ease: 'power2.out',
      });
    }

    const surveyorEl = document.querySelector('#act-surveyor');
    if (surveyorEl) {
      setTimeout(() => {
        surveyorEl.scrollIntoView({ behavior: 'smooth' });
      }, 600);
    }
  };

  return (
    <section
      id="prologue"
      ref={sceneRef}
      className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 px-6 md:px-12 max-w-6xl mx-auto overflow-hidden"
    >
      <DotStarfield />

      {/* Hero Header */}
      <div className="max-w-3xl z-10 space-y-4">
        <span className="hud-label text-xs tracking-widest text-[var(--accent)] font-semibold">
          Prologue · Humanity's Starting Line
        </span>
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold text-[var(--ink)] tracking-tight leading-[1.05]">
          The Great Cosmic Relay Race
        </h1>
        <p className="text-lg md:text-xl text-[var(--muted)] max-w-2xl leading-relaxed">
          Three quiet explorers were left across the Moon and Mars. Each ran one leg of humanity’s journey and passed the baton on to the next.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleEngage}
            className="theme-btn min-h-[48px] px-8 py-3 rounded-full text-base font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg)',
            }}
          >
            <span>{isPlaying ? 'Helmet Engaged' : 'Engage Helmet'}</span>
            <span className="text-xs opacity-80 font-mono">▶</span>
          </button>
          <span className="hud-label text-xs text-[var(--muted)]">
            Starts voice transmission & unlocks audio
          </span>
        </div>
      </div>

      {/* Story Illustration Frame (With space left for user artwork) */}
      <div className="my-8 z-10">
        <div className="hero-window relative w-full h-72 sm:h-96 md:h-[480px] rounded-2xl overflow-hidden border border-[var(--muted)]/30 bg-[#141221] shadow-2xl flex flex-col justify-end p-4 md:p-6 transition-transform">
          {/* User Artwork Picture Frame */}
          <img
            src="/img/art/bedroom.webp"
            alt="A child seen from behind sitting at a bedroom window looking up at the Moon and Mars"
            className="absolute inset-0 w-full h-full object-cover opacity-85"
            onError={(e) => {
              // Graceful placeholder frame until user provides their artwork
              e.currentTarget.style.display = 'none';
            }}
          />

          {/* Placeholder backdrop styling if image not yet placed */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0c18] via-transparent to-transparent pointer-events-none" />

          {/* Picture-book caption per design rules */}
          <div className="relative z-10 flex flex-wrap justify-between items-end gap-2">
            <div>
              <p className="text-sm md:text-base text-white/90 font-medium">
                Looking up at the night sky, wondering if the ground out there could hold us up.
              </p>
              <span className="hud-label text-[10px] text-zinc-400 block mt-0.5">
                Illustration (AI-assisted)
              </span>
            </div>
            <span className="hud-label text-[10px] bg-black/60 text-zinc-300 px-2 py-1 rounded">
              EARTH OBSERVATION POST
            </span>
          </div>
        </div>
      </div>

      {/* Prologue Karaoke */}
      {currentTrack?.id === 'intro' && (
        <div className="z-10 max-w-3xl">
          <Karaoke track={currentTrack} activeLineIndex={activeLineIndex} />
        </div>
      )}
    </section>
  );
}
