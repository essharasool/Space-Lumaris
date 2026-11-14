/**
 * Web Audio sound engine for Echoes in the Dust.
 *
 * 100% synthesized in-code via Web Audio API:
 *   - No external asset dependencies (0 network requests, 0 missing file 404s)
 *   - Instant playback with zero latency
 *   - Respects browser autoplay policy (resumes AudioContext on first interaction)
 *   - Respects app-wide mute toggle
 */

let ctx = null;
let masterGain = null;
let isMuted = false;
let unlocked = false;

// Mars wind state
let windNode = null;
let windFilter = null;
let windGain = null;
let windVol = 0;

function getContext() {
  if (!ctx && typeof window !== 'undefined') {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      ctx = new AudioCtx();
      masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 1, ctx.currentTime);
      masterGain.connect(ctx.destination);
    }
  }
  return ctx;
}

/** Call on first user gesture (gate button, screen click) to unlock audio */
export function unlockAudio() {
  if (unlocked) return;
  unlocked = true;
  const c = getContext();
  if (c && c.state === 'suspended') {
    c.resume().catch(() => {});
  }
}

/** Sync with app mute state */
export function muteSounds(muted) {
  isMuted = muted;
  if (!ctx || !masterGain) return;
  const t = ctx.currentTime;
  masterGain.gain.cancelScheduledValues(t);
  masterGain.gain.linearRampToValueAtTime(muted ? 0 : 1, t + 0.05);
}

/**
 * Discovery chime: celestial vibraphone arpeggio.
 * Plays when a robot action is triggered or discovery is made.
 */
export function playDiscoveryChime() {
  if (isMuted) return;
  const c = getContext();
  if (!c || c.state === 'suspended') return;

  const freqs = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6 (major 9th arpeggio)
  const now = c.currentTime;

  freqs.forEach((freq, idx) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    const start = now + idx * 0.08;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);

    // subtle second harmonic for warmth
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.22, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0008, start + 1.1);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(start);
    osc.stop(start + 1.15);
  });
}

/**
 * Science file stamp: punchy mechanical thud with paper slap.
 * Triggers right as the stamp hits the Explorer Sketchbook page.
 */
export function playStampSound() {
  if (isMuted) return;
  const c = getContext();
  if (!c || c.state === 'suspended') return;

  const now = c.currentTime;

  // 1. Low frequency thump
  const osc = c.createOscillator();
  const oscGain = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(38, now + 0.12);

  oscGain.gain.setValueAtTime(0.45, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

  osc.connect(oscGain);
  oscGain.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.15);

  // 2. Paper slap noise transient
  const bufferSize = Math.floor(c.sampleRate * 0.09);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
  }

  const noise = c.createBufferSource();
  noise.buffer = buffer;

  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1800, now);

  const noiseGain = c.createGain();
  noiseGain.gain.setValueAtTime(0.35, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(masterGain);

  noise.start(now);
}

/**
 * Robot action sound effects:
 * - surveyor: scoop digging into moon soil
 * - sojourner: electronic spectrometer chirp
 * - oppy: RAT grinding wheel contact
 */
export function playRobotAction(id) {
  if (isMuted) return;
  const c = getContext();
  if (!c || c.state === 'suspended') return;
  const now = c.currentTime;

  if (id === 'surveyor') {
    // Soil scoop crunch/scrape
    const bufLen = Math.floor(c.sampleRate * 0.45);
    const buf = c.createBuffer(1, bufLen, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      d[i] = (Math.random() * 2 - 1) * 0.3 * Math.sin((i / bufLen) * Math.PI);
    }
    const noise = c.createBufferSource();
    noise.buffer = buf;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.Q.setValueAtTime(1.8, now);

    const g = c.createGain();
    g.gain.setValueAtTime(0.35, now);
    noise.connect(filter);
    filter.connect(g);
    g.connect(masterGain);
    noise.start(now);
  } else if (id === 'sojourner') {
    // APXS spectrometer dual chirp
    [660, 990].forEach((freq, idx) => {
      const osc = c.createOscillator();
      const g = c.createGain();
      const st = now + idx * 0.12;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, st);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, st + 0.08);
      g.gain.setValueAtTime(0.2, st);
      g.gain.exponentialRampToValueAtTime(0.001, st + 0.1);
      osc.connect(g);
      g.connect(masterGain);
      osc.start(st);
      osc.stop(st + 0.12);
    });
  } else if (id === 'oppy') {
    // Rotary Abrasion Tool (RAT) motor buzz + grind
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.3);
    osc.frequency.linearRampToValueAtTime(120, now + 0.6);

    const f = c.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(800, now);

    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.18, now + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(f);
    f.connect(g);
    g.connect(masterGain);
    osc.start(now);
    osc.stop(now + 0.68);
  }
}

/**
 * Rocket launch roar: deep low-pass noise rumble that swells.
 */
let rocketFired = false;
export function playRocketLaunch() {
  if (rocketFired || isMuted) return;
  rocketFired = true;
  const c = getContext();
  if (!c || c.state === 'suspended') return;

  const now = c.currentTime;
  const dur = 3.5;
  const bufLen = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) {
    d[i] = (Math.random() * 2 - 1) * 0.5;
  }
  const noise = c.createBufferSource();
  noise.buffer = buf;

  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(110, now);
  filter.frequency.exponentialRampToValueAtTime(450, now + 1.2);
  filter.frequency.exponentialRampToValueAtTime(160, now + dur);

  const g = c.createGain();
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(0.4, now + 0.8);
  g.gain.exponentialRampToValueAtTime(0.001, now + dur);

  noise.connect(filter);
  filter.connect(g);
  g.connect(masterGain);
  noise.start(now);
}

/**
 * Mars ambient wind generator: soft procedural howling that fades in on Mars.
 */
function initWind(c) {
  if (windNode) return;
  const bufLen = c.sampleRate * 2;
  const buf = c.createBuffer(1, bufLen, c.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  // Brownish pink noise for wind gust
  for (let i = 0; i < bufLen; i++) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    d[i] = last * 3.5;
  }

  windNode = c.createBufferSource();
  windNode.buffer = buf;
  windNode.loop = true;

  windFilter = c.createBiquadFilter();
  windFilter.type = 'bandpass';
  windFilter.frequency.value = 260;
  windFilter.Q.value = 2.0;

  windGain = c.createGain();
  windGain.gain.value = 0;

  windNode.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(masterGain);

  windNode.start();
}

/**
 * Called on tick to dynamically adjust ambient wind based on story progress.
 * Mars acts: progress ~ 0.45 .. 0.85
 */
export function updateAmbient(act, progress) {
  if (isMuted || !unlocked) return;
  const c = getContext();
  if (!c || c.state === 'suspended') return;

  const onMars = progress >= 0.45 && progress <= 0.88;
  const targetVol = onMars ? 0.18 : 0;

  if (targetVol > 0 && !windNode) {
    try {
      initWind(c);
    } catch (_) {}
  }

  if (windGain) {
    windVol += (targetVol - windVol) * 0.05;
    windGain.gain.setValueAtTime(Math.max(0, windVol), c.currentTime);
    if (windFilter && onMars) {
      // gentle gusting variation
      const t = c.currentTime;
      const freq = 240 + Math.sin(t * 0.4) * 80 + Math.cos(t * 0.9) * 40;
      windFilter.frequency.setValueAtTime(freq, t);
    }
  }
}
