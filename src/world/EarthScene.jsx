import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { A, PLANETS } from './path';
import { live } from '../lib/store';
import { ramp, sramp } from '../lib/math';
import { rng } from '../lib/noise';
import { puff, softDot, solarCells } from './textures';
import { atmosphereNow } from './Atmosphere';

const WHITE = '#f3f0ea';
const ORANGE = '#e8804a';
const WHITE_C = new THREE.Color('#ffffff');
const Y_AXIS = new THREE.Vector3(0, 1, 0);

/** stylized rocket: ignites on "...but with a rocket." and streaks upward */
function Rocket() {
  const ship = useRef();
  const flame = useRef();      // main cone
  const flameInner = useRef(); // white-hot core
  const flameTip = useRef();   // dark blue base
  const glow = useRef();       // big orange glow halo
  const heatHaze = useRef();   // wide diffuse bloom
  const trail = useRef();
  const steam = useRef([]);
  const puffs = useMemo(() => {
    const r = rng(3);
    return Array.from({ length: 10 }, () => ({ x: (r() - 0.5) * 10, z: (r() - 0.5) * 10, s: 6 + r() * 6 }));
  }, []);
  // extra exhaust spark sprites
  const sparks = useMemo(() => {
    const r = rng(42);
    return Array.from({ length: 16 }, () => ({ x: (r() - 0.5) * 2.4, z: (r() - 0.5) * 2.4, s: 2.5 + r() * 3 }));
  }, []);
  const sparkRefs = useRef([]);

  useFrame((state) => {
    const p = live.progress;
    const root = ship.current.parent;
    root.visible = p < 0.245;
    if (!root.visible) return;
    const ignite = sramp(p, 0.158, 0.166);
    const lift = ramp(p, 0.166, 0.23);
    const y = 700 * lift ** 2.2;
    ship.current.position.y = y;
    ship.current.rotation.z = -0.12 * lift;

    const t = state.clock.elapsedTime;
    // flicker: combine multiple frequencies for realism
    const flicker = ignite * (0.82 + Math.sin(t * 38) * 0.09 + Math.sin(t * 71) * 0.06 + Math.sin(t * 23) * 0.03);
    const stretch = 1 + lift * 1.6;

    // outer orange cone
    flame.current.scale.set(flicker, flicker * stretch, flicker);
    flame.current.visible = ignite > 0.01;
    flame.current.material.opacity = 0.75 * ignite;

    // white-hot inner core (smaller, brighter)
    flameInner.current.scale.set(flicker * 0.42, flicker * stretch * 0.65, flicker * 0.42);
    flameInner.current.visible = ignite > 0.01;
    flameInner.current.material.opacity = 0.92 * ignite;

    // deep blue base (mach diamond / combustion zone)
    flameTip.current.scale.set(flicker * 0.22, flicker * 0.4, flicker * 0.22);
    flameTip.current.visible = ignite > 0.01;
    flameTip.current.material.opacity = 0.65 * ignite;

    // big glow halo around engine
    glow.current.material.opacity = 0.65 * ignite;
    glow.current.scale.setScalar(16 + Math.sin(t * 30) * 1.5);

    // heat-haze/bloom — wider, dimmer
    if (heatHaze.current) {
      heatHaze.current.material.opacity = 0.12 * ignite; // stacked additive glows wash the pad out to white
      heatHaze.current.scale.setScalar(28 + Math.sin(t * 11) * 2);
    }

    // exhaust trail behind
    trail.current.visible = y > 1;
    trail.current.scale.set(1, Math.max(0.01, y), 1);
    trail.current.position.y = y / 2;
    trail.current.material.opacity = 0.28 * ignite * (1 - sramp(p, 0.215, 0.24));

    // steam puffs at pad
    steam.current.forEach((s, i) => {
      if (!s) return;
      const grow = ignite * (1 + lift * 3);
      s.scale.setScalar(puffs[i].s * grow + 0.01);
      s.material.opacity = 0.45 * ignite * (1 - lift * 0.8);
    });

    // sparks scattering outward from nozzle
    sparkRefs.current.forEach((s, i) => {
      if (!s) return;
      const sp = sparks[i];
      // each spark falls out of the nozzle, spreads, fades, then loops
      const life = (t * 1.6 + i * 0.137) % 1;
      s.position.set(sp.x * life * 1.5, -2.2 - life * 7 * stretch, sp.z * life * 1.5);
      s.scale.setScalar(sp.s * 0.1 * ignite * (1 - life * 0.6));
      s.material.opacity = 0.7 * ignite * (1 - life);
    });
  });

  return (
    <group position={A.pad.pos} quaternion={A.pad.quat}>
      {/* launch pad + tower */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[7, 7.5, 0.8, 32]} />
        <meshStandardMaterial color="#6d6b68" roughness={0.9} />
      </mesh>
      {/* pad surface detail ring */}
      <mesh position={[0, 0.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.5, 7, 32]} />
        <meshStandardMaterial color="#56534f" roughness={1} />
      </mesh>
      <mesh position={[3.4, 9, 0]}>
        <boxGeometry args={[1, 18, 1]} />
        <meshStandardMaterial color="#8a3b26" roughness={0.7} />
      </mesh>
      <mesh position={[2.4, 13, 0]}>
        <boxGeometry args={[2.2, 0.3, 0.5]} />
        <meshStandardMaterial color="#8a3b26" />
      </mesh>
      {/* arm horizontal brace */}
      <mesh position={[1.7, 10.5, 0]}>
        <boxGeometry args={[1.4, 0.2, 0.3]} />
        <meshStandardMaterial color="#8a3b26" />
      </mesh>
      {puffs.map((pf, i) => (
        <sprite key={i} ref={(s) => (steam.current[i] = s)} position={[pf.x, 2, pf.z]}>
          <spriteMaterial map={puff()} color="#e9e2da" transparent opacity={0} depthWrite={false} />
        </sprite>
      ))}
      <mesh ref={trail} visible={false}>
        <cylinderGeometry args={[0.7, 1.6, 1, 12, 1, true]} />
        <meshBasicMaterial color="#ffcf8a" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <group ref={ship}>
        <mesh position={[0, 5.6, 0]}>
          <cylinderGeometry args={[1.1, 1.1, 9, 32]} />
          <meshStandardMaterial color={WHITE} roughness={0.4} metalness={0.1} />
        </mesh>
        <mesh position={[0, 3, 0]}>
          <cylinderGeometry args={[1.12, 1.12, 0.6, 32]} />
          <meshStandardMaterial color="#2f323a" />
        </mesh>
        <mesh position={[0, 8.6, 0]}>
          <cylinderGeometry args={[1.12, 1.12, 0.35, 32]} />
          <meshStandardMaterial color={ORANGE} />
        </mesh>
        <mesh position={[0, 11.7, 0]}>
          <coneGeometry args={[1.1, 3.2, 32]} />
          <meshStandardMaterial color={ORANGE} roughness={0.5} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[0, (i * Math.PI * 2) / 3, 0]} position={[0, 2.1, 0]}>
            <mesh position={[1.5, 0, 0]}>
              <boxGeometry args={[1.4, 2.4, 0.14]} />
              <meshStandardMaterial color={ORANGE} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.6, 0.9, 1.2, 20]} />
          <meshStandardMaterial color="#3a3d46" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* === REALISTIC FIRE ENGINE === */}
        {/* outermost: wide orange/amber plume */}
        <mesh ref={flame} position={[0, -2.8, 0]} rotation={[Math.PI, 0, 0]} visible={false}>
          <coneGeometry args={[0.95, 6.5, 20, 1, true]} />
          <meshBasicMaterial color="#ff7020" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {/* middle: bright yellow-white hot core */}
        <mesh ref={flameInner} position={[0, -2.5, 0]} rotation={[Math.PI, 0, 0]} visible={false}>
          <coneGeometry args={[0.52, 4.8, 16, 1, true]} />
          <meshBasicMaterial color="#fff4c0" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {/* innermost: deep blue combustion tip (at nozzle exit) */}
        <mesh ref={flameTip} position={[0, -1.6, 0]} rotation={[Math.PI, 0, 0]} visible={false}>
          <coneGeometry args={[0.26, 1.4, 12, 1, true]} />
          <meshBasicMaterial color="#aad4ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
        {/* large diffuse glow sprite at nozzle */}
        <sprite ref={glow} position={[0, -2.0, 0]} scale={16}>
          <spriteMaterial map={softDot()} color="#ff8828" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        {/* extra-wide heat haze bloom */}
        <sprite ref={heatHaze} position={[0, -1.5, 0]} scale={28}>
          <spriteMaterial map={softDot()} color="#ffaa44" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
        {/* spark particles */}
        {sparks.map((sp, i) => (
          <sprite key={i} ref={(s) => (sparkRefs.current[i] = s)} scale={0.5}>
            <spriteMaterial map={softDot()} color="#ffcc66" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        ))}
      </group>
    </group>
  );
}

