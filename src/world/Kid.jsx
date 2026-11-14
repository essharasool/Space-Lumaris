import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { A } from './path';
import { live } from '../lib/store';
import { band, damp, lerp, sramp } from '../lib/math';
import { softDot } from './textures';

const SUIT = '#f1ece2';
const TRIM = '#e8804a';
const DARK = '#3a3d46';
const VISOR = '#d9a441';

/** the golden relay baton — the hero prop of the whole story */
export function Baton({ glow = 1, ...props }) {
  return (
    <group {...props}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.42, 16]} />
        <meshStandardMaterial color="#ffcf5a" emissive="#ffb43a" emissiveIntensity={1.6 * glow} metalness={0.6} roughness={0.25} />
      </mesh>
      {[-0.19, 0.19].map((z) => (
        <mesh key={z} position={[0, 0, z]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.042, 0.042, 0.04, 16]} />
          <meshStandardMaterial color="#fff2c8" emissive="#ffd27a" emissiveIntensity={1.2 * glow} />
        </mesh>
      ))}
      <sprite scale={0.9 * glow + 0.01}>
        <spriteMaterial map={softDot()} color="#ffc65a" transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}

function Limb({ length, radius, color }) {
  return (
    <mesh position={[0, -length / 2, 0]}>
      <capsuleGeometry args={[radius, length, 6, 12]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  );
}

const _pos = new THREE.Vector3();
const _q = new THREE.Quaternion();
const _qa = new THREE.Quaternion();
const _off = new THREE.Vector3();
const _e = new THREE.Euler();
const HILL_Q = A.kid.quat.clone();
const FACE_CAMERA = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI * 0.92);

/**
 * Stylized kid explorer (about 1.2 units tall). Faces -Z, so from behind we see the backpack.
 * The mirrored gold visor means a face is never visible (Space Apps under-18 rule).
 * Stands on the hill (Act 0), flies beside the camera between worlds, and offers the baton in the outro.
 */
