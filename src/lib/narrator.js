// The narrator: one controller that links the voice, the scroll position and the captions.
//
// Autopilot  — the voice is the clock. Audio time → story progress → page scroll (camera follows).
// Self-Pilot — the scroll is the clock. Scrolling into a sentence plays just that sentence,
//              then pauses until the kid scrolls on (or switches back to Autopilot).
// Any wheel / swipe / arrow-key scroll during Autopilot hands control to the kid (Self-Pilot).
//
// Runs on gsap.ticker (the same clock that drives Lenis), so there is no extra animation loop.
import { gsap } from 'gsap';
import { tracks } from '../data/narration';
import { lenis } from './smoothScroll';
import { getState, setState, live } from './store';
import { locate, progressAt, lineAtTime, lineStopTime } from './timeline';
import { clamp01, damp } from './math';
import { unlockAudio, muteSounds, updateAmbient, playRocketLaunch } from './sounds';

const LAST = tracks.length - 1;
let audios = [];
let curTi = 0; // which track the audio is on
let virtual = null; // silent clock if the browser blocks audio: { ti, time, paused }
let lineStop = null; // self-pilot: pause the voice at this time
let lastKey = -1;
let pendingTimer = 0;
let lastTick = 0;
const heard = new Map(); // how far each line has been spoken (so captions stay lit after it ends)

const maxScroll = () =>
  lenis ? lenis.limit : Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
const readProgress = () => clamp01((lenis ? lenis.animatedScroll : window.scrollY) / maxScroll());

function writeProgress(p) {
  const y = p * maxScroll();
  if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
  else window.scrollTo(0, y);
}

const audio = () => audios[curTi];

function playAt(ti, time) {
  if (curTi !== ti) audios[curTi]?.pause();
  curTi = ti;
  const a = audios[ti];
  if (blobs[ti] && a.src !== blobs[ti]) a.src = blobs[ti];
  try {
    a.currentTime = time;
  } catch {
    /* metadata not loaded yet — play() still starts near 0 */
  }
  a.muted = getState().muted;
  virtual = null;
  // streaming fallback: quietly buffer the next track so autopilot flows straight into it
  const next = audios[ti + 1];
  if (next && !blobs[ti + 1] && next.readyState < 2 && next.preload !== 'auto') {
    next.preload = 'auto';
    next.load();
  }
  a.play()
    .then(() => setState({ audioBlocked: false }))
    .catch(() => {
      setState({ audioBlocked: true });
      // keep the story moving in autopilot even without sound
      if (getState().mode === 'autopilot') virtual = { ti, time, paused: false };
    });
}

function playLine(ti, li) {
  lineStop = lineStopTime(ti, li);
  playAt(ti, tracks[ti].lines[li].start);
}

function unlock() {
  unlockAudio();
  if (getState().unlocked) return;
  setState({ unlocked: true });
}

// Download the five tracks one after another into memory (≈2.6 MB total). Blob audio seeks instantly,
// never stalls on a jump, and doesn't fight the page for network connections.
const blobs = [];
async function prefetchAll() {
  for (let i = 0; i < tracks.length; i++) {
    try {
      const res = await fetch(tracks[i].src);
      if (res.status !== 200) continue; // proxies/filters can answer 204: then just stream
      const b = await res.blob();
      if (b.size < 10000) continue;
      blobs[i] = URL.createObjectURL(b);
      const a = audios[i];
      if (a && a.paused && a.currentTime === 0) a.src = blobs[i];
    } catch {
      /* keep streaming from the normal URL */
    }
  }
}

// ---------- public controls ----------

export function startAutopilot() {
  unlock();
  const p = readProgress();
  const { ti, li } = locate(p);
  live.progress = p;
  lineStop = null;
  clearTimeout(pendingTimer);
  setState({ mode: 'autopilot', userPaused: false });
  playAt(ti, tracks[ti].lines[li].start);
}

export function startSelfPilot() {
  unlock();
  const wasFlying = getState().mode === 'autopilot';
  toSelf();
  if (wasFlying) return; // let the current sentence finish, no restart
  const { ti, li } = locate(readProgress());
  lastKey = ti * 100 + li;
  playLine(ti, li);
}

function toSelf() {
  const a = audio();
  if (a && !a.paused) lineStop = lineStopTime(curTi, lineAtTime(curTi, a.currentTime)); // finish the sentence
  virtual = null;
  const { ti, li } = locate(readProgress());
  lastKey = ti * 100 + li;
  setState({ mode: 'self' });
}

export function togglePlay() {
  const s = getState();
  unlock();
  if (s.mode === 'intro') return startAutopilot();
  const a = audio();
  const playing = virtual ? !virtual.paused : !a.paused;
  if (playing) {
    a.pause();
    if (virtual) virtual.paused = true;
    setState({ userPaused: true });
    return;
  }
  setState({ userPaused: false });
  if (s.mode === 'autopilot') {
    if (virtual) virtual.paused = false;
    else if (a.ended && curTi === LAST) startAutopilot();
    else a.play().catch(() => setState({ audioBlocked: true }));
  } else {
    const { ti, li } = locate(readProgress());
    playLine(ti, li);
  }
}

export function toggleMute() {
  const muted = !getState().muted;
  audios.forEach((a) => {
    a.muted = muted;
  });
  muteSounds(muted);
  setState({ muted });
}

/** jump to a point in the story (relay-track stops) */
export function goTo(p) {
  const s = getState();
  if (s.mode === 'autopilot') {
    const { ti, li } = locate(p + 1e-4);
    playAt(ti, tracks[ti].lines[li].start);
    return;
  }
  if (s.mode === 'intro') setState({ mode: 'self' });
  const y = p * maxScroll() + 2;
  if (lenis) lenis.scrollTo(y, { duration: 2.4, force: true });
  else window.scrollTo({ top: y });
}

