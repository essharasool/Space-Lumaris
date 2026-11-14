import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { missions, story } from '../data/missions';
import { live, useStore, triggerRobotAnimation, openSketchbook } from '../lib/store';
import { band, ramp, sramp } from '../lib/math';
import { splitEm } from './words';

const OPPY = missions.find((m) => m.id === 'oppy');

// when each act's big title floats in and out (story progress)
const TITLES = [
  { kicker: story.intro.kicker, title: story.headline, win: [-1, -0.5, 0.022, 0.04], place: 'is-intro' },
  ...missions.map((m, i) => ({
    kicker: m.kicker,
    title: m.headline,
    win: [[0.252, 0.268, 0.315, 0.332], [0.476, 0.49, 0.533, 0.548], [0.66, 0.672, 0.704, 0.716]][i],
    place: ['is-a', 'is-b', 'is-c'][i],
  })),
  { kicker: story.outro.kicker, title: story.outro.title, win: [0.9, 0.915, 0.985, 1.2], place: 'is-outro' },
];

// discovery hints show once the camera has "landed" at each robot
const HINT_WIN = { surveyor: [0.272, 0.415], sojourner: [0.5, 0.635], oppy: [0.69, 0.765] };

function Title({ t, reduced }) {
  const root = useRef();
  const words = useRef([]);
  const parts = splitEm(t.title);
  useEffect(() => {
    const f = () => {
      const p = live.progress;
      const [a, b, c, d] = t.win;
      const o = band(p, a, b, c, d);
      const el = root.current;
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o > 0.001 ? 'visible' : 'hidden';
      if (o < 0.001 || reduced) return;
      const u = ramp(p, a, d) - 0.5; // drift through the window
      const enter = sramp(p, a, b);
      words.current.forEach((w, i) => {
        if (!w) return;
        const y = (1 - enter) * (50 + i * 14) - u * (40 + i * 10);
        w.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
      });
    };
    gsap.ticker.add(f);
    return () => gsap.ticker.remove(f);
  }, [t, reduced]);
  return (
    <div ref={root} className={`kinetic ${t.place}`} style={{ opacity: 0 }} aria-hidden="true">
      <p className="hud-label kinetic-kicker">{t.kicker}</p>
      <p className="kinetic-title">
        {parts.map((pt, i) => (
          <span key={i} ref={(el) => (words.current[i] = el)} className={pt.em ? 'kinetic-word is-em' : 'kinetic-word'}>
            {pt.w}
          </span>
        ))}
      </p>
    </div>
  );
}

function Telemetry() {
  const el = useRef();
  useEffect(() => {
    const f = () => {
      const o = band(live.progress, 0.797, 0.806, 0.834, 0.842);
      const flicker = o > 0 ? 0.75 + Math.random() * 0.25 : 0;
      el.current.style.opacity = (o * flicker).toFixed(3);
      el.current.style.visibility = o > 0.001 ? 'visible' : 'hidden';
    };
    gsap.ticker.add(f);
    return () => gsap.ticker.remove(f);
  }, []);
  return (
    <div ref={el} className="telemetry" style={{ opacity: 0 }} aria-hidden="true">
      <span className="hud-label">{OPPY.telemetry.label}</span>
      <span className="telemetry-num">{OPPY.telemetry.sol}</span>
      <span className="telemetry-num">{OPPY.telemetry.date}</span>
    </div>
  );
}

function DiscoveryHint() {
  const act = useStore((s) => s.act);
  const el = useRef();
  const m = missions.find((x) => x.act === act);
  useEffect(() => {
    if (!m) return undefined;
    const [a, b] = HINT_WIN[m.id];
    const f = () => {
      const o = band(live.progress, a, a + 0.008, b - 0.008, b);
      el.current.style.opacity = o.toFixed(3);
      el.current.style.visibility = o > 0.001 ? 'visible' : 'hidden';
    };
    gsap.ticker.add(f);
    return () => gsap.ticker.remove(f);
  }, [m]);
  if (!m) return null;
  return (
    <div ref={el} className="discover-hint" style={{ opacity: 0 }}>
      <p className="discover-hint-text">
        <span className="discover-dot" aria-hidden="true" />
        {m.hint}
      </p>
      <div className="discover-actions">
        <button
          type="button"
          className="discover-btn"
          onClick={() => triggerRobotAnimation(m.id)}
          aria-label={`Animate ${m.title}`}
        >
          ⚡ Animate
        </button>
        <button
          type="button"
          className="discover-btn discover-btn--notes"
          onClick={() => openSketchbook(m.id)}
          aria-label={`Open ${m.title} field notes`}
        >
          📖 Field Notes
        </button>
      </div>
    </div>
  );
}

function HudStrip() {
  const act = useStore((s) => s.act);
  const mode = useStore((s) => s.mode);
  const m = missions.find((x) => x.act === act);
  const items = m ? [m.kicker.split(' · ')[0], m.date, m.place, m.coords] : act === 0 ? story.intro.hud : story.outro.hud;
  return (
    <p className={`hud-strip hud-label ${mode === 'intro' ? 'is-hidden' : ''}`} key={act}>
      {items.map((it, i) => (
        <span key={i}>{it}</span>
      ))}
    </p>
  );
}

export default function KineticTitles() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mode = useStore((s) => s.mode);
  return (
    <>
      <HudStrip />
      {TITLES.map((t, i) => (
        <div key={i} className={i === 0 && mode === 'intro' ? 'is-hidden' : ''}>
          <Title t={t} reduced={reduced} />
        </div>
      ))}
      <Telemetry />
      <DiscoveryHint />
    </>
  );
}
