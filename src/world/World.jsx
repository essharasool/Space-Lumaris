import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { PLANETS, SITE } from './path';
import { live } from '../lib/store';
import { fbm } from '../lib/noise';
import { sramp } from '../lib/math';
import { earthMap, marsMap, moonMapProc } from './textures';
import Planet from './Planet';
import CameraRig from './CameraRig';
import Atmosphere from './Atmosphere';
import Kid from './Kid';
import EarthScene from './EarthScene';
import MoonScene from './MoonScene';
import MarsScene from './MarsScene';
import RelayTrail from './RelayTrail';

// ---------- ground colors (vertex colors on each patch) ----------
const C = (h) => new THREE.Color(h);
// Earth: richer greens + visible launch-pad concrete
const E = { 
  deep: C('#2a3d26'),     // deep forest
  grass: C('#3a5232'),    // mid green
  light: C('#6b7a46'),    // lighter/drier areas
  dry: C('#887a52'),      // dry grass / scrub
  pad: C('#62605c'),      // launch-pad concrete
  asphalt: C('#4a4845'),  // paved areas around pad
};
// Moon: more variation — dark mare, bright highland, grey mid
const Mo = { 
  mare: C('#3a3836'),     // dark mare basin floor
  base: C('#72706b'),     // grey highland base
  bright: C('#9a9790'),   // bright crater ejecta
  rim: C('#b8b4ae'),      // crater rim highlight
};
// Mars: warmer/richer rust palette + visible ripples
const Ma = { 
  rust: C('#a0502c'),
  deep: C('#5e2e18'),
  light: C('#ce8650'),
  orange: C('#d97840'),
  plain: C('#ac6038'),
  sand: C('#7a4830'),
  dune: C('#c47245'),
};

function earthColor(x, z, h, c) {
  const n = fbm(x * 0.08, z * 0.08, 3, 2);
  const n2 = fbm(x * 0.22, z * 0.22, 2, 7);
  // blend deep forest → grass → lighter/dry based on height + noise
  const lush = Math.min(1, Math.max(0, h * 0.12 + n * 0.35));
  c.copy(E.deep).lerp(E.grass, Math.min(1, lush * 1.8));
  c.lerp(E.light, Math.max(0, lush - 0.4) * 1.5);
  c.lerp(E.dry, Math.max(0, n2 * 0.5 - 0.15)); // drier patches via secondary noise
  // launch pad area
  const d = Math.hypot(x - SITE.pad[0], z - SITE.pad[1]);
  if (d < 11) c.lerp(E.pad, 1 - sramp(d, 7, 11));
  if (d < 7) c.lerp(E.asphalt, 1 - sramp(d, 4, 7));
}
function moonColor(x, z, h, c) {
  const n = fbm(x * 0.12, z * 0.12, 3, 4);
  const n2 = fbm(x * 0.4, z * 0.4, 2, 11);
  // base colour blends mare (dark) <→ highland (grey)
  const inMare = h < 0.4; // craters are lower — treat inner as mare-like
  c.copy(inMare ? Mo.mare : Mo.base);
  c.lerp(n > 0 ? Mo.bright : Mo.mare, Math.abs(n) * 0.7);
  // bright rim on crater edges
  if (h > 0.5 && n2 > 0.2) c.lerp(Mo.rim, Math.min(1, (n2 - 0.2) * 2.5));
  // darker inside craters (depth)
  c.lerp(Mo.mare, Math.max(0, 0.4 - h) * 0.7);
}
function marsColor(x, z, h, c) {
  const n = fbm(x * 0.1, z * 0.1, 3, 6);
  const n2 = fbm(x * 0.3, z * 0.3, 2, 13);
  const meri = sramp(x, -2, 28);
  // base rust varies with two noise octaves
  c.copy(Ma.rust).lerp(n > 0 ? Ma.light : Ma.deep, Math.abs(n) * 0.9);
  c.lerp(Ma.orange, Math.max(0, n2) * 0.4); // warm orange overlay
  c.lerp(Ma.deep, Math.max(0, h - 2) * 0.07);
  // Meridiani: sand ripples + lighter dunes
  if (meri > 0) {
    const ripple = Math.sin(x * 1.3 + z * 0.5 + 3 * fbm(x * 0.05, z * 0.05, 2, 8));
    const m = Ma.plain.clone().lerp(Ma.dune, Math.max(0, ripple) * 0.5 + Math.max(0, n) * 0.25);
    c.lerp(m, meri * 0.85);
  }
}