/** soft cloud deck the camera rises through */
function Clouds() {
  const group = useRef();
  const mats = useRef([]);
  const items = useMemo(() => {
    const r = rng(21);
    return Array.from({ length: 46 }, () => ({
      pos: [15 + (r() - 0.5) * 220, 55 + r() * 45, -45 + (r() - 0.5) * 200],
      s: 40 + r() * 60,
      o: 0.4 + r() * 0.5,
    }));
  }, []);
  const tint = useMemo(() => new THREE.Color(), []);
  useFrame(() => {
    const p = live.progress;
    const fade = 1 - sramp(p, 0.205, 0.235);
    group.current.visible = fade > 0.01;
    if (!group.current.visible) return;
    tint.copy(atmosphereNow.horizon).lerp(WHITE_C, 0.45);
    mats.current.forEach((m, i) => {
      m.opacity = items[i].o * 0.6 * fade;
      m.color.copy(tint);
    });
  });
  return (
    <group ref={group}>
      {items.map((c, i) => (
        <sprite key={i} position={c.pos} scale={[c.s, c.s * 0.55, 1]}>
          <spriteMaterial ref={(m) => (mats.current[i] = m)} map={puff()} transparent depthWrite={false} />
        </sprite>
      ))}
    </group>
  );
}

/** "...past the floating satellites" — three small satellites crossing the twilight sky */
function Satellites() {
  const refs = useRef([]);
  const blinks = useRef([]);
  const orbits = useMemo(
    () => [
      { r: 590, tilt: 0.28, yaw: 0.2, speed: 0.018, phase: 1.35 },
      { r: 640, tilt: 0.45, yaw: -0.5, speed: 0.012, phase: 1.5 },
      { r: 560, tilt: 0.18, yaw: 0.9, speed: 0.022, phase: 1.65 },
    ],
    [],
  );
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const show = live.progress < 0.26;
    orbits.forEach((o, i) => {
      const g = refs.current[i];
      if (!g) return;
      g.visible = show;
      if (!show) return;
      const a = o.phase + Math.sin(t * o.speed) * 0.35;
      v.set(Math.cos(a), Math.sin(a) * Math.cos(o.tilt), -Math.sin(a) * Math.sin(o.tilt) * 3)
        .normalize()
        .applyAxisAngle(Y_AXIS, o.yaw)
        .multiplyScalar(o.r)
        .add(PLANETS.earth.center);
      g.position.copy(v);
      g.rotation.y = t * 0.1 + i;
      blinks.current[i].material.opacity = (Math.sin(t * 3 + i * 2) > 0.6 ? 1 : 0.15) * 0.9;
    });
  });
  return orbits.map((_, i) => (
    <group key={i} ref={(g) => (refs.current[i] = g)} scale={1.6}>
      <mesh>
        <boxGeometry args={[1.2, 1.2, 2]} />
        <meshStandardMaterial color="#c9a24a" metalness={0.8} roughness={0.35} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 2.8, 0, 0]}>
          <boxGeometry args={[4, 0.05, 1.4]} />
          <meshStandardMaterial map={solarCells()} roughness={0.4} metalness={0.3} />
        </mesh>
      ))}
      <sprite ref={(s) => (blinks.current[i] = s)} position={[0, 0.9, 0]} scale={5}>
        <spriteMaterial map={softDot()} color="#ffe9c4" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  ));
}

export default function EarthScene() {
  return (
    <>
      <Rocket />
      <Clouds />
      <Satellites />
    </>
  );
}
