import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_KEYS } from './path';
import { live } from '../lib/store';
import { damp, ramp, smoother } from '../lib/math';

const _m = new THREE.Matrix4();
const _pos = new THREE.Vector3();
const _q = new THREE.Quaternion();
const UP = new THREE.Vector3(0, 1, 0);
const _look = new THREE.Quaternion();
const _eul = new THREE.Euler();

// shared mouse state — updated by DOM listener, read in useFrame
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

/** Flies the camera along CAMERA_KEYS using story progress + mouse parallax look-around. */
export default function CameraRig({ reduced }) {
  const camera = useThree((s) => s.camera);
  const keys = useMemo(
    () => CAMERA_KEYS.map((k) => ({ ...k, quat: new THREE.Quaternion().setFromRotationMatrix(_m.lookAt(k.pos, k.look, UP)) })),
    [],
  );

  // only wire mouse on devices with a hover pointer (not touch)
  const hasHover = useMemo(() => window.matchMedia('(hover: hover)').matches, []);
  const base = useRef(null);
  if (!base.current) base.current = { pos: camera.position.clone(), quat: camera.quaternion.clone() };

  useEffect(() => {
    if (reduced || !hasHover) return;
    const onMove = (e) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced, hasHover]);

  useFrame((state, dt) => {
    const p = live.progress;
    let i = 0;
    while (i < keys.length - 2 && p > keys[i + 1].p) i++;
    const a = keys[i];
    const b = keys[i + 1];
    const u = smoother(ramp(p, a.p, b.p));
    _pos.lerpVectors(a.pos, b.pos, u);
    _q.slerpQuaternions(a.quat, b.quat, u);

    // gentle floating sway
    if (!reduced) {
      const t = state.clock.elapsedTime;
      _pos.x += Math.sin(t * 0.37) * 0.04;
      _pos.y += Math.sin(t * 0.53) * 0.03;
    }

    // ease a "base" pose toward the story beat (kept separate so mouse-look never piles up)
    const k = reduced ? 1 : damp(dt, 4.5);
    base.current.pos.lerp(_pos, k);
    base.current.quat.slerp(_q, k);
    camera.position.copy(base.current.pos);
    camera.quaternion.copy(base.current.quat);

    // mouse-look: turn the head a little (yaw/pitch in camera space) on top of the story beat
    if (!reduced && hasHover) {
      const s = Math.min(1, dt * 3.5);
      mouse.x += (mouse.tx - mouse.x) * s;
      mouse.y += (mouse.ty - mouse.y) * s;
      _look.setFromEuler(_eul.set(mouse.y * 0.1, -mouse.x * 0.18, 0, 'YXZ'));
      camera.quaternion.multiply(_look);
    }

    // portrait phones get a wider lens so the robots still fit
    const fov = state.size.width < state.size.height ? 62 : 45;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
}
