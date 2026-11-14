import { story } from '../data/missions';
import { useStore } from '../lib/store';
import { startAutopilot, startSelfPilot } from '../lib/narrator';
import { splitEm } from './words';

/** opening screen over the 3D Earth: pick Autopilot (narrated) or Self-Pilot (scroll) */
export default function Gate() {
  const mode = useStore((s) => s.mode);
  const open = mode === 'intro';
  return (
    <section className={`gate ${open ? '' : 'is-gone'}`} aria-hidden={!open} aria-labelledby="gate-title">
      <p className="hud-label gate-kicker">
        {story.brand} · {story.category}
      </p>
      <p className="gate-pre">{story.title}</p>
      <h1 id="gate-title" className="gate-title">
        {splitEm(story.headline).map((w, i) => (
          <span key={i} className={w.em ? 'is-em' : ''}>
            {w.w}{' '}
          </span>
        ))}
      </h1>
      <p className="gate-lead">{story.lead}</p>
      <div className="gate-actions">
        <button type="button" className="gate-primary" onClick={startAutopilot} tabIndex={open ? 0 : -1}>
          {story.start.autopilot} <span aria-hidden="true">▶</span>
        </button>
        <button type="button" className="gate-secondary" onClick={startSelfPilot} tabIndex={open ? 0 : -1}>
          {story.start.self}
        </button>
      </div>
      <ul className="gate-modes">
        <li>
          <strong>{story.modes.autopilot.label}:</strong> {story.modes.autopilot.hint}
        </li>
        <li>
          <strong>{story.modes.self.label}:</strong> {story.modes.self.hint}
        </li>
      </ul>
      <p className="hud-label gate-scroll">{story.start.scrollHint}</p>
    </section>
  );
}
