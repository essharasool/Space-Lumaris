import { BookOpen, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { story } from '../data/missions';
import { useStore } from '../lib/store';
import { openPanel, startAutopilot, startSelfPilot, toggleMute, togglePlay } from '../lib/narrator';

/** bottom control pill: Autopilot / Self-Pilot switch + play, mute, sources (the one glass element) */
export default function Dock() {
  const mode = useStore((s) => s.mode);
  const playing = useStore((s) => s.playing);
  const muted = useStore((s) => s.muted);
  const act = useStore((s) => s.act);
  const unlocked = useStore((s) => s.unlocked);
  const blocked = useStore((s) => s.audioBlocked);
  if (mode === 'intro') return null;

  const showSoundHint = (mode === 'self' && !unlocked) || blocked;

  return (
    <div className="dock-wrap">
      {showSoundHint && <p className="sound-hint">{story.tapForSound}</p>}
      {mode === 'self' && (
        <button type="button" className="autopilot-hint" onClick={startAutopilot}>
          {story.switchToAutopilot} <span aria-hidden="true">▶</span>
        </button>
      )}
      <div className="dock glass" role="toolbar" aria-label="Story controls">
        <div className="mode-pill" role="radiogroup" aria-label="How do you want to fly?">
          <button type="button" role="radio" aria-checked={mode === 'autopilot'} onClick={mode === 'autopilot' ? undefined : startAutopilot}>
            {story.modes.autopilot.label}
          </button>
          <button type="button" role="radio" aria-checked={mode === 'self'} onClick={mode === 'self' ? undefined : startSelfPilot}>
            {story.modes.self.label}
          </button>
        </div>
        <button type="button" className={showSoundHint ? "dock-btn is-calling" : "dock-btn"} onClick={togglePlay} aria-label={playing ? 'Pause the narrator' : 'Play the narrator'}>
          {playing ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button type="button" className="dock-btn" onClick={toggleMute} aria-label={muted ? 'Turn sound on' : 'Turn sound off'}>
          {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <button type="button" className="dock-btn dock-btn--text" onClick={() => openPanel('sources')}>
          <BookOpen size={18} aria-hidden="true" />
          <span className="max-sm:sr-only">Sources</span>
        </button>
        {act === 4 && (
          <button type="button" className="dock-btn dock-btn--accent" onClick={() => openPanel('badge')}>
            Pass the baton
          </button>
        )}
      </div>
    </div>
  );
}
