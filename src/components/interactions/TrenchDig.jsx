import { useState } from 'react';

export default function TrenchDig() {
  const [depth, setDepth] = useState(0); // 0 to 100%
  const maxCm = 17.5;
  const currentCm = ((depth / 100) * maxCm).toFixed(1);

  const isFirm = depth >= 60;

  return (
    <div className="p-5 md:p-6 rounded-xl border border-[var(--muted)]/30 bg-[var(--surface)]/70 my-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="hud-label text-xs text-[var(--accent)]">
            Interactive Test 01
          </span>
          <h4 className="font-display text-lg font-bold text-[var(--ink)]">
            Dig a Trench with the Surface Scoop
          </h4>
        </div>
        <div className="text-right font-mono">
          <span className="text-xs text-[var(--muted)] block">Trench Depth</span>
          <span className="text-lg font-bold text-[var(--ink)]">{currentCm} cm</span>
        </div>
      </div>

      <p className="text-sm text-[var(--muted)] mb-4">
        Drag the scoop slider into the lunar soil to test the ground strength before Apollo lands.
      </p>

      {/* Soil Simulation Container */}
      <div className="relative h-44 w-full bg-[#353942] rounded-lg overflow-hidden border border-white/10 select-none">
        {/* Lunar Surface Sky */}
        <div className="absolute inset-x-0 top-0 h-14 bg-[#11141a] flex items-center px-4 justify-between">
          <span className="hud-label text-[10px] text-gray-400">SURVEYOR 3 ROBOTIC ARM</span>
          <span className="hud-label text-[10px] text-gray-400">SOIL RESISTANCE METER</span>
        </div>

        {/* Soil Layer */}
        <div className="absolute inset-x-0 top-14 bottom-0 bg-[#2b2e36] flex flex-col justify-between p-3">
          {/* Trench cutout */}
          <div
            className="w-1/2 mx-auto bg-[#1a1b20] border-b-2 border-amber-400/50 rounded-b transition-all duration-75 flex items-center justify-center"
            style={{ height: `${(depth / 100) * 80}px` }}
          >
            {depth > 10 && (
              <span className="hud-label text-[10px] text-amber-300">
                TRENCH EXCAVATION
              </span>
            )}
          </div>

          {/* Bearing Status */}
          <div className="flex justify-between items-center text-xs">
            <span className="hud-label text-[11px] text-gray-400">
              Depth Gauge: {currentCm} / 17.5 cm
            </span>
            {isFirm ? (
              <span className="px-2.5 py-1 rounded bg-green-900/60 text-green-300 font-mono text-xs font-bold border border-green-500/40">
                Soil is firm: safe to land! ✓
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded bg-amber-900/50 text-amber-300 font-mono text-xs">
                Dig deeper to verify strength...
              </span>
            )}
          </div>
        </div>

        {/* Scoop Visual Indicator */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-8 h-6 bg-zinc-300 border border-zinc-500 rounded-b-md shadow transition-all duration-75"
          style={{ top: `${40 + (depth / 100) * 60}px` }}
        />
      </div>

      {/* Slider Control */}
      <div className="mt-4">
        <label htmlFor="trench-slider" className="sr-only">
          Excavate Lunar Soil
        </label>
        <input
          id="trench-slider"
          type="range"
          min="0"
          max="100"
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
          className="w-full accent-[var(--accent)] cursor-pointer h-3 bg-[var(--muted)]/20 rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[11px] font-mono text-[var(--muted)] mt-1">
          <span>0 cm (Surface)</span>
          <span>17.5 cm (Full Depth)</span>
        </div>
      </div>
    </div>
  );
}