// ---------- the per-frame loop ----------

function tick() {
  const now = performance.now() / 1000;
  const dt = Math.min(0.1, now - (lastTick || now));
  lastTick = now;
  const s = getState();
  const a = audio();
  let ti;
  let li;
  let time;

  if (s.mode === 'autopilot') {
    ti = virtual ? virtual.ti : curTi;
    if (virtual) {
      if (!virtual.paused) virtual.time += dt;
      if (virtual.time >= tracks[ti].duration) {
        if (ti < LAST) virtual = { ti: ti + 1, time: 0, paused: false };
        else virtual.paused = true;
        curTi = virtual.ti;
      }
      time = virtual.time;
    } else {
      time = a.currentTime;
    }
    const target = progressAt(ti, time);
    live.progress += (target - live.progress) * damp(dt, 5);
    writeProgress(live.progress);
    li = lineAtTime(ti, time);
  } else {
    const p = readProgress();
    live.progress = p;
    ({ ti, li } = locate(p));
    if (s.mode === 'intro' && p > 0.003) setState({ mode: 'self' });

    // self-pilot: stop at the end of the sentence
    if (lineStop !== null && !a.paused && a.currentTime >= lineStop) {
      a.pause();
      lineStop = null;
    }
    // self-pilot: a new sentence under the scroll → speak it (after the scroll settles a moment)
    const key = ti * 100 + li;
    if (key !== lastKey) {
      lastKey = key;
      clearTimeout(pendingTimer);
      if (s.mode === 'self' && s.unlocked && !s.userPaused) {
        pendingTimer = setTimeout(() => {
          if (lastKey === key && getState().mode === 'self') playLine(ti, li);
        }, 220);
      }
    }

    // caption clock: scrolling scrubs through the words; the voice takes over while it speaks
    const line = tracks[ti].lines[li];
    const frac = clamp01((p - line.scroll[0]) / (line.scroll[1] - line.scroll[0]));
    time = line.start + frac * (line.end - line.start) * 1.1;
    const next = tracks[ti].lines[li + 1];
    if (!a.paused && curTi === ti && a.currentTime >= line.start - 0.2 && (!next || a.currentTime < next.start)) {
      heard.set(key, Math.max(heard.get(key) || 0, a.currentTime));
    }
    time = Math.max(time, heard.get(key) || 0);
  }

  live.cap.ti = ti;
  live.cap.li = li;
  live.cap.time = time;
  if (s.mode === 'autopilot') heard.set(ti * 100 + li, Math.max(heard.get(ti * 100 + li) || 0, time));

  const playing = virtual ? !virtual.paused : !a.paused;
  if (ti !== s.act || li !== s.li || playing !== s.playing) {
    setState({ act: ti, li, playing, card: ti !== s.act ? null : s.card });
  }

  // ambient audio and sfx
  updateAmbient(ti, live.progress);
  playRocketLaunch(live.progress); // roars at ignition (EarthScene ignites at 0.158)
}

function onManualScroll() {
  if (getState().mode === 'autopilot' && !getState().panel) toSelf();
}

let touchY = 0;
export function initNarrator() {
  if (audios.length) return () => {};
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  audios = tracks.map((t, i) => {
    const a = new Audio(t.src);
    a.preload = i === 0 ? 'auto' : 'none';
    a.addEventListener('ended', () => {
      if (getState().mode === 'autopilot' && i === curTi && i < LAST) playAt(i + 1, 0);
    });
    return a;
  });

  const onWheel = () => onManualScroll();
  const onTouchStart = (e) => {
    touchY = e.touches[0]?.clientY ?? 0;
  };
  const onTouchMove = (e) => {
    if (Math.abs((e.touches[0]?.clientY ?? 0) - touchY) > 14) onManualScroll();
  };
  const onKey = (e) => {
    const tag = e.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) onManualScroll();
    if (e.code === 'Space' && tag !== 'BUTTON' && tag !== 'A') {
      e.preventDefault();
      togglePlay();
    }
  };
  const onFirstTap = () => {
    if (getState().unlocked) return;
    unlock();
    // the kid has been scrolling silently: now we're allowed to speak the current line
    if (getState().mode === 'self') {
      const { ti, li } = locate(readProgress());
      playLine(ti, li);
    }
  };

  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: true });
  window.addEventListener('keydown', onKey);
  window.addEventListener('pointerdown', onFirstTap);
  gsap.ticker.add(tick);
  prefetchAll();

  return () => {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('pointerdown', onFirstTap);
    gsap.ticker.remove(tick);
    audios.forEach((a) => a.pause());
    audios = [];
  };
}

/** pause the voice while a big panel is open, resume after */
let resumeAfterPanel = false;
export function openPanel(panel) {
  const s = getState();
  resumeAfterPanel = s.playing;
  if (s.playing) {
    audio()?.pause();
    if (virtual) virtual.paused = true;
  }
  lenis?.stop();
  setState({ panel });
}
export function closePanel() {
  setState({ panel: null });
  lenis?.start();
  if (resumeAfterPanel) {
    resumeAfterPanel = false;
    if (virtual) virtual.paused = false;
    else audio()?.play().catch(() => {});
  }
}

/** dev-only peek for automated tests */
export const _debug = () => {
  const a = audio();
  return { curTi, time: a?.currentTime, paused: a?.paused, lineStop, readyState: a?.readyState, virtual };
};