const near = (x, z, [sx, sz], r) => Math.hypot(x - sx, z - sz) < r;
const moonRocks = {
  count: 80,
  seed: 3,
  size: [0.06, 0.9],
  colors: ['#7b7975', '#96938e', '#5f5d5a'],
  pick: (r) => {
    const x = (r() * 2 - 1) * 60;
    const z = (r() * 2 - 1) * 60;
    return near(x, z, SITE.surveyor, 4) || near(x, z, SITE.apollo, 3) ? null : [x, z];
  },
};
const marsRocks = {
  count: 300,
  seed: 9,
  size: [0.04, 0.8],
  colors: ['#6e3a24', '#8a4a2c', '#4f2c1e', '#9a5a38'],
  pick: (r) => {
    const ares = r() < 0.75;
    const x = ares ? -95 + r() * 100 : 10 + r() * 80;
    const z = ares ? -25 + r() * 75 : -60 + r() * 120;
    if (near(x, z, SITE.sojourner, 2.2) || near(x, z, SITE.lander, 3.4) || near(x, z, SITE.oppy, 3.5)) return null;
    if (!ares && Math.abs(x - SITE.oppy[0]) < 7 && z > SITE.oppy[1]) return null; // keep Oppy's tracks clear
    if (!ares && r() < 0.6) return null;
    return [x, z];
  },
};

function Moon() {
  const map = useLoader(THREE.TextureLoader, '/textures/moon-1k.webp');
  useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
  }, [map]);
  return <Planet planet={PLANETS.moon} map={map} patchColor={moonColor} rocks={moonRocks} visibleKey="moon" glow="#aab5c4" />;
}

/** with reduced motion the canvas only redraws when the story moves */
function DemandDriver() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let last = -1;
    const f = () => {
      if (Math.abs(live.progress - last) > 1e-5) {
        last = live.progress;
        invalidate();
      }
    };
    gsap.ticker.add(f);
    return () => gsap.ticker.remove(f);
  }, [invalidate]);
  return null;
}

function Scene({ reduced }) {
  const earth = useMemo(() => earthMap(), []);
  const mars = useMemo(() => marsMap(), []);
  return (
    <>
      <CameraRig reduced={reduced} />
      <Atmosphere reduced={reduced} />
      {reduced && <DemandDriver />}
      <Planet planet={PLANETS.earth} map={earth} glow="#6f9be8" patchColor={earthColor} visibleKey="earth" />
      <Suspense fallback={null}>
        <Moon />
      </Suspense>
      <Planet planet={PLANETS.mars} map={mars} glow="#e0905a" patchColor={marsColor} rocks={marsRocks} />
      <EarthScene />
      <MoonScene />
      <MarsScene />
      <Kid reduced={reduced} />
      <RelayTrail />
    </>
  );
}

export default function World() {
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const [visible, setVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const f = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', f);
    return () => document.removeEventListener('visibilitychange', f);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={reduced ? 'demand' : visible ? 'always' : 'never'}
      gl={{ antialias: true, logarithmicDepthBuffer: true, powerPreference: 'high-performance' }}
      camera={{ fov: 45, near: 0.05, far: 20000, position: [1.3, 4, 4] }}
      style={{ touchAction: 'pan-y' }}
      onCreated={(s) => {
        if (import.meta.env.DEV) window.__r3f = s; // debug handle (dev only)
      }}
    >
      <Scene reduced={reduced} />
    </Canvas>
  );
}
