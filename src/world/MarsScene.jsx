import { Suspense, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { A, PLANETS, SITE, surfaceLocal } from './path';
import { missions } from '../data/missions';
import { live } from '../lib/store';
import { band, clamp01, lerp, smooth, sramp } from '../lib/math';
import { rng } from '../lib/noise';
import { Beacon, Strut, Tag, since, useClickable } from './parts';
import { softDot, solarCells } from './textures';

const SOJ = missions.find((m) => m.id === 'sojourner');
const OPPY = missions.find((m) => m.id === 'oppy');
const MODEL_URL = '/models/opportunity.glb';
const DRACO_PATH = '/draco/'; // NASA's model is Draco-compressed; decoder is served locally (works offline)

// ================= Sojourner (Ares Vallis, 1997) =================

function Wheel({ position, spin }) {
  return (
    <group position={position}>
      <mesh ref={spin} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.06, 16]} />
        <meshStandardMaterial color="#8d8f94" metalness={0.7} roughness={0.35} />
      </mesh>
    </group>
  );
}

/** Mars Pathfinder lander: open petals, deflated airbags, a ramp and a camera mast */
function Lander() {
  return (
    <group position={[-2.7, 0, 0.3]}>
      <mesh position={[0, 0.22, 0]}>
        <coneGeometry args={[0.55, 0.45, 3]} />
        <meshStandardMaterial color="#cbbf9f" roughness={0.7} />
      </mesh>
      {[0, 1, 2].map((i) => {
        const a = (i * Math.PI * 2) / 3;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[0.85, 0.05, 0]} rotation={[-Math.PI / 2, 0, Math.PI]}>
              <circleGeometry args={[0.75, 3]} />
              <meshStandardMaterial color="#d8d2c2" roughness={0.6} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[1.25, 0.08, 0.5]} scale={[0.5, 0.12, 0.35]}>
              <sphereGeometry args={[1, 12, 8]} />
              <meshStandardMaterial color="#ece7da" roughness={0.9} />
            </mesh>
          </group>
        );
      })}
      <Strut a={[0, 0.3, 0]} b={[0, 1.05, 0]} r={0.025} color="#9a988f" />
      <mesh position={[0, 1.12, 0]}>
        <boxGeometry args={[0.22, 0.14, 0.14]} />
        <meshStandardMaterial color="#2f323a" metalness={0.5} />
      </mesh>
      {/* ramp toward the rover */}
      <mesh position={[1.42, 0.05, 0]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.6, 0.015, 0.34]} />
        <meshStandardMaterial color="#9a988f" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Sojourner() {
  const rover = useRef();
  const wheels = useRef([]);
  const beam = useRef();
  const crystals = useRef();
  const micro = useRef();
  const click = useClickable('sojourner');
  const wheelPos = useMemo(() => {
    const out = [];
    for (const x of [-0.24, 0, 0.24]) for (const z of [-0.27, 0.27]) out.push([x, 0.065, z]);
    return out;
  }, []);
  const gems = useMemo(() => {
    const r = rng(8);
    const cols = ['#f2b45a', '#7fd6c2', '#e98a7a', '#f4efe4', '#9fb7f0'];
    return Array.from({ length: 8 }, (_, i) => ({ a: (i / 8) * Math.PI * 2, h: 0.4 + r() * 0.5, d: 0.35 + r() * 0.2, c: cols[i % cols.length], s: 0.035 + r() * 0.03 }));
  }, []);
  const microEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.5, 0.3, 0.36)), []);

  useFrame((state) => {
    const p = live.progress;
    const t = state.clock.elapsedTime;
    const e = since('sojourner');
    const found = e >= 0 ? smooth(clamp01(e / 1.2)) : 0;
    const roll = Math.max(smooth(clamp01((p - 0.436) / 0.06)), found);
    const turn = Math.max(sramp(p, 0.54, 0.565), found);
    const x = lerp(-1.45, 0, roll);
    rover.current.position.set(x + turn * 0.0, 0.0 + (x < -1.1 ? 0.07 : 0), -0.12 * turn);
    rover.current.rotation.y = -Math.PI / 2 * turn;
    wheels.current.forEach((w) => w && (w.rotation.y = -x / 0.065));

    const scan = e >= 0 ? clamp01((e - 1.0) / 0.4) : 0;
    beam.current.visible = scan > 0;
    beam.current.material.opacity = scan * (0.55 + Math.sin(t * 18) * 0.2);
    crystals.current.visible = e > 1.4;
    crystals.current.children.forEach((c, i) => {
      const g = gems[i];
      const k = smooth(clamp01((e - 1.4 - i * 0.08) / 0.9));
      c.position.set(Math.cos(g.a + t * 0.4) * g.d, 0.2 + g.h * 0.4 * k, Math.sin(g.a + t * 0.4) * g.d);
      c.rotation.set(t + i, t * 0.7, 0);
      c.scale.setScalar(k * g.s * 20);
    });
    micro.current.visible = e > 0.5;
    micro.current.material.opacity = 0.8 * smooth(clamp01((e - 0.5) / 0.6)) * band(p, 0.47, 0.48, 0.63, 0.645);
  });

  return (
    <group position={A.sojourner.pos} quaternion={A.sojourner.quat}>
      <Lander />
      {/* rock "Yogi" */}
      <mesh position={[0, 0.16, -0.95]} scale={[0.42, 0.3, 0.36]} rotation={[0.3, 0.7, 0.1]}>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#7d4a32" roughness={0.95} flatShading />
      </mesh>
      <group ref={crystals} position={[0, 0, -0.95]} visible={false}>
        {gems.map((g, i) => (
          <mesh key={i}>
            <octahedronGeometry args={[0.05, 0]} />
            <meshStandardMaterial color={g.c} emissive={g.c} emissiveIntensity={0.6} roughness={0.3} />
          </mesh>
        ))}
      </group>
      <group ref={rover} {...click}>
        {/* body + solar panel */}
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.5, 0.14, 0.34]} />
          <meshStandardMaterial color="#d8c7a0" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.29, 0]}>
          <boxGeometry args={[0.66, 0.018, 0.48]} />
          <meshStandardMaterial map={solarCells()} roughness={0.35} metalness={0.3} />
        </mesh>
        {/* rocker-bogie links */}
        {[-0.27, 0.27].map((z) => (
          <group key={z}>
            <Strut a={[-0.24, 0.07, z]} b={[0.02, 0.15, z]} r={0.012} color="#9a988f" />
            <Strut a={[0.02, 0.15, z]} b={[0.24, 0.07, z]} r={0.012} color="#9a988f" />
            <Strut a={[0.02, 0.15, z]} b={[0.02, 0.2, z * 0.7]} r={0.012} color="#9a988f" />
          </group>
        ))}
        {wheelPos.map((wp, i) => (
          <Wheel key={i} position={wp} spin={(m) => (wheels.current[i] = m)} />
        ))}
        {/* antenna */}
        <Strut a={[0.12, 0.3, 0.14]} b={[0.12, 0.6, 0.14]} r={0.004} color="#2f323a" />
        <mesh position={[0.12, 0.61, 0.14]}>
          <sphereGeometry args={[0.012, 8, 6]} />
          <meshStandardMaterial color="#2f323a" />
        </mesh>
        {/* front cameras */}
        <mesh position={[0.27, 0.2, 0]}>
          <boxGeometry args={[0.04, 0.05, 0.12]} />
          <meshStandardMaterial color="#2f323a" />
        </mesh>
        {/* APXS on the back */}
        <Strut a={[-0.25, 0.18, 0]} b={[-0.36, 0.12, 0]} r={0.012} color="#9a988f" />
        <mesh position={[-0.38, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.025, 0.025, 0.05, 12]} />
          <meshStandardMaterial color="#c9a24a" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh ref={beam} position={[-0.5, 0.13, 0]} rotation={[0, 0, Math.PI / 2]} visible={false}>
          <cylinderGeometry args={[0.012, 0.03, 0.2, 10, 1, true]} />
          <meshBasicMaterial color="#bff0dc" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
      {/* "size of a microwave" hologram */}
      <lineSegments ref={micro} geometry={microEdges} position={[0.8, 0.16, -0.75]} visible={false}>
        <lineBasicMaterial color="#ffe2b0" transparent opacity={0} />
      </lineSegments>
      <Tag position={[0.8, 0.5, -0.75]} variant="holo" show={(p) => (since('sojourner') > 0.8 ? band(p, 0.47, 0.48, 0.63, 0.64) : 0)}>
        {SOJ.hologram}
      </Tag>
      <Beacon id="sojourner" position={[0, 0.5, 0]} window={[0.49, 0.64]} scale={0.55} />
    </group>
  );
}

