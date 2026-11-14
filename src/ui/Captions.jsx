import { Fragment, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { tracks } from '../data/narration';
import { story } from '../data/missions';
import { live, useStore } from '../lib/store';
import { norm } from './words';

/**
 * Floating karaoke captions. Words light up exactly when the narrator says them
 * (word timestamps from scripts/sync-captions.py). In Self-Pilot, scrolling scrubs the words.
 */
export default function Captions() {
  const act = useStore((s) => s.act);
  const li = useStore((s) => s.li);
  const mode = useStore((s) => s.mode);
  const box = useRef();
  const inks = useRef([]);
  const track = tracks[act];
  const line = track.lines[li];
  const emph = new Set(story.emphasis[track.id] || []);

  // a new sentence floats up word by word
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.fromTo(
        box.current.querySelectorAll('.cap-word'),
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.02 },
      );
    },
    { dependencies: [act, li], scope: box },
  );

  // per frame: mark spoken / current / upcoming words
  useEffect(() => {
    let lastIdx = -2;
    const f = () => {
      const { ti, li: l, time } = live.cap;
      if (ti !== act || l !== li) return;
      let idx = -1;
      line.words.forEach((w, i) => {
        if (time >= w.s - 0.04) idx = i;
      });
      if (time >= line.end) idx = line.words.length;
      if (idx === lastIdx) return;
      lastIdx = idx;
      inks.current.forEach((el, i) => {
        if (el) el.dataset.state = i < idx ? 'past' : i === idx ? 'now' : 'next';
      });
    };
    gsap.ticker.add(f);
    return () => gsap.ticker.remove(f);
  }, [act, li, line]);

  return (
    <div className={`captions ${mode === 'intro' ? 'is-hidden' : ''}`} data-act={act}>
      <p className="sr-only" aria-live="polite">
        {line.text}
      </p>
      <p ref={box} className="captions-line" aria-hidden="true" key={`${act}-${li}`}>
        {line.words.map((w, i) => (
          <Fragment key={i}>
          <span className="cap-word">
            <span
              ref={(el) => (inks.current[i] = el)}
              className={emph.has(norm(w.w)) ? 'cap-ink is-em' : 'cap-ink'}
              data-state="next"
            >
              {w.w}
            </span>
          </span>{' '}
          </Fragment>
        ))}
      </p>
    </div>
  );
}
