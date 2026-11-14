import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { X } from 'lucide-react';
import { missions, story } from '../data/missions';
import { setState, useStore } from '../lib/store';
import { playStampSound } from '../lib/sounds';

/** "Explorer Sketchbook" page — slides up from the bottom without blocking the full 3D view */
export default function Sketchbook() {
  const id = useStore((s) => s.card);
  const m = missions.find((x) => x.id === id);
  const wrap = useRef();
  const card = useRef();
  const art = useRef();
  const closeBtn = useRef();
  const close = () => setState({ card: null });

  useGSAP(
    () => {
      if (!m) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set(wrap.current, { opacity: 1, y: 0 });
        return;
      }
      // slide up from below
      gsap.fromTo(
        wrap.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
      );
      gsap.fromTo(art.current, { scale: 0.6, rotate: 10, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.75, delay: 0.12, ease: 'back.out(1.6)' });
      gsap.fromTo('.sketch-fact', { opacity: 0, x: -14 }, { opacity: 1, x: 0, stagger: 0.07, delay: 0.25, duration: 0.45, ease: 'power2.out' });
      gsap.fromTo(
        '.sketch-stamp',
        { scale: 2.0, opacity: 0 },
        { scale: 1, opacity: 1, delay: 0.6, duration: 0.3, ease: 'power3.in', onStart: () => playStampSound() },
      );
    },
    { dependencies: [id], scope: wrap },
  );

  useEffect(() => {
    if (!m) return undefined;
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e) => e.key === 'Escape' && setState({ card: null });
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [m]);

  if (!m) return null;

  // parallax tilt on mouse hover
  const onMove = (e) => {
    const r = card.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(art.current, { rotateY: x * 18, rotateX: -y * 14, x: x * 12, y: y * 8, duration: 0.5, ease: 'power2.out' });
  };
  const onLeave = () => gsap.to(art.current, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 0.6 });

  return (
    <aside ref={wrap} className="sketch-wrap" aria-label={`${m.title} sketchbook page`}>
      <div ref={card} className="sketch" onPointerMove={onMove} onPointerLeave={onLeave} data-lenis-prevent>
        <span className="sketch-tape sketch-tape--l" aria-hidden="true" />
        <span className="sketch-tape sketch-tape--r" aria-hidden="true" />
        <button ref={closeBtn} type="button" className="sketch-close" onClick={close} aria-label="Close sketchbook page">
          <X size={20} />
        </button>
        <p className="hud-label sketch-kicker">Explorer sketchbook · {m.kicker.split(' · ')[0]}</p>
        <h2 className="sketch-title">
          {m.title}
          <em> {m.nickname}</em>
        </h2>
        <figure className="sketch-figure">
          <div className="sketch-art-stage">
            <img ref={art} src={m.sketch.image} alt={m.sketch.alt} width="432" height="577" decoding="async" className="sketch-art" />
          </div>
          <figcaption className="sketch-ai">{story.aiLabel}</figcaption>
        </figure>
        <p className="sketch-stamp">{m.sketch.badge}</p>
        <ul className="sketch-facts">
          {m.sketch.facts.map((f) => (
            <li key={f} className="sketch-fact">
              {f}
            </li>
          ))}
        </ul>
        {m.sketch.note && <p className="sketch-note">{m.sketch.note}</p>}
        <p className="sketch-meta hud-label">
          {m.date} · {m.place} · {m.coords}
        </p>
      </div>
    </aside>
  );
}
