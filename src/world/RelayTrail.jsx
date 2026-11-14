import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { A, VISTA, rel } from './path';
import { story } from '../data/missions';
import { live } from '../lib/store';
import { band, sramp } from '../lib/math';
import { Tag } from './parts';
import { softDot } from './textures';

const vert = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  #include <logdepthbuf_vertex>
}`;
const frag = /* glsl */ `
#include <logdepthbuf_pars_fragment>
uniform float progress;
uniform float time;
uniform float opacity;
uniform vec3 color;
varying vec2 vUv;
void main() {
  #include <logdepthbuf_fragment>
  if (vUv.x > progress) discard;
  float dash = smoothstep(0.35, 0.5, fract(vUv.x * 90.0 - time * 0.6)) * 0.6 + 0.4;
  float head = smoothstep(0.03, 0.0, progress - vUv.x) * 1.5;
  gl_FragColor = vec4(color * (dash + head) * opacity, 1.0);
}`;

const SITES = { surveyor: A.surveyor, sojourner: A.sojourner, oppy: A.oppy };

/** the glowing relay route linking Earth → Surveyor 3 → Sojourner → Opportunity → you */
export default function RelayTrail() {
  const group = useRef();
  const glows = useRef([]);
  const trail = useRef();
  const uniforms = useMemo(
    () => ({ progress: { value: 0 }, time: { value: 0 }, opacity: { value: 0 }, color: { value: new THREE.Color('#ffc65a') } }),
    [],
  );
  const { geo, points } = useMemo(() => {
    const toward = VISTA.look.clone().sub(VISTA.pos).normalize();
    const end = VISTA.pos.clone().addScaledVector(toward, 60).add(new THREE.Vector3(0, -14, 0));
    const pts = [
      rel(A.kid, 0, 3, 0),
      new THREE.Vector3(-60, 700, -900),
      rel(A.surveyor, 0, 3, 0),
      new THREE.Vector3(80, 1900, -3000),
      rel(A.sojourner, 0, 3, 0),
      rel(A.oppy, 0, 3, 0),
      new THREE.Vector3(2200, 2100, -2600),
      end,
    ];
    const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
    return { geo: new THREE.TubeGeometry(curve, 900, 16, 6, false), points: pts };
  }, []);

  useFrame((state) => {
    const p = live.progress;
    const show = sramp(p, 0.895, 0.915);
    group.current.visible = show > 0.01;
    if (!group.current.visible) return;
    const u = trail.current.material.uniforms; // write through the material (R3F keeps its own uniform objects)
    u.progress.value = sramp(p, 0.905, 0.975);
    u.time.value = state.clock.elapsedTime;
    u.opacity.value = show * 0.9;
    glows.current.forEach((g, i) => {
      if (!g) return;
      const pulse = 0.9 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.1;
      g.material.opacity = show * pulse;
    });
  });

  return (
    <group ref={group} visible={false}>
      <mesh ref={trail} geometry={geo} frustumCulled={false}>
        <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent blending={THREE.AdditiveBlending} depthWrite={false} fog={false} />
      </mesh>
      {/* each monument becomes a star in the constellation */}
      {story.outro.monuments.map((m, i) => (
        <group key={m.id} position={rel(SITES[m.id], 0, 3, 0)}>
          <sprite ref={(s) => (glows.current[i] = s)} scale={[0.09, 0.09, 1]}>
            <spriteMaterial map={softDot()} color="#ffd890" sizeAttenuation={false} transparent depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
          </sprite>
          <Tag position={[0, 0, 0]} variant="monument" nudge={['up', 'left', 'down'][i]} show={(p) => band(p, 0.915 + i * 0.012, 0.93 + i * 0.012, 2, 3)}>
            {m.label}
          </Tag>
        </group>
      ))}
      <group position={points[0]}>
        <sprite scale={[0.05, 0.05, 1]}>
          <spriteMaterial map={softDot()} color="#bfe0ff" sizeAttenuation={false} transparent depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
        </sprite>
      </group>
    </group>
  );
}
