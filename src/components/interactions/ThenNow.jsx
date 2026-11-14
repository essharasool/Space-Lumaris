import { useState } from 'react';

export default function ThenNow({
  beforeSrc = '/img/nasa/surveyor-1967.webp',
  afterSrc = '/img/nasa/surveyor-apollo12.webp',
  beforeLabel = '1967 · Surveyor 3 Alone',
  afterLabel = '1969 · Apollo 12 Astronauts Visit',
}) {
  const [sliderPos, setSliderPos] = useState(50); // percentage

  return (
    <div className="p-5 md:p-6 rounded-xl border border-[var(--muted)]/30 bg-[var(--surface)]/70 my-6">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="hud-label text-xs text-[var(--accent)]">
            Before & After
          </span>
          <h4 className="font-display text-lg font-bold text-[var(--ink)]">
            Then & Now: 2.5 Years Later
          </h4>
        </div>
        <span className="hud-label text-xs text-[var(--muted)]">
          Drag to compare
        </span>
      </div>

      <p className="text-sm text-[var(--muted)] mb-4">
        Apollo 12 astronauts Pete Conrad and Alan Bean landed their Lunar Module within walking distance to inspect Surveyor 3.
      </p>

      {/* Comparison Frame */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-lg select-none border border-white/10 bg-neutral-900">
        {/* "After" Image (Full background) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={afterSrc}
            alt="Apollo 12 astronaut Pete Conrad next to Surveyor 3 on the Moon in 1969"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
            <span className="hud-label text-xs text-white bg-black/60 px-2 py-1 rounded w-fit">
              {afterLabel}
            </span>
          </div>
        </div>

        {/* "Before" Image (Clipped overlay) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <div className="absolute inset-0 w-full h-full min-w-full">
            <img
              src={beforeSrc}
              alt="Surveyor 3 standing alone on the Moon in 1967"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
              <span className="hud-label text-xs text-white bg-black/60 px-2 py-1 rounded w-fit">
                {beforeLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Divider Bar */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-neutral-800 text-xs font-bold">
            ↔
          </div>
        </div>
      </div>

      {/* Accessible Slider Control */}
      <div className="mt-4">
        <label htmlFor="then-now-range" className="sr-only">
          Slide comparison between 1967 and 1969
        </label>
        <input
          id="then-now-range"
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          aria-label="Compare 1967 and 1969"
          className="w-full accent-[var(--accent)] cursor-pointer h-2 bg-[var(--muted)]/20 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-xs font-mono text-[var(--muted)] mt-1.5">
          <span>← 1967 (Alone on the Moon)</span>
          <span>1969 (Human Visitors) →</span>
        </div>
      </div>
    </div>
  );
}
