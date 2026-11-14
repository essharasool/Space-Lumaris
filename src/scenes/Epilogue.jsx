import { useState, useRef } from 'react';
import Karaoke from '../components/Karaoke';

export default function Epilogue({ narration }) {
  const { currentTrack, activeLineIndex } = narration;
  const [explorerName, setExplorerName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(null);

  const isOutroTrack = currentTrack?.id === 'outro';

  const handleDownloadPatch = () => {
    const name = explorerName.trim() || 'COSMIC EXPLORER';
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsGenerating(true);
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 600;

    // Background circle patch
    ctx.fillStyle = '#1b1430';
    ctx.beginPath();
    ctx.arc(300, 300, 280, 0, Math.PI * 2);
    ctx.fill();

    // Outer gold border ring
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#ffd3b0';
    ctx.stroke();

    // Inner accent ring
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#f4a7b9';
    ctx.beginPath();
    ctx.arc(300, 300, 250, 0, Math.PI * 2);
    ctx.stroke();

    // Star decorations
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const x = 300 + Math.cos(angle) * 265;
      const y = 300 + Math.sin(angle) * 265;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Emblem Baton Symbol
    ctx.fillStyle = '#f4a7b9';
    ctx.beginPath();
    ctx.arc(300, 210, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffd3b0';
    ctx.fillRect(290, 220, 20, 90);

    // Text: COSMIC RELAY RUNNER
    ctx.fillStyle = '#f7eef5';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('COSMIC RELAY RACE', 300, 350);

    // Explorer Name
    ctx.fillStyle = '#ffd3b0';
    ctx.font = 'bold 36px serif';
    ctx.fillText(name.toUpperCase(), 300, 400);

    // Subtext
    ctx.fillStyle = '#bfb3cf';
    ctx.font = '16px monospace';
    ctx.fillText('NASA SPACE APPS 2026', 300, 445);
    ctx.fillText('THE BATON IS YOURS', 300, 475);

    // Trigger download
    setTimeout(() => {
      const imageURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Mission-Patch-${name.replace(/\s+/g, '-')}.png`;
      link.href = imageURL;
      link.click();
      setIsGenerating(false);
    }, 200);
  };

  return (
    <section
      id="epilogue"
      className="relative min-h-screen py-24 px-6 md:px-12 max-w-5xl mx-auto border-t border-[var(--muted)]/20"
    >
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <span className="hud-label text-xs text-[var(--accent)] tracking-widest font-bold">
          Epilogue · The Baton Never Stops
        </span>
        <h2 className="text-4xl sm:text-6xl font-display font-bold text-[var(--ink)]">
          The Race Isn’t Over. It’s Your Turn.
        </h2>
        <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed">
          On 11 October 2026, NASA’s Perseverance rover officially passed Opportunity’s historic driving record on Mars (45.22 km). The relay race didn’t end in the dust — each machine passed the torch forward. Now, the next runner is you.
        </p>
      </div>

      {/* Epilogue Picture Frame (With space left for user artwork) */}
      <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-[var(--muted)]/30 bg-[#161224] shadow-xl mb-12 flex flex-col justify-end p-6">
        <img
          src="/img/art/epilogue.webp"
          alt="A child seen from behind wearing an astronaut helmet, standing on a hill at night pointing at the stars"
          className="absolute inset-0 w-full h-full object-cover opacity-85"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex justify-between items-end">
          <div>
            <p className="text-sm md:text-base text-white/95 font-medium">
              Ready for the next lap across the solar system.
            </p>
            <span className="hud-label text-[10px] text-zinc-400">
              Illustration (AI-assisted)
            </span>
          </div>
          <span className="hud-label text-[10px] bg-white/20 text-white px-2 py-1 rounded">
            FUTURE RUNNER
          </span>
        </div>
      </div>

      {/* Outro Karaoke */}
      {isOutroTrack && (
        <div className="max-w-3xl mx-auto mb-12">
          <Karaoke track={currentTrack} activeLineIndex={activeLineIndex} />
        </div>
      )}

      {/* Interactive Personalized Mission Patch Generator */}
      <div className="p-8 rounded-2xl border-2 border-[var(--accent)]/50 bg-[var(--surface)] max-w-2xl mx-auto text-center space-y-6 shadow-xl">
        <div>
          <span className="hud-label text-xs text-[var(--accent)] font-bold">
            NASA Space Apps Challenge 2026
          </span>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-[var(--ink)] mt-1">
            Claim Your Official Mission Patch
          </h3>
          <p className="text-sm text-[var(--muted)] mt-1">
            Type your explorer name below to stamp your digital mission patch. (Saved directly to your device; no data is ever sent anywhere.)
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <label htmlFor="explorer-name" className="sr-only">
            Explorer Name
          </label>
          <input
            id="explorer-name"
            type="text"
            placeholder="Enter Explorer Name..."
            value={explorerName}
            onChange={(e) => setExplorerName(e.target.value)}
            maxLength={24}
            className="w-full sm:w-72 px-4 py-3 rounded-lg border border-[var(--muted)]/40 bg-[var(--bg)] text-[var(--ink)] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
          />

          <button
            type="button"
            onClick={handleDownloadPatch}
            disabled={isGenerating}
            className="theme-btn w-full sm:w-auto min-h-[46px] px-6 py-3 rounded-lg font-bold text-sm tracking-wide shadow-md transition-transform active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg)',
            }}
          >
            {isGenerating ? 'Stamping...' : 'Download My Patch 🚀'}
          </button>
        </div>

        {/* Hidden Canvas for Generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </section>
  );
}
