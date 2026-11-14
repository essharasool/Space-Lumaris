import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAMERA_KEYS } from './path';
import { live } from '../lib/store';
import { damp, ramp, smoother } from '../lib/math';

const _m = new THREE.Matrix4();
const _pos = new THREE.Vector3();
const _q = new THREE.Quaternion();
const UP = new THREE.Vector3(0, 1, 0);

/** Flies the camera along CAMERA_KEYS using story progress. Each beat eases in and out. */
export default function CameraRig({ reduced }) {
  const camera = useThree((s) => s.camera);
  const keys = useMemo(
    () => CAMERA_KEYS.map((k) => ({ ...k, quat: new THREE.Quaternion().setFromRotationMatrix(_m.lookAt(k.pos, k.look, UP)) })),
    [],
  );

  useFrame((state, dt) => {
    const p = live.progress;
    let i = 0;
    while (i < keys.length - 2 && p > keys[i + 1].p) i++;
    const a = keys[i];
    const b = keys[i + 1];
    const u = smoother(ramp(p, a.p, b.p));
    _pos.lerpVectors(a.pos, b.pos, u);
    _q.slerpQuaternions(a.quat, b.quat, u);

    // a gentle "floating" sway so the world never feels frozen
    if (!reduced) {
      const t = state.clock.elapsedTime;
      _pos.x += Math.sin(t * 0.37) * 0.04;
      _pos.y += Math.sin(t * 0.53) * 0.03;
    }

    const k = reduced ? 1 : damp(dt, 4.5);
    camera.position.lerp(_pos, k);
    camera.quaternion.slerp(_q, k);

    // portrait phones get a wider lens so the robots still fit
    const fov = state.size.width < state.size.height ? 62 : 45;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });
  return null;
}
