import { useState, useEffect, useRef, useCallback } from 'react';
import { tracks } from '../data/narration';

export function useNarration() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isTimingMode, setIsTimingMode] = useState(false);

  const audioRef = useRef(null);
  const timingLogsRef = useRef([]);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Initialize native audio element once
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.preload = 'metadata';

    const checkTiming = typeof window !== 'undefined' && window.location.search.includes('timing');
    setIsTimingMode(checkTiming);

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const onEnded = () => {
      setCurrentTrackIndex((prev) => {
        if (prev < tracks.length - 1) {
          return prev + 1;
        }
        setIsPlaying(false);
        return prev;
      });
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    const wasPlaying = isPlaying;
    audio.src = currentTrack.src;
    audio.currentTime = 0;
    setCurrentTime(0);
    timingLogsRef.current = [];

    if (wasPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  // Compute active line in current track based on timestamps
  const activeLineIndex = (() => {
    if (!currentTrack || !currentTrack.lines || currentTrack.lines.length === 0) return 0;
    const lines = currentTrack.lines;
    // If timing is set (not all zeros)
    const hasTimestamps = lines.some((l) => l.t > 0);
    if (!hasTimestamps) {
      // Estimate based on equal fractions if timestamps haven't been calibrated yet
      if (!duration) return 0;
      const fraction = currentTime / duration;
      return Math.min(Math.floor(fraction * lines.length), lines.length - 1);
    }
    for (let i = lines.length - 1; i >= 0; i--) {
      if (currentTime >= lines[i].t) {
        return i;
      }
    }
    return 0;
  })();

  const play = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time) => {
    if (audioRef.current) {
      const target = Math.max(0, Math.min(time, duration || 9999));
      audioRef.current.currentTime = target;
      setCurrentTime(target);
    }
  }, [duration]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  }, []);

  const selectTrack = useCallback((index) => {
    if (index >= 0 && index < tracks.length) {
      setCurrentTrackIndex(index);
    }
  }, []);

  const selectTrackById = useCallback((id) => {
    const idx = tracks.findIndex((t) => t.id === id);
    if (idx !== -1) {
      setCurrentTrackIndex(idx);
    }
  }, []);

  // Keyboard accessibility: Space to play/pause, Left/Right arrow to seek 5s,
  // or Space to stamp time if ?timing is active
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept when user is typing in form inputs
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (isTimingMode && isPlaying) {
          const t = Math.round(currentTime * 10) / 10;
          const logIdx = timingLogsRef.current.length;
          timingLogsRef.current.push(t);
          console.log(`[TIMING] Line ${logIdx + 1} start: ${t}s`);
          if (timingLogsRef.current.length >= currentTrack.lines.length) {
            const mapped = currentTrack.lines.map((l, i) => ({
              t: timingLogsRef.current[i] ?? 0,
              text: l.text,
            }));
            console.log('--- TRACK TIMINGS GENERATED ---');
            console.log(JSON.stringify(mapped, null, 2));
          }
        } else {
          togglePlay();
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        seek(currentTime - 5);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        seek(currentTime + 5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seek, currentTime, isTimingMode, isPlaying, currentTrack]);

  return {
    tracks,
    currentTrackIndex,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    isTimingMode,
    activeLineIndex,
    play,
    pause,
    togglePlay,
    seek,
    toggleMute,
    selectTrack,
    selectTrackById,
  };
}
