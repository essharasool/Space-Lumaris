import { useState, useRef, useEffect } from 'react';

export default function RatGrind() {
  const [grindPercent, setGrindPercent] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isHolding) {
      intervalRef.current = setInterval(() => {
        setGrindPercent((prev) => {
          if (prev >= 100) {
            clearInterval(intervalRef.current);
            return 100;
          }
          return prev + 3;
        });
      }, 50);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isHolding]);

  const handleReset = () => {
    setGrindPercent(0);
    setIsHolding(false);
  };

  return (
    <div className="p-5 md:p-6 rounded-xl border border-[var(--muted)]/30 bg-[var(--surface)]/70 my-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="hud-label text-xs text-[var(--accent)]">
            Interactive Test 03A
          </span>
          <h4 className="font-display text-lg font-bold text-[var(--ink)]">
            RAT: Rock Abrasion Tool Grind
          </h4>
        </div>
        <span className="hud-label text-xs font-mono text-[var(--muted)]">
          GRIND: {grindPercent}%
        </span>
      </div>

      <p className="text-sm text-[var(--muted)] mb-4">
        Hold the button below to press Opportunity’s diamond-tipped RAT grinder against Martian rock and reveal what’s hidden inside.
      </p>

      {/* Rock Target Viewport */}
      <div className="relative h-64 md:h-72 w-full rounded-lg overflow-hidden border border-white/10 bg-[#3a2018] select-none flex items-center justify-center">
        {/* Outer weathered rock surface */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#733522] via-[#5c2415] to-[#361309] flex flex-col items-center justify-center p-6 text-center">
          <span className="hud-label text-xs text-amber-200/80 bg-black/40 px-3 py-1 rounded">
            Martian Outcrop: Weathered Crust
          </span>
          <p className="text-xs text-amber-100/60 max-w-xs mt-2">
            The outer surface has been baked by solar radiation and dry winds for billions of years.
          </p>
        </div>

        {/* Revealed Fresh Rock & Hematite "Blueberries" (Clip-path circle) */}
        <div
          className="absolute inset-0 bg-[#1e2329] flex flex-col items-center justify-center p-6 text-center border-4 border-amber-400/80 rounded-full transition-all duration-75"
          style={{
            clipPath: `circle(${grindPercent * 0.75}% at 50% 50%)`,
          }}
        >
          {/* Simulated hematite blueberries cluster */}
          <div className="relative w-36 h-36 rounded-full bg-[#171b22] border border-blue-400/40 p-2 flex flex-wrap items-center justify-center gap-2">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-[#4a6b82] border border-cyan-300 shadow-inner"
                title="Hematite Blueberry"
              />
            ))}
          </div>

          <span className="hud-label text-xs text-cyan-300 font-bold mt-2">
            Hematite Spherules ("Blueberries") Discovered!
          </span>
          <p className="text-[11px] text-zinc-300 max-w-sm mt-1">
            These minerals only form in the presence of liquid water soaking the soil.
          </p>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onMouseDown={() => setIsHolding(true)}
          onMouseUp={() => setIsHolding(false)}
          onMouseLeave={() => setIsHolding(false)}
          onTouchStart={() => setIsHolding(true)}
          onTouchEnd={() => setIsHolding(false)}
          className="min-h-[48px] px-6 py-2.5 rounded-lg text-sm font-mono font-bold uppercase tracking-wider text-white shadow-lg cursor-pointer transition-transform active:scale-95 select-none"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          {grindPercent >= 100 ? 'Grind Complete ✓' : isHolding ? 'Grinding Rock...' : 'Press & Hold to Grind'}
        </button>

        {grindPercent > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[44px] px-3 text-xs text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
          >
            Reset Rock Surface
          </button>
        )}
      </div>
    </div>
  );
}
