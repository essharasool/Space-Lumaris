import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ATMOS_KEYS, A, stormAt } from './path';
import { live } from '../lib/store';
import { ramp, smooth } from '../lib/math';
import { rng } from '../lib/noise';
import { puff } from './textures';

// ---------- keyframe sampling ----------
const COLORS = ['top', 'horizon', 'fog', 'sun', 'hemiSky', 'hemiGround', 'dust', 'accent'];
const NUMS = ['fogD', 'sunI', 'hemiI', 'stars', 'dustO', 'env', 'earth', 'moon'];
const KEYS = ATMOS_KEYS.map((k) => {
  const o = { p: k.p, sunDir: new THREE.Vector3(...k.sunDir).normalize() };
  COLORS.forEach((c) => (o[c] = new THREE.Color(k[c])));
  NUMS.forEach((n) => (o[n] = k[n]));
  return o;
});
const cur = { sunDir: new THREE.Vector3() };
COLORS.forEach((c) => (cur[c] = new THREE.Color()));

function sample(p) {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i++;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const u = smooth(ramp(p, a.p, b.p));
  COLORS.forEach((c) => cur[c].lerpColors(a[c], b[c], u));
  NUMS.forEach((n) => (cur[n] = a[n] + (b[n] - a[n]) * u));
  cur.sunDir.lerpVectors(a.sunDir, b.sunDir, u).normalize();
  return cur;
}

