import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { A, PLANETS, SITE, surfaceLocal } from './path';
import { missions } from '../data/missions';
import { band, clamp01, lerp, smooth } from '../lib/math';
import { Beacon, Strut, Tag, since, useClickable } from './parts';
import { puff, solarCells } from './textures';

const M = missions.find((m) => m.id === 'surveyor');
const ALU = '#b9b6ae';
const WHITE = '#efe9da';
const DARK = '#3a3d46';
const ARM_YAW = -Math.atan2(0.85, 1); // the scoop arm reaches toward the camera side (+X +Z)

function Leg({ angle }) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return (
    <>
      <Strut a={[0.32 * c, 0.78, 0.32 * s]} b={[1.45 * c, 0.12, 1.45 * s]} r={0.035} />
      <Strut a={[0.2 * c, 0.5, 0.2 * s]} b={[1.1 * c, 0.32, 1.1 * s]} r={0.02} />
      <mesh position={[1.5 * c, 0.06, 1.5 * s]}>
        <cylinderGeometry args={[0.22, 0.25, 0.1, 20]} />
        <meshStandardMaterial color={ALU} metalness={0.5} roughness={0.5} />
      </mesh>
    </>
  );
}

/** Surveyor 3 — three-legged lander with a mast, a TV camera and the famous digging scoop */
function Surveyor() {
  const arm = useRef();
  const slide = useRef();
  const trench = useRef();
  const dust = useRef([]);
  const holo = useRef();
  const click = useClickable('surveyor');

  useFrame((state) => {
    const e = since('surveyor');
    // dig timeline (seconds): lower → scrape → lift
    const lower = smooth(clamp01(e / 0.7));
    const scrape = smooth(clamp01((e - 0.7) / 1.1));
    const raise = smooth(clamp01((e - 1.9) / 0.6));
    const idle = Math.sin(state.clock.elapsedTime * 0.6) * 0.02;
    arm.current.rotation.z = e < 0 ? -0.45 + idle : lerp(lerp(-0.45, -0.76, lower), -0.38, raise);
    slide.current.position.x = e < 0 ? 0 : -0.35 * scrape * (1 - raise * 0.4);
    trench.current.scale.x = Math.max(0.001, e < 0 ? 0 : scrape);
    trench.current.visible = e > 0.7;
    dust.current.forEach((d, i) => {
      const k = clamp01((e - 0.75 - i * 0.18) / 1.3);
      d.visible = e > 0 && k > 0 && k < 1;
      d.scale.setScalar(0.15 + k * 0.9);
      d.material.opacity = 0.55 * (1 - k);
      d.position.set(1.2 - k * 0.2 + i * 0.05, 0.1 + k * 0.5, (i - 2) * 0.08);
    });
    const h = clamp01((e - 2.0) / 1.2);
    holo.current.visible = e > 2;
    holo.current.scale.setScalar(0.6 + smooth(h) * 1.4);
    holo.current.position.y = 0.06 + smooth(h) * 0.15;
    holo.current.rotation.z = state.clock.elapsedTime * 0.3;
    holo.current.material.opacity = 0.8 * smooth(h);
  });

  return (
    <group position={A.surveyor.pos} quaternion={A.surveyor.quat}>
      <group {...click}>
        {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((a) => (
          <Leg key={a} angle={a + 0.4} />
        ))}
        {/* space frame + boxes */}
        <mesh position={[0, 0.82, 0]}>
          <cylinderGeometry args={[0.42, 0.42, 0.06, 3]} />
          <meshStandardMaterial color={ALU} metalness={0.6} roughness={0.45} />
        </mesh>
        <mesh position={[-0.05, 1.02, -0.2]}>
          <boxGeometry args={[0.55, 0.32, 0.36]} />
          <meshStandardMaterial color={WHITE} roughness={0.6} />
        </mesh>
        <mesh position={[0.28, 0.98, 0.22]}>
          <boxGeometry args={[0.36, 0.26, 0.3]} />
          <meshStandardMaterial color="#d8cfb8" roughness={0.6} />
        </mesh>
        {/* mast with solar panel + flat antenna */}
        <Strut a={[0, 0.85, 0]} b={[0, 2.55, 0]} r={0.03} />
        <group position={[0, 2.55, 0]}>
          <mesh position={[-0.35, 0.1, 0]} rotation={[0.2, 0, 0.55]}>
            <boxGeometry args={[0.75, 0.025, 0.6]} />
            <meshStandardMaterial map={solarCells()} roughness={0.35} metalness={0.3} />
          </mesh>
          <mesh position={[0.35, 0.05, 0]} rotation={[-0.15, 0, -0.5]}>
            <boxGeometry args={[0.65, 0.025, 0.6]} />
            <meshStandardMaterial color="#9a9890" metalness={0.7} roughness={0.35} />
          </mesh>
        </group>
        {/* TV camera with mirror hood */}
        <group position={[-0.38, 1.25, 0.25]} rotation={[0, 0, 0.12]}>
          <mesh>
            <cylinderGeometry args={[0.09, 0.1, 0.45, 16]} />
            <meshStandardMaterial color={WHITE} roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.3, 0]} rotation={[0.5, 0, 0]}>
            <boxGeometry args={[0.18, 0.16, 0.12]} />
            <meshStandardMaterial color={DARK} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
        {/* omni antennas */}
        <Strut a={[-0.2, 1.1, -0.35]} b={[-0.6, 1.9, -0.8]} r={0.012} color={DARK} />
        <Strut a={[0.2, 1.1, -0.35]} b={[0.65, 1.8, -0.75]} r={0.012} color={DARK} />
        {/* surface sampler: arm pivot → slide → scoop */}
        <group position={[0.45, 0.95, 0.35]} rotation={[0, ARM_YAW, 0]}>
          <group ref={arm} rotation={[0, 0, -0.45]}>
            <group ref={slide}>
              <mesh position={[0.62, 0, 0.04]}>
                <boxGeometry args={[1.25, 0.035, 0.03]} />
                <meshStandardMaterial color={ALU} metalness={0.7} roughness={0.4} />
              </mesh>
              <mesh position={[0.62, 0, -0.04]}>
                <boxGeometry args={[1.25, 0.035, 0.03]} />
                <meshStandardMaterial color={ALU} metalness={0.7} roughness={0.4} />
              </mesh>
              <group position={[1.27, -0.02, 0]} rotation={[0, 0, -0.5]}>
                <mesh>
                  <boxGeometry args={[0.14, 0.1, 0.16]} />
                  <meshStandardMaterial color="#8d8a82" metalness={0.6} roughness={0.5} />
                </mesh>
                <mesh position={[0.06, -0.07, 0]}>
                  <boxGeometry args={[0.08, 0.05, 0.15]} />
                  <meshStandardMaterial color={DARK} />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
      {/* trench, dust puffs and the "safe to land" ring live in the arm's direction on the ground */}
      <group position={[0.45, 0, 0.35]} rotation={[0, ARM_YAW, 0]}>
        <group ref={trench} position={[1.15, 0.01, 0]} visible={false}>
          <mesh position={[-0.2, 0, 0]}>
            <boxGeometry args={[0.4, 0.02, 0.14]} />
            <meshStandardMaterial color="#2c2b29" roughness={1} />
          </mesh>
        </group>
        {[0, 1, 2, 3, 4].map((i) => (
          <sprite key={i} ref={(s) => (dust.current[i] = s)} visible={false}>
            <spriteMaterial map={puff()} color="#bdbab3" transparent depthWrite={false} />
          </sprite>
        ))}
      </group>
      <mesh ref={holo} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <torusGeometry args={[1.2, 0.012, 8, 96]} />
        <meshBasicMaterial color="#c8f2e0" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <Tag position={[0.2, 2.2, 0.6]} variant="holo" show={(p) => (since('surveyor') > 2.2 ? band(p, 0.26, 0.27, 0.415, 0.425) : 0)}>
        {M.hologram}
      </Tag>
      <Beacon id="surveyor" position={[1.35, 0.55, 1.1]} window={[0.27, 0.42]} scale={0.9} />
    </group>
  );
}

