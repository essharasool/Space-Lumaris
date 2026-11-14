import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { live, discover } from '../lib/store';
import { band } from '../lib/math';
import { ring, softDot } from './textures';

const UP = new THREE.Vector3(0, 1, 0);

/** a thin rod between two points */
export function Strut({ a, b, r = 0.025, color = '#b9b6ae', metalness = 0.6 }) {
  const { pos, quat, len } = useMemo(() => {
    const va = new THREE.Vector3(...a);
    const vb = new THREE.Vector3(...b);
    const d = vb.clone().sub(va);
    return {
      pos: va.clone().add(vb).multiplyScalar(0.5),
      quat: new THREE.Quaternion().setFromUnitVectors(UP, d.clone().normalize()),
      len: d.length(),
    };
  }, [a, b]);
  return (
    <mesh position={pos} quaternion={quat}>
      <cylinderGeometry args={[r, r, len, 8]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={0.45} />
    </mesh>
  );
}

/** pointer props that make any group tappable (ignores scroll-drags) */
export function useClickable(id) {
  return useMemo(
    () => ({
      onClick: (e) => {
        if (e.delta > 10) return;
        e.stopPropagation();
        discover(id);
      },
      onPointerOver: (e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      },
      onPointerOut: () => {
        document.body.style.cursor = '';
      },
    }),
    [id],
  );
}

/** pulsing discovery beacon — tap it (or the robot) to start the interaction */
export function Beacon({ id, position, window: [p0, p1], scale = 1 }) {
  const group = useRef();
  const ringRef = useRef();
  const core = useRef();
  const click = useClickable(id);
  useFrame((state) => {
    const vis = band(live.progress, p0, p0 + 0.01, p1 - 0.01, p1);
    group.current.visible = vis > 0.01;
    if (!group.current.visible) return;
    const t = state.clock.elapsedTime;
    const found = live.fx[id] !== undefined;
    const pulse = (t * 0.8) % 1;
    ringRef.current.scale.setScalar(scale * (0.3 + pulse * 0.9));
    ringRef.current.material.opacity = vis * (1 - pulse) * (found ? 0.35 : 0.9);
    core.current.material.opacity = vis * (found ? 0.4 : 0.85 + Math.sin(t * 4) * 0.15);
  });
  return (
    <group ref={group} position={position} {...click}>
      <sprite ref={ringRef}>
        <spriteMaterial map={ring()} color="#ffe2b0" transparent depthWrite={false} depthTest={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite ref={core} scale={0.28 * scale}>
        <spriteMaterial map={softDot()} color="#ffd38a" transparent depthWrite={false} depthTest={false} blending={THREE.AdditiveBlending} />
      </sprite>
      {/* bigger invisible hit target for small fingers */}
      <mesh>
        <sphereGeometry args={[0.35 * scale, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/**
 * Floating 3D-anchored label. `show(p, t)` returns 0..1 opacity each frame.
 * Rendered as real DOM text (crisp, readable, translatable).
 */
export function Tag({ position, show, children, variant = 'tag', nudge = '' }) {
  const el = useRef();
  useFrame((state) => {
    if (!el.current) return;
    const o = show(live.progress, state.clock.elapsedTime);
    el.current.style.opacity = o.toFixed(3);
    el.current.style.transform = `translate3d(0, ${((1 - o) * 10).toFixed(1)}px, 0)`;
  });
  return (
    <Html position={position} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
      <div className={nudge ? `world-nudge world-nudge--${nudge}` : undefined}>
        <div ref={el} className={variant === 'holo' ? 'world-holo' : 'world-tag'} style={{ opacity: 0 }}>
          {children}
        </div>
      </div>
    </Html>
  );
}

/** seconds since a discovery was triggered (or -1) */
export const since = (id) => (live.fx[id] === undefined ? -1 : performance.now() / 1000 - live.fx[id]);
