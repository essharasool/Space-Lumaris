import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { credits, missions, story } from '../data/missions';
import { tracks } from '../data/narration';
import { useStore } from '../lib/store';
import { closePanel } from '../lib/narrator';

/** NASA sources, credits, AI disclosure and the full narration transcript */
export default function SourcesDrawer() {
  const open = useStore((s) => s.panel === 'sources');
  const closeBtn = useRef();
  useEffect(() => {
    if (!open) return undefined;
    closeBtn.current?.focus();
    const onKey = (e) => e.key === 'Escape' && closePanel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  if (!open) return null;
  return (
    <div className="drawer-backdrop" onClick={closePanel}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="sources-title" onClick={(e) => e.stopPropagation()} data-lenis-prevent>
        <header className="drawer-head">
          <div>
            <p className="hud-label text-(--accent)">{story.brand}</p>
            <h2 id="sources-title" className="drawer-title">
              Sources &amp; credits
            </h2>
            <p className="drawer-sub">
              {story.title}: The Cosmic Relay Race · <em>{story.category}</em>
            </p>
          </div>
          <button ref={closeBtn} type="button" className="icon-btn" onClick={closePanel} aria-label="Close sources">
            <X size={22} />
          </button>
        </header>

        {missions.map((m) => (
          <section key={m.id} className="drawer-sec">
            <h3 className="drawer-h">
              {m.title} <span className="hud-label">{m.date} · {m.place}</span>
            </h3>
            <ul className="drawer-links">
              {m.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="drawer-sec">
          <h3 className="drawer-h">3D models &amp; maps</h3>
          <ul className="drawer-links">
            {credits.assets.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="drawer-sec">
          <h3 className="drawer-h">How this was made</h3>
          <ul className="drawer-list">
            {credits.built.map((t) => (
              <li key={t}>{t}</li>
            ))}
            <li>Type: {credits.type.join(', ')}.</li>
            <li>Built with {credits.tools.join(', ')}.</li>
          </ul>
        </section>

        <section className="drawer-sec">
          <details>
            <summary className="drawer-h cursor-pointer">Read the whole story (transcript)</summary>
            {tracks.map((t) => (
              <div key={t.id} className="drawer-transcript">
                <p className="hud-label">{t.title}</p>
                <p>{t.lines.map((l) => l.text).join(' ')}</p>
              </div>
            ))}
          </details>
        </section>
      </aside>
    </div>
  );
}
