import { useState } from 'react';

export default function SizeRuler() {
  const [selectedItem, setSelectedItem] = useState('sojourner');

  return (
    <div className="p-5 md:p-6 rounded-xl border border-[var(--muted)]/30 bg-[var(--surface)]/70 my-6">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="hud-label text-xs text-[var(--accent)]">
            Interactive Scale 02
          </span>
          <h4 className="font-display text-lg font-bold text-[var(--ink)]">
            How Big Was Sojourner?
          </h4>
        </div>
        <span className="hud-label text-xs font-mono text-[var(--muted)]">
          MASS: 10.5 KG (23 LB)
        </span>
      </div>

      <p className="text-sm text-[var(--muted)] mb-4">
        People often imagine Mars rovers as giant monster trucks. But NASA’s first rover was no bigger than a kitchen microwave!
      </p>

      {/* Comparison Stage */}
      <div className="relative h-60 w-full bg-neutral-900/40 rounded-lg border border-[var(--muted)]/20 p-4 flex items-end justify-around overflow-hidden">
        {/* Height ruler lines */}
        <div className="absolute left-2 top-2 bottom-6 flex flex-col justify-between text-[10px] font-mono text-[var(--muted)] border-l border-[var(--muted)]/30 pl-1.5 select-none pointer-events-none">
          <span>150 cm</span>
          <span>100 cm</span>
          <span>50 cm</span>
          <span>0 cm</span>
        </div>

        {/* 1. Microwave Item */}
        <div className="flex flex-col items-center">
          <div
            className={`w-16 h-12 rounded border-2 flex items-center justify-center transition-all ${
              selectedItem === 'microwave'
                ? 'border-[var(--accent)] bg-[var(--accent)]/20 scale-105'
                : 'border-zinc-500 bg-zinc-800/60'
            }`}
          >
            <span className="text-[10px] font-mono text-zinc-300">MICROWAVE</span>
          </div>
          <span className="hud-label text-[10px] text-[var(--muted)] mt-2">~30 cm</span>
          <span className="text-xs font-medium text-[var(--ink)]">Microwave</span>
        </div>

        {/* 2. Sojourner Rover */}
        <div className="flex flex-col items-center">
          <div
            className={`w-20 h-14 rounded-md border-2 flex flex-col items-center justify-center transition-all relative ${
              selectedItem === 'sojourner'
                ? 'border-[var(--accent)] bg-[var(--accent)]/30 ring-2 ring-[var(--accent)]'
                : 'border-amber-500/80 bg-amber-500/10'
            }`}
          >
            {/* 6 wheels */}
            <div className="flex gap-1.5 absolute -bottom-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-zinc-400 border border-zinc-700" />
              ))}
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-400">SOJOURNER</span>
            <span className="text-[9px] text-zinc-400 font-mono">65 cm</span>
          </div>
          <span className="hud-label text-[10px] text-[var(--muted)] mt-3">~30 cm tall</span>
          <span className="text-xs font-bold text-[var(--accent)]">First Mars Rover</span>
        </div>

        {/* 3. Kid Silhouette */}
        <div className="flex flex-col items-center">
          <div
            className={`w-14 h-44 rounded-t-full border-2 flex items-center justify-center transition-all ${
              selectedItem === 'kid'
                ? 'border-[var(--accent)] bg-[var(--accent)]/20 scale-105'
                : 'border-blue-400/60 bg-blue-500/10'
            }`}
          >
            <span className="text-[10px] font-mono text-blue-300 -rotate-90">STUDENT</span>
          </div>
          <span className="hud-label text-[10px] text-[var(--muted)] mt-2">~135 cm</span>
          <span className="text-xs font-medium text-[var(--ink)]">You (approx)</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-2 justify-center">
        {['microwave', 'sojourner', 'kid'].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedItem(key)}
            className={`min-h-[44px] px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border ${
              selectedItem === key
                ? 'bg-[var(--accent)] text-white border-transparent'
                : 'border-[var(--muted)]/30 text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            {key === 'microwave' ? 'Microwave' : key === 'sojourner' ? 'Sojourner Rover' : 'Young Explorer'}
          </button>
        ))}
      </div>
    </div>
  );
}
