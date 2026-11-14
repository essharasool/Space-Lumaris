import { Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';

function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function AudioDock({ narration }) {
  const {
    currentTrack,
    currentTrackIndex,
    tracks,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    togglePlay,
    seek,
    toggleMute,
    selectTrack,
    isTimingMode,
  } = narration;

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <aside
      className="fixed bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[680px] z-50 transition-all duration-300"
      aria-label="Audio narration controls"
    >
      {/* The ONLY glassmorphic element in the entire project */}
      <div
        className="backdrop-blur-md bg-[var(--surface)]/85 border border-white/20 shadow-2xl p-3 md:px-5 md:py-3.5 flex flex-col gap-2"
        style={{ borderRadius: 'var(--radius)' }}
      >
        {/* Mobile thin progress line */}
        <div className="w-full bg-black/10 dark:bg-white/10 h-1 rounded-full overflow-hidden block md:hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          {/* Track title & badge */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={togglePlay}
              className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center cursor-pointer text-white shadow-md hover:scale-105 active:scale-95 transition-transform"
              style={{ backgroundColor: 'var(--accent)' }}
              aria-label={isPlaying ? 'Pause narration' : 'Play narration'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="translate-x-0.5" />}
            </button>

            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="hud-label text-[11px] text-[var(--accent)] font-semibold">
                  Track {currentTrackIndex + 1}/{tracks.length}
                </span>
                {isTimingMode && (
                  <span className="hud-label text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded">
                    TIMING MODE (SPACE)
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-[var(--ink)] truncate leading-tight">
                {currentTrack?.title}
              </p>
            </div>
          </div>

          {/* Desktop scrubber & controls */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-[280px]">
            <span className="hud-label text-xs text-[var(--muted)] w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              aria-label="Seek track"
              className="w-full accent-[var(--accent)] cursor-pointer h-2 bg-[var(--muted)]/20 rounded-lg appearance-none"
            />
            <span className="hud-label text-xs text-[var(--muted)] w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Track skip & volume controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => selectTrack(Math.max(0, currentTrackIndex - 1))}
              disabled={currentTrackIndex === 0}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-30 cursor-pointer"
              aria-label="Previous track"
            >
              <SkipBack size={18} />
            </button>
            <button
              type="button"
              onClick={() => selectTrack(Math.min(tracks.length - 1, currentTrackIndex + 1))}
              disabled={currentTrackIndex === tracks.length - 1}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] disabled:opacity-30 cursor-pointer"
              aria-label="Next track"
            >
              <SkipForward size={18} />
            </button>
            <button
              type="button"
              onClick={toggleMute}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