function flagTexture() {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 80;
  const ctx = c.getContext('2d');
  for (let i = 0; i < 13; i++) {
    ctx.fillStyle = i % 2 ? '#f4f1ea' : '#b8352b';
    ctx.fillRect(0, (i * 80) / 13, 128, 80 / 13 + 1);
  }
  ctx.fillStyle = '#2b3a6b';
  ctx.fillRect(0, 0, 56, 43);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Apollo 12 LM descent stage marker (Intrepid) */
function LunarModuleDescent() {
  const GOLD = '#d4af37';
  const BRONZE = '#5c4827';
  const SILVER = '#cfcfcf';
  return (
    // scale 1.6 ≈ real size next to Surveyor (descent stage ~4 m wide, legs ~9 m across)
    <group position={[-5, 0, -4]} rotation={[0, Math.PI / 4, 0]} scale={1.6}>
      {/* Octagonal descent stage main body */}
      <mesh position={[0, 0.65, 0]}>
        <cylinderGeometry args={[1.3, 1.4, 0.75, 8]} />
        <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Center engine bell underneath */}
      <mesh position={[0, 0.2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.32, 0.45, 16, 1, true]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.7} roughness={0.4} />
      </mesh>
      {/* Top deck / ascent stage base ring */}
      <mesh position={[0, 1.05, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.08, 16]} />
        <meshStandardMaterial color={BRONZE} metalness={0.6} roughness={0.5} />
      </mesh>
      {/* 4 landing gear legs with circular footpads */}
      {[0, 1, 2, 3].map((i) => {
        const ang = (i * Math.PI) / 2 + Math.PI / 4;
        const lx = Math.cos(ang) * 2.2;
        const lz = Math.sin(ang) * 2.2;
        const ox = Math.cos(ang) * 1.1;
        const oz = Math.sin(ang) * 1.1;
        return (
          <group key={i}>
            <Strut a={[ox, 0.7, oz]} b={[lx, 0.05, lz]} r={0.03} color={SILVER} />
            <Strut a={[ox * 0.7, 0.3, oz * 0.7]} b={[lx, 0.05, lz]} r={0.018} color={GOLD} />
            <mesh position={[lx, 0.04, lz]} rotation={[-Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.22, 0.24, 0.04, 16]} />
              <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.35} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Apollo 12 marker: LM Intrepid descent stage + flag + footprints walking over to Surveyor 3 (Nov 1969) */
function ApolloVisit() {
  const flag = useMemo(() => flagTexture(), []);
  const prints = useMemo(() => {
    const moon = PLANETS.moon;
    const out = [];
    const [ax, az] = SITE.apollo;
    const n = 26;
    for (let i = 0; i < n; i++) {
      const t = i / n;
      const x = lerp(ax - 1.2, 2.2, t) + Math.sin(t * 9) * 0.4;
      const z = lerp(az + 0.8, 1.8, t);
      const side = i % 2 ? 0.16 : -0.16;
      const v = surfaceLocal(moon, x + side * 0.6, z + side, 0.02).add(moon.center);
      out.push({ pos: v, rot: Math.atan2(2.2 - ax, 1.8 - az) });
    }
    return out;
  }, []);
  return (
    <>
      <group position={A.apollo.pos} quaternion={A.apollo.quat}>
        <LunarModuleDescent />
        <Strut a={[0, 0, 0]} b={[0, 1.9, 0]} r={0.02} color="#d9d6cf" />
        <Strut a={[0, 1.88, 0]} b={[0.95, 1.88, 0]} r={0.012} color="#d9d6cf" />
        <mesh position={[0.48, 1.58, 0]}>
          <planeGeometry args={[0.95, 0.6]} />
          <meshStandardMaterial map={flag} side={THREE.DoubleSide} roughness={0.8} />
        </mesh>
        <Tag position={[0.4, 2.35, 0]} show={(p) => band(p, 0.378, 0.39, 0.415, 0.425)}>
          {M.apolloTag}
        </Tag>
      </group>
      {prints.map((f, i) => (
        <group key={i} position={f.pos} quaternion={A.surveyor.quat}>
          <mesh rotation={[-Math.PI / 2, 0, f.rot]} scale={[0.09, 0.2, 1]}>
            <circleGeometry args={[1, 12]} />
            <meshStandardMaterial color="#4a4845" roughness={1} />
          </mesh>
        </group>
      ))}
    </>
  );
}

export default function MoonScene() {
  return (
    <>
      <Surveyor />
      <ApolloVisit />
    </>
  );
}
