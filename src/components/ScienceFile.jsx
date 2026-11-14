import { useState } from 'react';
import { ExternalLink, Check } from 'lucide-react';

export default function ScienceFile({ file, missionTitle }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFiled, setIsFiled] = useState(false);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setTimeout(() => setIsFiled(true), 400);
    }
  };

  if (!file) return null;

  return (
    <div
      className="my-8 border-2 border-dashed border-[var(--muted)]/40 p-5 sm:p-6 transition-all relative overflow-hidden"
      style={{
        borderRadius: 'var(--radius)',
        backgroundColor: 'var(--surface)',
      }}
    >
      {/* Top ticket header */}
      <div className="flex items-center justify-between gap-4 border-b border-[var(--muted)]/20 pb-4">
        <div>
          <span className="hud-label text-xs text-[var(--accent)] block">
            CONFIDENTIAL SCIENCE DISPATCH
          </span>
          <h4 className="text-lg md:text-xl font-bold font-display text-[var(--ink)] mt-0.5">
            {missionTitle}: Secret Science File
          </h4>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className="min-h-[44px] px-4 py-2 text-xs font-mono font-bold tracking-wider uppercase border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--bg)] transition-colors cursor-pointer"
          style={{ borderRadius: 'var(--radius)' }}
          aria-expanded={isOpen}
        >
          {isOpen ? 'Close File' : 'Examine File'}
        </button>
      </div>

      {/* Ticket summary teaser */}
      <p className="text-sm md:text-base font-medium text-[var(--ink)] mt-3">
        {file.headline}
      </p>

      {/* Expandable details & verified sources */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-[var(--muted)]/20 space-y-4 animate-fadeIn">
          <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed">
            {file.text}
          </p>

          <div>
            <span className="hud-label text-[11px] text-[var(--muted)] block mb-2">
              Official NASA Sources
            </span>
            <ul className="space-y-1.5">
              {file.sources.map((src, idx) => (
                <li key={idx}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline font-mono"
                  >
                    <span>{src.label}</span>
                    <ExternalLink size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Tactile FILED stamp */}
          {isFiled && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 border-2 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 font-mono font-bold text-xs uppercase tracking-widest rotate-[-3deg] shadow-sm select-none">
              <Check size={14} />
              <span>FILED ✓</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
