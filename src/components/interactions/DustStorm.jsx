import { useState } from 'react';

export default function DustStorm() {
  const [dustLevel, setDustLevel] = useState(20); // 0 to 100%
  const solarPowerPercent = Math.max(0, 100 - dustLevel);

  return (
    <div className="p-5 md:p-6 rounded-xl border border-[var(--muted)]/30 bg-[var(--surface)]/70 my-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="hud-label text-xs text-[var(--accent)]">
            Interactive Test 03B
          </span>
          <h4 className="font-display text-lg font-bold text-[var(--ink)]">
            The Planet-Wide Dust Storm
          </h4>
        </div>
        <div className="text-right font-mono">
          <span className="hud-label text-xs text-[var(--muted)] block">
            Solar Array Power
          </span>
          <span
            className={`text-lg font-bold ${
              solarPowerPercent === 0 ? 'text-red-500' : 'text-[var(--ink)]'
            }`}
          >
            {solarPowerPercent}%
          </span>
        </div>
      </div>

      <p className="text-sm text-[var(--muted)] mb-4">
        Opportunity survived for over 14 years on solar energy. Move the slider to see what happened when a planet-wide dust storm blotted out the Sun in June 2018.
      </p>

      {/* Sky & Solar Power Simulation Viewport */}
      <div className="relative h-64 md:h-72 w-full rounded-lg overflow-hidden border border-white/10 bg-[#160c08] select-none flex flex-col justify-between p-4">
        {/* Base Martian landscape (Perseverance Valley) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#b35e38] to-[#5a2818]" />

        {/* Dust storm haze layer (OPACITY ANIMATION ONLY per 10-stack.md) */}
        <div
          className="absolute inset-0 bg-[#291007] transition-opacity duration-150"
          style={{ opacity: (dustLevel / 100) * 0.95 }}
        />

        {/* Dim sun disc */}
        <div
          className="relative w-12 h-12 rounded-full bg-amber-100/90 blur-xs transition-opacity duration-150 shadow-lg"
          style={{ opacity: Math.max(0.05, 1 - dustLevel / 90) }}
        />

        {/* Solar Power Status Readout */}
        <div className="relative z-10 space-y-2 max-w-md bg-black/60 backdrop-blur-xs p-3.5 rounded border border-white/10">
          <div className="flex justify-between text-xs font-mono text-zinc-300">
            <span>TAU ATMOSPHERIC OPACITY: {(dustLevel * 0.1).toFixed(1)}</span>
            <span>SOLAR CELLS: {solarPowerPercent > 0 ? 'CHARGING' : 'OFFLINE'}</span>
          </div>

          {/* Power Bar */}
          <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                solarPowerPercent > 40
                  ? 'bg-amber-400'
                  : solarPowerPercent > 10
                  ? 'bg-orange-500'
                  : 'bg-red-600'
              }`}
              style={{ width: `${solarPowerPercent}%` }}
            />
          </div>

          {solarPowerPercent === 0 ? (
            <div className="pt-1 text-xs text-amber-200/90 font-mono leading-tight">
              <strong className="text-red-400 block mb-0.5">
                10 June 2018 (Sol 5,111): Last telemetry received.
              </strong>
              Oppy’s last message home wasn't words. It was raw data showing zero power left and a black Martian sky.
            </div>
          ) : (
            <p className="text-[11px] text-zinc-400 font-mono">
              Sunlight hits solar panels → batteries stay charged.
            </p>
          )}
        </div>
      </div>

      {/* Slider Control */}
      <div className="mt-4">
        <label htmlFor="dust-range" className="sr-only">
          Simulate dust storm density
        </label>
        <input
          id="dust-range"
          type="range"
          min="0"
          max="100"
          value={dustLevel}
          onChange={(e) => setDustLevel(Number(e.target.value))}
          aria-label="Simulate dust storm density"
          className="w-full accent-[var(--accent)] cursor-pointer h-2.5 bg-[var(--muted)]/20 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-xs font-mono text-[var(--muted)] mt-1.5">
          <span>Clear Sky (Sol 1)</span>
          <span>Planet-Wide Dust Storm (Sol 5,111)</span>
        </div>
      </div>
    </div>
  );
}
