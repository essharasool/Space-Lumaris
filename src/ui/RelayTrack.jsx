import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { story } from '../data/missions';
import { live, useStore } from '../lib/store';
import { goTo } from '../lib/narrator';
import { ACT_STARTS } from '../lib/timeline';

/** thin progress track at the top with a moving baton and 5 stops you can jump to */
export default function RelayTrack() {
  const act = useStore((s) => s.act);
  const mode = useStore((s) => s.mode);
  const fill = useRef();
  const baton = useRef();
  useEffect(() => {
    const f = () => {
      const p = live.progress;
      fill.current.style.transform = `scaleX(${p.toFixed(4)})`;
      baton.current.style.transform = `translateX(${(p * 100).toFixed(3)}%)`;
    };
    gsap.ticker.add(f);
    return () => gsap.ticker.remove(f);
  }, []);
  return (
    <nav className={`relay ${mode === 'intro' ? 'is-hidden' : ''}`} aria-label="Story chapters">
      <p className="relay-brand">{story.title}</p>
      <div className="relay-track">
        <div className="relay-line" />
        <div ref={fill} className="relay-fill" />
        <div ref={baton} className="relay-baton-run">
          <span className="relay-baton" />
        </div>
        {story.stops.map((label, i) => (
          <button
            key={label}
            type="button"
            className={`relay-stop ${act === i ? 'is-active' : ''}`}
            style={{ left: `${ACT_STARTS[i] * 100}%` }}
            onClick={() => goTo(ACT_STARTS[i])}
            aria-current={act === i ? 'step' : undefined}
          >
            <span className="relay-dot" aria-hidden="true" />
            <span className="relay-label">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
