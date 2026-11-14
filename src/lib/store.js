import { useSyncExternalStore } from 'react';

// Two kinds of shared state:
// 1. `live`  — values that change every frame (scroll progress, caption clock). Read inside
//              useFrame / gsap.ticker. Never causes a React re-render.
// 2. `state` — slow, discrete UI state (mode, act, open panels). Components subscribe with useStore().

export const live = {
  progress: 0, // 0..1 position in the whole story
  cap: { ti: 0, li: 0, time: 0 }, // caption: track index, line index, clock (s)
  fx: {}, // interaction trigger times: { surveyor: t, sojourner: t, oppy: t } (performance.now()/1000)
  atmo: { earth: 1, moon: 1, storm: 0 }, // written by the 3D Atmosphere each frame
};

let state = {
  mode: 'intro', // 'intro' | 'autopilot' | 'self'
  playing: false,
  muted: false,
  unlocked: false, // a tap happened, so the browser lets audio play
  audioBlocked: false,
  userPaused: false,
  act: 0, // 0 intro · 1 Surveyor · 2 Sojourner · 3 Oppy · 4 outro
  li: 0,
  card: null, // open sketchbook card: mission id
  panel: null, // 'sources' | 'badge' | null
  found: {}, // discoveries made: { surveyor: true, ... }
};

const subs = new Set();

export const getState = () => state;

export function setState(patch) {
  const p = typeof patch === 'function' ? patch(state) : patch;
  let changed = false;
  for (const k in p) {
    if (state[k] !== p[k]) {
      changed = true;
      break;
    }
  }
  if (!changed) return;
  state = { ...state, ...p };
  subs.forEach((fn) => fn());
}

function subscribe(fn) {
  subs.add(fn);
  return () => subs.delete(fn);
}

export function useStore(selector) {
  return useSyncExternalStore(subscribe, () => selector(state));
}

/** a kid tapped a robot or its beacon */
export function discover(id) {
  live.fx[id] = performance.now() / 1000;
  setState((s) => ({ card: id, found: s.found[id] ? s.found : { ...s.found, [id]: true } }));
}
