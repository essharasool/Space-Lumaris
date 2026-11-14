import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { PLANETS, SITE } from './path';
import { live } from '../lib/store';
import { fbm } from '../lib/noise';
import { sramp } from '../lib/math';
import { earthMap, marsMap } from './textures';
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
const E = { grass: C('#34492f'), light: C('#5d6b3e'), pad: C('#5e5c59') };
const Mo = { base: C('#6f6c67'), dark: C('#4a4845'), light: C('#8e8b85') };
const Ma = { rust: C('#9c4d2a'), dark: C('#5e3020'), light: C('#c27a48'), plain: C('#a85d36'), sand: C('#6a3d28') };

function earthColor(x, z, h, c) {
  const n = fbm(x * 0.08, z * 0.08, 3, 2);
  c.copy(E.grass).lerp(E.light, Math.min(1, Math.max(0, h * 0.18 + n * 0.4)));
  const d = Math.hypot(x - SITE.pad[0], z - SITE.pad[1]);
  if (d < 9) c.lerp(E.pad, 1 - sramp(d, 6, 9));
}
function moonColor(x, z, h, c) {
  const n = fbm(x * 0.12, z * 0.12, 3, 4);
  c.copy(Mo.base).lerp(n > 0 ? Mo.light : Mo.dark, Math.abs(n) * 0.9);
  c.lerp(Mo.dark, Math.max(0, 0.3 - h) * 0.6);
}
function marsColor(x, z, h, c) {
  const n = fbm(x * 0.1, z * 0.1, 3, 6);
  const meri = sramp(x, -2, 28);
  c.copy(Ma.rust).lerp(n > 0 ? Ma.light : Ma.dark, Math.abs(n) * 0.8);
  c.lerp(Ma.dark, Math.max(0, h - 2) * 0.08);
  if (meri > 0) {
    const ripple = Math.sin(x * 1.3 + z * 0.5 + 3 * fbm(x * 0.05, z * 0.05, 2, 8));
    const m = Ma.plain.clone().lerp(Ma.sand, Math.max(0, ripple) * 0.35 + Math.max(0, n) * 0.3);
    c.lerp(m, meri);
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
  return <Planet planet={PLANETS.moon} map={map} patchColor={moonColor} rocks={moonRocks} visibleKey="moon" />;
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