// ================= Opportunity (Meridiani Planum, 2004–2018) =================

/** ribbon of glowing wheel tracks stretching behind Oppy */
function useTracks() {
  return useMemo(() => {
    const mars = PLANETS.mars;
    const [ox, oz] = SITE.oppy;
    const pts = [
      [0, 0.9], [-0.3, 5], [-1.5, 12], [-4, 22], [-3, 32], [1, 42], [6, 54], [4, 66], [-2, 78],
    ].map(([x, z]) => new THREE.Vector3(ox + x, 0, oz + z));
    const curve = new THREE.CatmullRomCurve3(pts);
    const N = 360;
    const pos = [];
    const col = [];
    const idx = [];
    const v = new THREE.Vector3();
    const c = new THREE.Color();
    const warm = new THREE.Color('#e89a58');
    for (const off of [-0.6, 0.6]) {
      const base = pos.length / 3;
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const p = curve.getPoint(t);
        const tan = curve.getTangent(t);
        const nx = -tan.z;
        const nz = tan.x;
        for (const w of [-0.12, 0.12]) {
          surfaceLocal(mars, p.x + nx * (off + w), p.z + nz * (off + w), 0.04, v).add(mars.center);
          pos.push(v.x, v.y, v.z);
          c.copy(warm).multiplyScalar((1 - t) ** 0.8);
          col.push(c.r, c.g, c.b);
        }
        if (i < N) {
          const a = base + i * 2;
          idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    return g;
  }, []);
}

function Tracks() {
  const geo = useTracks();
  const mat = useRef();
  const mesh = useRef();
  const labelPos = useMemo(() => surfaceLocal(PLANETS.mars, SITE.oppy[0] - 2, SITE.oppy[1] + 14, 1.2).add(PLANETS.mars.center), []);
  useFrame(() => {
    const p = live.progress;
    const o = band(p, 0.655, 0.69, 0.77, 0.8);
    mat.current.opacity = 0.12 + 0.38 * o;
    mesh.current.visible = p > 0.6 && p < 0.9;
  });
  return (
    <>
      <mesh ref={mesh} geometry={geo}>
        <meshBasicMaterial ref={mat} vertexColors transparent blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <Tag position={labelPos} show={(p) => band(p, 0.69, 0.7, 0.74, 0.75)}>
        {OPPY.tracksLabel}
      </Tag>
    </>
  );
}

const OPPY_YAW = Math.PI; // turns NASA's model so its arm faces the RAT rock (-Z)
const DUST = new THREE.Color('#5c4230');

function OppyModel() {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);
  const holder = useRef();
  const led = useRef();
  const ledGlow = useRef();
  const info = useMemo(() => {
    const model = scene.clone(true);
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const s = 2.3 / Math.max(size.x, size.z);
    const center = box.getCenter(new THREE.Vector3());
    model.position.set(-center.x * s, -box.min.y * s, -center.z * s);
    model.scale.setScalar(s);
    // highest point = top of the camera mast → heartbeat light goes there
    model.updateMatrixWorld(true);
    const top = new THREE.Vector3(0, -Infinity, 0);
    const v = new THREE.Vector3();
    const mats = [];
    model.traverse((o) => {
      if (!o.isMesh) return;
      o.material = o.material.clone();
      mats.push({ m: o.material, base: o.material.color.clone(), solar: /solar/i.test(o.material.name) });
      const pos = o.geometry.attributes.position;
      for (let i = 0; i < pos.count; i += 3) {
        v.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
        if (v.y > top.y) top.copy(v);
      }
    });
    return { model, top, mats };
  }, [scene]);

  useFrame((state) => {
    const p = live.progress;
    const t = state.clock.elapsedTime;
    const storm = live.atmo.storm;
    const dusty = Math.max(storm, sramp(p, 0.8, 0.86));
    info.mats.forEach(({ m, base, solar }) => m.color.copy(base).lerp(DUST, dusty * (solar ? 0.85 : 0.35)));
    // heartbeat: slows down in the storm, then goes to sleep
    const life = 1 - sramp(p, 0.836, 0.858);
    const rate = lerp(2.6, 1.1, storm);
    const beat = Math.max(0, Math.sin(t * rate * Math.PI)) ** 10;
    const k = life * (0.25 + beat);
    led.current.material.emissiveIntensity = 3 * k;
    ledGlow.current.material.opacity = Math.min(1, k) * 0.9;
    ledGlow.current.scale.setScalar(0.25 + 0.2 * beat);
  });

  return (
    <group ref={holder} rotation={[0, OPPY_YAW, 0]}>
      <primitive object={info.model} />
      <group position={info.top}>
        <mesh ref={led} position={[0, 0.04, 0]}>
          <sphereGeometry args={[0.025, 10, 8]} />
          <meshStandardMaterial color="#ffe9c4" emissive="#ffc46a" emissiveIntensity={2} />
        </mesh>
        <sprite ref={ledGlow} position={[0, 0.04, 0]} scale={0.3}>
          <spriteMaterial map={softDot()} color="#ffc46a" transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      </group>
    </group>
  );
}

/** the RAT grinds a rock: spinning bit, golden sparks, then blue hematite "blueberries" appear */
function RatGrind() {
  const bit = useRef();
  const disc = useRef();
  const berries = useRef();
  const sparks = useRef();
  const N = 70;
  const sparkData = useMemo(() => {
    const r = rng(17);
    return Array.from({ length: N }, () => ({ v: new THREE.Vector3((r() - 0.5) * 1.2, r() * 1.2, 0.4 + r() * 0.9), life: r() }));
  }, []);
  const sparkGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    return g;
  }, []);
  const berrySpots = useMemo(() => {
    const r = rng(23);
    return Array.from({ length: 10 }, () => [(r() - 0.5) * 0.17, (r() - 0.5) * 0.17]);
  }, []);

  useFrame((state, dt) => {
    const e = since('oppy');
    const t = state.clock.elapsedTime;
    const grinding = e >= 0 && e < 2.2;
    bit.current.rotation.z += dt * (grinding ? 40 : 0);
    bit.current.position.z = grinding ? -1.0 + Math.sin(t * 30) * 0.003 : -0.96;
    const reveal = e >= 0 ? smooth(clamp01((e - 0.4) / 1.6)) : 0;
    disc.current.scale.setScalar(Math.max(0.001, reveal));
    berries.current.visible = e > 1.2;
    berries.current.children.forEach((b, i) => {
      const k = smooth(clamp01((e - 1.2 - i * 0.07) / 0.6));
      b.scale.setScalar(Math.max(0.001, k));
      b.material.emissiveIntensity = 0.5 + Math.sin(t * 2.4 + i) * 0.35;
    });
    sparks.current.visible = grinding;
    if (grinding) {
      const arr = sparkGeo.attributes.position.array;
      sparkData.forEach((s, i) => {
        s.life = (s.life + dt * 1.8) % 1;
        const L = s.life;
        arr[i * 3] = s.v.x * L * 0.5;
        arr[i * 3 + 1] = s.v.y * L * 0.5 - 0.9 * L * L * 0.5;
        arr[i * 3 + 2] = s.v.z * L * 0.5;
      });
      sparkGeo.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group position={[0.25, 0, 0]}>
      <mesh position={[0, 0.28, -1.38]} scale={[0.45, 0.32, 0.4]} rotation={[0.2, 0.4, 0]}>
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#8a4f33" roughness={0.95} flatShading />
      </mesh>
      {/* the ground-in circle on the rock face */}
      <group position={[0, 0.32, -1.035]}>
        <mesh ref={disc}>
          <circleGeometry args={[0.13, 32]} />
          <meshStandardMaterial color="#4a3a33" roughness={0.6} />
        </mesh>
        <group ref={berries} visible={false}>
          {berrySpots.map(([x, y], i) => (
            <mesh key={i} position={[x, y, 0.012]}>
              <sphereGeometry args={[0.016, 12, 10]} />
              <meshStandardMaterial color="#4f7fe0" emissive="#3d6fd6" emissiveIntensity={0.6} metalness={0.3} roughness={0.25} />
            </mesh>
          ))}
        </group>
        <points ref={sparks} geometry={sparkGeo} visible={false}>
          <pointsMaterial color="#ffc65a" size={0.035} transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
      </group>
      {/* arm reaching out with the RAT */}
      <Strut a={[-0.1, 0.5, -0.55]} b={[0, 0.38, -0.85]} r={0.022} color="#b9b6ae" />
      <group ref={bit} position={[0, 0.32, -0.96]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.1, 16]} />
          <meshStandardMaterial color="#c9c4b8" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0.03, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[0.02, 0.11, 0.02]} />
          <meshStandardMaterial color="#3a3d46" />
        </mesh>
      </group>
    </group>
  );
}

function Opportunity() {
  const click = useClickable('oppy');
  return (
    <group position={A.oppy.pos} quaternion={A.oppy.quat}>
      <group {...click}>
        <Suspense fallback={null}>
          <OppyModel />
        </Suspense>
        <RatGrind />
      </group>
      <Tag position={[0.25, 0.85, -1.2]} variant="holo" show={(p) => (since('oppy') > 1.6 ? band(p, 0.66, 0.67, 0.77, 0.79) : 0)}>
        {OPPY.hologram}
      </Tag>
      <Beacon id="oppy" position={[0.25, 0.62, -1.05]} window={[0.67, 0.86]} scale={0.6} />
    </group>
  );
}

useGLTF.preload(MODEL_URL, DRACO_PATH);

export default function MarsScene() {
  return (
    <>
      <Sojourner />
      <Tracks />
      <Opportunity />
    </>
  );
}
