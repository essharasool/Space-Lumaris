import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { surfaceLocal } from './path';
import { live } from '../lib/store';
import { rng } from '../lib/noise';

/** curved, bumpy ground patch that sits exactly on the planet sphere around its north pole */
function buildPatch(planet, colorAt, segments) {
  const P = planet.patch;
  const g = new THREE.PlaneGeometry(P * 2, P * 2, segments, segments);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const v = new THREE.Vector3();
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    surfaceLocal(planet, x, z, 0, v);
    pos.setXYZ(i, v.x, v.y, v.z);
    colorAt(x, z, planet.height(x, z), c);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}

const glowVert = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
varying vec3 vN;
varying vec3 vP;
void main() {
  vN = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vP = mv.xyz;
  gl_Position = projectionMatrix * mv;
  #include <logdepthbuf_vertex>
}`;
const glowFrag = /* glsl */ `
#include <logdepthbuf_pars_fragment>
uniform vec3 color;
uniform float opacity;
varying vec3 vN;
varying vec3 vP;
void main() {
  #include <logdepthbuf_fragment>
  float f = pow(clamp(1.0 - abs(dot(normalize(vN), normalize(-vP))), 0.0, 1.0), 2.5);
  gl_FragColor = vec4(color * f * opacity, 1.0);
}`;

function Glow({ R, color, strength = 0.9 }) {
  const uniforms = useMemo(
    () => ({ color: { value: new THREE.Color(color) }, opacity: { value: strength } }),
    [color, strength],
  );
  return (
    <mesh scale={R * 1.07}>
      <sphereGeometry args={[1, 64, 32]} />
      <shaderMaterial
        vertexShader={glowVert}
        fragmentShader={glowFrag}
        uniforms={uniforms}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

/** scattered rocks (one draw call) */
function Rocks({ planet, count, seed, pick, size, colors }) {
  const ref = useRef();
  const geo = useMemo(() => new THREE.DodecahedronGeometry(1, 0), []);
  useLayoutEffect(() => {
    const r = rng(seed);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const e = new THREE.Euler();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    const c = new THREE.Color();
    let n = 0;
    for (let tries = 0; n < count && tries < count * 20; tries++) {
      const xz = pick(r);
      if (!xz) continue;
      const k = size[0] + (size[1] - size[0]) * r() ** 2.2;
      surfaceLocal(planet, xz[0], xz[1], k * 0.25, p);
      e.set(r() * 6, r() * 6, r() * 6);
      q.setFromEuler(e);
      s.set(k * (0.8 + r() * 0.6), k * (0.45 + r() * 0.35), k * (0.8 + r() * 0.5));
      m.compose(p, q, s);
      ref.current.setMatrixAt(n, m);
      ref.current.setColorAt(n, c.set(colors[Math.floor(r() * colors.length)]));
      n++;
    }
    ref.current.count = n;
    ref.current.instanceMatrix.needsUpdate = true;
    if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
  }, [planet, count, seed, pick, size, colors]);
  return (
    <instancedMesh ref={ref} args={[geo, undefined, count]} frustumCulled={false}>
      <meshStandardMaterial roughness={0.95} flatShading />
    </instancedMesh>
  );
}

/**
 * A planet: textured sphere + detailed ground patch + optional glow + rocks.
 * `visibleKey` fades the whole planet (e.g. hide Earth and Moon while standing on Mars).
 */
export default function Planet({ planet, map, color = '#ffffff', glow, patchColor, segments = 160, rocks, visibleKey }) {
  const group = useRef();
  const sphereMat = useRef();
  const patch = useMemo(() => buildPatch(planet, patchColor, segments), [planet, patchColor, segments]);

  useFrame(() => {
    const o = visibleKey ? live.atmo[visibleKey] : 1;
    group.current.visible = o > 0.01;
    sphereMat.current.opacity = o;
  });

  return (
    <group ref={group} position={planet.center}>
      <mesh>
        <sphereGeometry args={[planet.R, 96, 64]} />
        <meshStandardMaterial ref={sphereMat} map={map} color={color} roughness={1} transparent fog={false} />
      </mesh>
      <mesh geometry={patch}>
        <meshStandardMaterial vertexColors roughness={0.96} />
      </mesh>
      {glow && <Glow R={planet.R} color={glow} />}
      {rocks && <Rocks planet={planet} {...rocks} />}
    </group>
  );
}