export default function Kid({ reduced }) {
  const root = useRef();
  const body = useRef();
  const head = useRef();
  const armL = useRef();
  const armR = useRef();
  const camera = useThree((s) => s.camera);

  useFrame((state, dt) => {
    const p = live.progress;
    const t = state.clock.elapsedTime;
    const wHill = 1 - sramp(p, 0.178, 0.2);
    const wFly = band(p, 0.178, 0.2, 0.244, 0.258) + band(p, 0.414, 0.43, 0.462, 0.476);
    const wOutro = sramp(p, 0.89, 0.93);
    const show = Math.min(1, wHill + wFly + wOutro);
    root.current.visible = show > 0.01;
    if (!root.current.visible) return;

    // 1. where is the kid?
    const bob = reduced ? 0 : Math.sin(t * 1.6) * 0.06;
    if (wHill > 0.999) {
      _pos.copy(A.kid.pos);
      _q.copy(HILL_Q);
    } else {
      // camera-relative spot (flying beside us / standing in front of us)
      const outro = wOutro > 0.01;
      const aspect = state.size.width / state.size.height;
      _off.set(outro ? (aspect < 1 ? 0.2 : 0.9) : aspect < 1 ? 0.35 : 1.0, outro ? -0.75 : -0.45 + bob, outro ? -3.2 : -3.4);
      _off.applyQuaternion(camera.quaternion).add(camera.position);
      _qa.copy(camera.quaternion);
      if (outro) _qa.multiply(FACE_CAMERA);
      if (wHill > 0.001) {
        _pos.lerpVectors(A.kid.pos, _off, 1 - wHill);
        _q.slerpQuaternions(HILL_Q, _qa, 1 - wHill);
      } else {
        _pos.copy(_off);
        _q.copy(_qa);
      }
    }
    const k = reduced ? 1 : damp(dt, 8);
    root.current.position.lerp(_pos, k);
    root.current.quaternion.slerp(_q, k);
    root.current.scale.setScalar(Math.max(0.001, show) * (wHill > 0.5 ? 1 : 0.55));

    // 2. pose: look up at the sky → fly like a superhero → hold the baton out
    const lookUp = band(p, 0.0, 0.012, 0.1, 0.14);
    const point = band(p, 0.014, 0.022, 0.055, 0.065);
    const fly = Math.min(1, wFly);
    body.current.rotation.x = lerp(0, -1.15, fly);
    head.current.rotation.x = 0.45 * lookUp + 0.35 * fly - 0.1 * wOutro + (reduced ? 0 : Math.sin(t * 0.8) * 0.03);
    head.current.rotation.y = reduced ? 0 : Math.sin(t * 0.45) * 0.12 * (1 - fly);
    armL.current.rotation.x = 2.5 * point + 0.25 * fly + (reduced ? 0 : Math.sin(t * 2) * 0.05);
    armL.current.rotation.z = 0.12 + 0.2 * fly;
    _e.set(lerp(0.35, 2.9, fly) * (1 - wOutro) + 1.45 * wOutro, 0, -0.15 - 0.1 * fly);
    armR.current.rotation.copy(_e);
  });

  return (
    <group ref={root} visible={false}>
      <group ref={body} position={[0, 0.55, 0]}>
        <group position={[0, -0.55, 0]}>
          {/* boots + legs */}
          {[-0.1, 0.1].map((x) => (
            <group key={x} position={[x, 0.42, 0]}>
              <Limb length={0.24} radius={0.085} color={SUIT} />
              <mesh position={[0, -0.36, -0.03]}>
                <capsuleGeometry args={[0.08, 0.06, 4, 10]} />
                <meshStandardMaterial color={DARK} roughness={0.8} />
              </mesh>
            </group>
          ))}
          {/* torso */}
          <mesh position={[0, 0.62, 0]}>
            <capsuleGeometry args={[0.2, 0.2, 6, 16]} />
            <meshStandardMaterial color={SUIT} roughness={0.75} />
          </mesh>
          <mesh position={[0, 0.55, 0]}>
            <cylinderGeometry args={[0.207, 0.207, 0.05, 24]} />
            <meshStandardMaterial color={TRIM} roughness={0.6} />
          </mesh>
          {/* backpack (what we usually see) */}
          <mesh position={[0, 0.66, 0.2]}>
            <boxGeometry args={[0.34, 0.38, 0.16]} />
            <meshStandardMaterial color="#d9d4ca" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.7, 0.285]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.012, 20]} />
            <meshStandardMaterial color={TRIM} roughness={0.5} />
          </mesh>
          {/* helmet with mirrored gold visor (front = -Z) */}
          <group ref={head} position={[0, 0.98, 0]}>
            <mesh>
              <sphereGeometry args={[0.27, 32, 24]} />
              <meshStandardMaterial color={SUIT} roughness={0.35} metalness={0.1} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.278, 32, 24, Math.PI * 1.5 - 0.95, 1.9, 0.75, 1.15]} />
              <meshStandardMaterial color={VISOR} metalness={1} roughness={0.12} envMapIntensity={2.5} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0.1, 0.27, 0.05]}>
              <cylinderGeometry args={[0.008, 0.008, 0.14, 6]} />
              <meshStandardMaterial color={DARK} />
            </mesh>
            <mesh position={[0.1, 0.35, 0.05]}>
              <sphereGeometry args={[0.03, 12, 8]} />
              <meshStandardMaterial color={TRIM} emissive={TRIM} emissiveIntensity={0.6} />
            </mesh>
          </group>
          {/* arms (pivot at the shoulder) */}
          <group ref={armL} position={[-0.27, 0.74, 0]}>
            <Limb length={0.26} radius={0.068} color={SUIT} />
            <mesh position={[0, -0.36, 0]}>
              <sphereGeometry args={[0.075, 12, 10]} />
              <meshStandardMaterial color={DARK} />
            </mesh>
          </group>
          <group ref={armR} position={[0.27, 0.74, 0]}>
            <Limb length={0.26} radius={0.068} color={SUIT} />
            <mesh position={[0, -0.36, 0]}>
              <sphereGeometry args={[0.075, 12, 10]} />
              <meshStandardMaterial color={DARK} />
            </mesh>
            <Baton position={[0, -0.4, -0.06]} />
          </group>
        </group>
      </group>
    </group>
  );
}
