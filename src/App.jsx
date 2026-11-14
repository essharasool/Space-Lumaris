import SuitPicker from './components/SuitPicker';

export default function App() {
  return (
    <main className="min-h-screen p-8 md:p-16 flex flex-col justify-between max-w-4xl mx-auto">
      <header className="flex justify-between items-center mb-12">
        <span className="hud-label text-sm text-[var(--muted)]">Echoes in the Dust</span>
        <SuitPicker />
      </header>

      <section className="space-y-6 my-auto">
        <h1 className="text-[var(--ink)] tracking-tight">
          The Great Cosmic Relay Race
        </h1>
        <p className="max-w-[60ch] text-[var(--muted)]">
          Three quiet explorers were left across the Moon and Mars. Each ran one leg of humanity’s journey and passed the baton on to the next.
        </p>
        <div className="pt-4 flex flex-wrap gap-4 items-center">
          <button
            type="button"
            className="theme-btn px-6 py-3 font-medium transition cursor-pointer min-h-[44px]"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg)',
              borderRadius: 'var(--radius)',
            }}
          >
            Engage Helmet
          </button>
          <span className="hud-label text-xs text-[var(--muted)]">
            Testing suit colors & typography
          </span>
        </div>
      </section>

      <footer className="mt-16 pt-6 border-t border-[var(--muted)]/20 text-xs text-[var(--muted)] flex justify-between items-center">
        <span>NASA Space Apps Challenge 2026</span>
        <span className="hud-label">Systems Online</span>
      </footer>
    </main>
  );
}
