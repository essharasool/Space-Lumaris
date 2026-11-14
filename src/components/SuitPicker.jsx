import { useEffect, useState } from 'react';

const SUITS = [
  { id: 'stardust', label: 'Stardust', color: '#F4A7B9' },
  { id: 'rocketeer', label: 'Rocketeer', color: '#FF6B1A' },
  { id: 'daylight', label: 'Daylight', color: '#3D7BC4' },
];

export function getInitialSuit() {
  if (typeof window === 'undefined') return 'stardust';
  const saved = localStorage.getItem('suit');
  if (saved && ['stardust', 'rocketeer', 'daylight'].includes(saved)) {
    return saved;
  }
  const isLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  return isLight ? 'daylight' : 'stardust';
}

export default function SuitPicker() {
  const [activeSuit, setActiveSuit] = useState(getInitialSuit);

  useEffect(() => {
    document.documentElement.setAttribute('data-suit', activeSuit);
    try {
      localStorage.setItem('suit', activeSuit);
    } catch {
      // storage unavailable
    }
  }, [activeSuit]);

  return (
    <div
      className="inline-flex items-center gap-2 p-1.5 rounded-full border border-[var(--muted)]/30 bg-[var(--surface)] shadow-sm"
      role="radiogroup"
      aria-label="Pick your Explorer Suit"
    >
      <span className="hud-label px-2 text-xs text-[var(--muted)]">Suit</span>
      {SUITS.map((suit) => {
        const isSelected = activeSuit === suit.id;
        return (
          <button
            key={suit.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => setActiveSuit(suit.id)}
            className={`min-w-[44px] min-h-[44px] w-10 h-10 rounded-full flex items-center justify-center transition-transform cursor-pointer relative ${
              isSelected ? 'ring-2 ring-[var(--ink)] scale-105' : 'opacity-80 hover:opacity-100 hover:scale-100'
            }`}
            style={{ backgroundColor: suit.color }}
            title={suit.label}
            aria-label={`${suit.label} Suit`}
          >
            {isSelected && (
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--ink)] block" />
            )}
          </button>
        );
      })}
    </div>
  );
}