// ---------- shaders ----------
const skyVert = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`;
const skyFrag = /* glsl */ `
uniform vec3 top;
uniform vec3 horizon;
uniform vec3 sunColor;
uniform vec3 sunDir;
varying vec3 vDir;
void main() {
  vec3 d = normalize(vDir);
  vec3 c = mix(horizon, top, smoothstep(-0.04, 0.38, d.y));
  float s = max(dot(d, sunDir), 0.0);
  c += sunColor * (pow(s, 28.0) * 0.55 + pow(s, 4.0) * 0.08);
  gl_FragColor = vec4(c, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const starVert = /* glsl */ `
attribute float size;
attribute float phase;
attribute vec3 tint;
uniform float time;
uniform float opacity;
uniform float pr;
varying float vA;
varying vec3 vTint;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = size * pr;
  vA = opacity * (0.7 + 0.3 * sin(time * 1.3 + phase));
  vTint = tint;
}`;
const starFrag = /* glsl */ `
varying float vA;
varying vec3 vTint;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vTint * a * vA, 1.0);
}`;

const dustVert = /* glsl */ `
#include <common>
#include <logdepthbuf_pars_vertex>
attribute float seed;
uniform float time;
uniform float box;
uniform float size;
uniform float swirl;
uniform vec3 cam;
uniform vec3 wind;
varying float vFade;
void main() {
  vec3 p = position + wind * time;
  p += vec3(sin(time * 0.7 + seed * 40.0), cos(time * 0.5 + seed * 30.0) * 0.4, cos(time * 0.6 + seed * 50.0)) * swirl;
  p = mod(p - cam + box * 0.5, box) - box * 0.5 + cam;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = size * (0.5 + seed) * (20.0 / max(0.5, -mv.z));
  vFade = smoothstep(box * 0.5, box * 0.25, length(p - cam));
  #include <logdepthbuf_vertex>
}`;
const dustFrag = /* glsl */ `
#include <logdepthbuf_pars_fragment>
uniform vec3 color;
uniform float opacity;
varying float vFade;
void main() {
  #include <logdepthbuf_fragment>
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.1, d) * opacity * vFade;
  gl_FragColor = vec4(color, a);
  #include <colorspace_fragment>
}`;

function useStars() {
  return useMemo(() => {
    const n = 2600;
    const r = rng(12);
    const pos = new Float32Array(n * 3);
    const size = new Float32Array(n);
    const phase = new Float32Array(n);
    const tint = new Float32Array(n * 3);
    const v = new THREE.Vector3();
    const warm = new THREE.Color('#ffe2c0');
    const cool = new THREE.Color('#cfe0ff');
    const c = new THREE.Color();
    for (let i = 0; i < n; i++) {
      v.set(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1);
      if (v.lengthSq() > 1 || v.lengthSq() < 0.01) {
        i--;
        continue;
      }
      v.normalize().multiplyScalar(9000);
      pos.set([v.x, v.y, v.z], i * 3);
      size[i] = 0.8 + r() ** 6 * 3.2;
      phase[i] = r() * 30;
      c.lerpColors(cool, warm, r());
      tint.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('size', new THREE.BufferAttribute(size, 1));
    g.setAttribute('phase', new THREE.BufferAttribute(phase, 1));
    g.setAttribute('tint', new THREE.BufferAttribute(tint, 3));
    return g;
  }, []);
}

function useDust(count) {
  return useMemo(() => {
    const r = rng(99);
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos.set([(r() - 0.5) * 40, (r() - 0.5) * 40, (r() - 0.5) * 40], i * 3);
      seed[i] = r();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('seed', new THREE.BufferAttribute(seed, 1));
    return g;
  }, [count]);
}

/** brown dust clouds that roll in around Oppy during the storm */
function StormClouds() {
  const spin = useRef();
  const mats = useRef([]);
  const items = useMemo(() => {
    const r = rng(5);
    return Array.from({ length: 28 }, () => {
      const a = r() * Math.PI * 2;
      const d = 7 + r() * 38;
      return { pos: [Math.cos(a) * d, 1 + r() * 12, Math.sin(a) * d], s: 12 + r() * 22, o: 0.5 + r() * 0.5 };
    });
  }, []);
  useFrame((_, dt) => {
    const s = live.atmo.storm;
    spin.current.parent.visible = s > 0.01;
    spin.current.rotation.y += dt * (0.03 + 0.12 * s);
    mats.current.forEach((m, i) => {
      m.opacity = s * 0.8 * items[i].o;
      m.color.copy(cur.dust);
    });
  });
  return (
    <group position={A.oppy.pos} quaternion={A.oppy.quat}>
      <group ref={spin}>
        {items.map((it, i) => (
          <sprite key={i} position={it.pos} scale={[it.s, it.s * 0.6, 1]}>
            <spriteMaterial ref={(m) => (mats.current[i] = m)} map={puff()} transparent depthWrite={false} />
          </sprite>
        ))}
      </group>
    </group>
  );
}

export default function Atmosphere({ reduced }) {
  const { scene, gl, camera } = useThree();
  const sky = useRef();
  const stars = useRef();
  const dust = useRef();
  const hemi = useRef();
  const sun = useRef();
  const frame = useRef(0);
  const starGeo = useStars();
  const dustGeo = useDust(reduced ? 0 : 1400);

  const skyU = useMemo(
    () => ({ top: { value: new THREE.Color() }, horizon: { value: new THREE.Color() }, sunColor: { value: new THREE.Color() }, sunDir: { value: new THREE.Vector3() } }),
    [],
  );
  const starU = useMemo(() => ({ time: { value: 0 }, opacity: { value: 1 }, pr: { value: 1 } }), []);
  const dustU = useMemo(
    () => ({
      time: { value: 0 }, box: { value: 40 }, size: { value: 2.2 }, swirl: { value: 0 },
      cam: { value: new THREE.Vector3() }, wind: { value: new THREE.Vector3(0.3, 0.02, 0.1) },
      color: { value: new THREE.Color() }, opacity: { value: 0 },
    }),
    [],
  );

  useEffect(() => {
    scene.fog = new THREE.FogExp2('#000000', 0);
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.fog = null;
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [scene, gl]);

  useFrame((state) => {
    const p = live.progress;
    const c = sample(p);
    const t = state.clock.elapsedTime;
    const storm = stormAt(p);
    live.atmo.earth = c.earth;
    live.atmo.moon = c.moon;
    live.atmo.storm = storm;

    // R3F gives each material its own uniform objects: always write through material.uniforms
    const sk = sky.current.material.uniforms;
    sk.top.value.copy(c.top);
    sk.horizon.value.copy(c.horizon);
    sk.sunColor.value.copy(c.sun).multiplyScalar(Math.min(1, c.sunI / 2));
    sk.sunDir.value.copy(c.sunDir);
    sky.current.position.copy(camera.position);
    stars.current.position.copy(camera.position);
    const st = stars.current.material.uniforms;
    st.time.value = t;
    st.opacity.value = c.stars;
    st.pr.value = state.viewport.dpr;
    stars.current.visible = c.stars > 0.01;

    if (scene.fog) {
      scene.fog.color.copy(c.fog);
      scene.fog.density = c.fogD;
    }
    scene.environmentIntensity = c.env;
    hemi.current.color.copy(c.hemiSky);
    hemi.current.groundColor.copy(c.hemiGround);
    hemi.current.intensity = c.hemiI;
    sun.current.color.copy(c.sun);
    sun.current.intensity = c.sunI;
    sun.current.position.copy(c.sunDir).multiplyScalar(100);

    if (dust.current) {
      const du = dust.current.material.uniforms;
      du.time.value = t;
      du.cam.value.copy(camera.position);
      du.color.value.copy(c.dust);
      du.opacity.value = c.dustO;
      du.swirl.value = 0.6 + storm * 5;
      du.size.value = 2 + storm * 3;
      du.wind.value.set(0.3 + storm * 5, 0.02, 0.1 + storm * 2.5);
      dust.current.visible = c.dustO > 0.01;
    }

    // the page UI borrows the scene's accent color (a few times a second is plenty)
    if (frame.current++ % 8 === 0) document.documentElement.style.setProperty('--accent', `#${c.accent.getHexString()}`);
  });

  return (
    <>
      <mesh ref={sky} renderOrder={-10} frustumCulled={false}>
        <sphereGeometry args={[9500, 32, 16]} />
        <shaderMaterial vertexShader={skyVert} fragmentShader={skyFrag} uniforms={skyU} side={THREE.BackSide} depthWrite={false} depthTest={false} fog={false} />
      </mesh>
      <points ref={stars} geometry={starGeo} renderOrder={-9} frustumCulled={false}>
        <shaderMaterial vertexShader={starVert} fragmentShader={starFrag} uniforms={starU} blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false} fog={false} />
      </points>
      {!reduced && (
        <points ref={dust} geometry={dustGeo} frustumCulled={false}>
          <shaderMaterial vertexShader={dustVert} fragmentShader={dustFrag} uniforms={dustU} transparent depthWrite={false} fog={false} />
        </points>
      )}
      <hemisphereLight ref={hemi} />
      <directionalLight ref={sun} />
      <StormClouds />
    </>
  );
}

export { cur as atmosphereNow };
