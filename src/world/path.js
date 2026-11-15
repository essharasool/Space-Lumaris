// World layout: where the planets are, what their ground looks like, and the camera's flight plan.
// Every site sits near its planet's north pole, so "landing" always means flying down (+Y is up).
import * as THREE from 'three';
import { fbm, rng } from '../lib/noise';
import { sramp } from '../lib/math';

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const UP = V(0, 1, 0);

// ---------- terrain height functions (local patch coords x/z, around the pole) ----------

const edge = (x, z, P) => 1 - sramp(Math.max(Math.abs(x), Math.abs(z)), P * 0.72, P * 0.97);
const flat = (x, z, [sx, sz], r) => sramp(Math.hypot(x - sx, z - sz), r * 0.35, r);

export const SITE = {
  kid: [0, 0],
  pad: [45, -95],
  surveyor: [0, 0],
  apollo: [24, -17],
  sojourner: [-40, 12],
  lander: [-42.6, 12.8],
  yogi: [-40, 11.2],
  oppy: [45, -25],
};

function earthH(x, z) {
  const r = Math.hypot(x, z);
  const hill = 2.4 * Math.exp(-(r * r) / 140);
  const roll = 3.2 * Math.max(0, fbm(x * 0.012 + 3, z * 0.012 - 2, 4, 11) + 0.2) * sramp(r, 14, 60);
  const small = 0.15 * fbm(x * 0.25, z * 0.25, 2, 5);
  const h = hill + roll * flat(x, z, SITE.pad, 16) + small;
  return 0.25 + h * edge(x, z, 150);
}

const moonCraters = (() => {
  const r = rng(7);
  const out = [{ x: 0, z: 0, r: 15, d: 1.3 }]; // Surveyor 3 sits in a small crater
  for (let i = 0; i < 46; i++) {
    const c = { x: (r() * 2 - 1) * 70, z: (r() * 2 - 1) * 70, r: 1.5 + r() * r() * 11 };
    c.d = c.r * (0.1 + r() * 0.08);
    const nearSite = Math.hypot(c.x, c.z) < c.r + 18 || Math.hypot(c.x - SITE.apollo[0], c.z - SITE.apollo[1]) < c.r + 5;
    if (!nearSite) out.push(c);
  }
  return out;
})();

function moonH(x, z) {
  let h = 0.35 * fbm(x * 0.06, z * 0.06, 4, 3) + 0.06 * fbm(x * 0.6, z * 0.6, 2, 9);
  for (const c of moonCraters) {
    const d = Math.hypot(x - c.x, z - c.z) / c.r;
    if (d < 1.8) h += d < 1 ? -c.d * (1 - d * d) : 0;
    if (d < 1.8) h += c.d * 0.35 * Math.exp(-(((d - 1) / 0.22) ** 2));
  }
  return 0.25 + Math.max(h, -2) * edge(x, z, 80) + 0.3;
}

function marsH(x, z) {
  const base = 0.5 * fbm(x * 0.04, z * 0.04, 4, 21);
  const ares = 1 - sramp(x, -8, 22); // Ares Vallis side: rocky flood plain with valley walls and hills
  const walls = 7 * sramp(Math.abs(z - 12), 24, 48) * (0.75 + 0.25 * fbm(x * 0.08, z * 0.08, 3, 4));
  const peaks = 6 * Math.exp(-((x + 78) ** 2 + (z + 40) ** 2) / 140) + 5 * Math.exp(-((x + 64) ** 2 + (z + 54) ** 2) / 100);
  const meri = sramp(x, -2, 28); // Meridiani side: wide, flat plains with sand ripples
  const ripples = 0.05 * Math.sin(x * 1.3 + z * 0.5 + 3 * fbm(x * 0.05, z * 0.05, 2, 8));
  let h = base * (1 - 0.75 * meri) + ares * (walls + peaks) + meri * ripples;
  h *= flat(x, z, SITE.sojourner, 4) * flat(x, z, SITE.lander, 4) * flat(x, z, SITE.oppy, 5);
  return 0.25 + Math.max(h, -0.6) * edge(x, z, 120) + 0.3;
}

export const PLANETS = {
  earth: { id: 'earth', center: V(0, -400, 0), R: 400, patch: 150, height: earthH },
  moon: { id: 'moon', center: V(-150, 1150, -1700), R: 160, patch: 80, height: moonH },
  mars: { id: 'mars', center: V(250, 2300, -4300), R: 300, patch: 120, height: marsH },
};

// ---------- placing things on a planet ----------

/** point on the planet surface for patch coords (lx, lz), relative to the planet center */
export function surfaceLocal(planet, lx, lz, lift = 0, out = new THREE.Vector3()) {
  out.set(lx, planet.R, lz).normalize();
  return out.multiplyScalar(planet.R + planet.height(lx, lz) + lift);
}

/** world position + "standing up" rotation for a spot on a planet */
export function anchor(planet, [lx, lz], lift = 0) {
  const local = surfaceLocal(planet, lx, lz, lift);
  const quat = new THREE.Quaternion().setFromUnitVectors(UP, local.clone().normalize());
  return { pos: local.add(planet.center), quat };
}

/** offset in an anchor's local frame (x right, y up, z toward the viewer) */
export const rel = (a, x, y, z) => V(x, y, z).applyQuaternion(a.quat).add(a.pos);

export const A = {
  kid: anchor(PLANETS.earth, SITE.kid),
  pad: anchor(PLANETS.earth, SITE.pad),
  surveyor: anchor(PLANETS.moon, SITE.surveyor),
  apollo: anchor(PLANETS.moon, SITE.apollo),
  sojourner: anchor(PLANETS.mars, SITE.sojourner),
  lander: anchor(PLANETS.mars, SITE.lander),
  yogi: anchor(PLANETS.mars, SITE.yogi),
  oppy: anchor(PLANETS.mars, SITE.oppy),
};

const MOON_C = PLANETS.moon.center;
const MARS_C = PLANETS.mars.center;
export const VISTA = { pos: V(6200, 1250, -1500), look: V(60, 1000, -2050) };

// ---------- camera flight plan (p = story progress, see narration.js line ranges) ----------
const K = (p, pos, look) => ({ p, pos, look });
const { kid, pad, surveyor: S, apollo, sojourner: J, oppy: O } = A;

export const CAMERA_KEYS = [
  // Act 0 — Earth (01-intro)
  K(0.0, rel(kid, 1.3, 1.5, 4.0), rel(kid, -0.3, 1.9, -8)),
  K(0.013, rel(kid, 1.1, 1.0, 3.3), rel(kid, 0, 6, -12)), // "Look up at the night sky."
  K(0.043, rel(kid, -1.5, 0.8, 3.2), MOON_C), // "...all the way to the Moon and Mars."
  K(0.061, rel(kid, -2.6, 1.4, 4.6), MOON_C.clone().lerp(MARS_C, 0.5)), // "It looks quiet"
  K(0.112, rel(kid, 3.8, 2.4, 7.0), rel(kid, 0, 1.6, -3)), // relay race tracks
  K(0.15, rel(kid, 2.4, 1.4, 3.2), rel(pad, 0, 8, 0)), // metal, wire and dreams → the launch pad
  K(0.176, rel(kid, 1.4, 2.6, 4.0), rel(pad, 0, 22, 0)), // "...but with a rocket."
  K(0.2, rel(pad, -55, 110, 75), rel(pad, 0, 190, -30)), // lift off, chasing the rocket through the clouds
  // Act 1 — Moon (02-surveyor)
  K(0.226, V(-90, 760, -950), MOON_C),
  K(0.252, rel(S, 30, 45, 45), S.pos),
  K(0.272, rel(S, 4.6, 2.2, 6.8), rel(S, 0, 1.0, 0)), // landed
  K(0.3, rel(S, 6.0, 1.7, 3.6), rel(S, 0.3, 0.9, 0)),
  K(0.33, rel(S, 4.2, 2.0, 3.6), rel(S, 0.9, 0.55, 0.7)), // trench close-up
  K(0.372, rel(S, -3.5, 2.6, 7.5), rel(S, 3, 0.6, -3)), // "seeds of our cosmic garden"
  K(0.402, rel(S, -7, 3.5, 6), rel(apollo, 0, 1, 0)), // Apollo 12 visit
  K(0.42, rel(S, -3, 14, 16), S.pos),
  // Act 2 — Mars, Sojourner (03-sojourner)
  K(0.446, V(120, 1950, -3100), MARS_C),
  K(0.472, rel(J, -22, 45, 55), J.pos),
  K(0.498, rel(J, 1.6, 0.9, 2.6), rel(J, 0, 0.25, 0)), // "Sojourner rolled out"
  K(0.548, rel(J, -1.2, 0.55, 1.6), rel(J, 0, 0.2, 0)), // "no bigger than a microwave"
  K(0.59, rel(J, 1.7, 1.2, 0.5), rel(J, -0.1, -0.15, -0.55)), // APXS scan
  K(0.64, rel(J, 4, 3, 5), rel(J, 12, 0, -6)),
  // Act 3 — Mars, Opportunity (04-oppy)
  K(0.662, rel(O, -16, 7, 12), O.pos),
  K(0.69, rel(O, 3.5, 2.0, -4.6), rel(O, 0, 0.7, 0)), // "bounced onto the red dirt"
  K(0.711, rel(O, 4.0, 4.5, -6.5), rel(O, -1.5, 0, 9)), // 45.16 km of tracks behind it
  K(0.74, rel(O, 1.7, 1.0, -2.6), rel(O, 0.25, 0.35, -1.4)), // RAT on a rock
  K(0.768, rel(O, 4.0, 1.8, 3.2), rel(O, 0, 0.7, 0)), // "even marathon runners need to rest"
  K(0.8, rel(O, 5.0, 2.4, 5.4), rel(O, 0, 1.0, 0)), // dust storm rolls in
  K(0.838, rel(O, 3.0, 1.4, 3.6), rel(O, 0, 0.6, 0)),
  K(0.86, rel(O, 2.0, 0.9, 2.5), rel(O, 0, 0.5, 0)), // "went to sleep in the dust"
  // Act 4 — Monuments (05-outro)
  K(0.892, rel(O, 25, 60, 50), O.pos),
  K(0.935, VISTA.pos, VISTA.look),
  K(1.0, VISTA.pos.clone().add(V(-500, -60, 0)), VISTA.look),
];

// ---------- atmosphere keyframes (sky, fog, light, dust, UI accent) ----------
// Colors are hex strings; Atmosphere.jsx blends between neighbours.
const AK = (p, o) => ({ p, ...o });
const EARTH_DUSK = {
  top: '#0a1033', horizon: '#e08a55', fog: '#3b2f45', fogD: 0.0042,
  sun: '#ffb27a', sunI: 1.4, sunDir: [0.85, 0.12, -0.5], hemiSky: '#5d6aa6', hemiGround: '#2b2a1e', hemiI: 0.7,
  stars: 0.85, dust: '#ffd9b0', dustO: 0.18, env: 0.25, accent: '#f2a65a', earth: 1, moon: 1,
};
const SPACE = {
  top: '#010208', horizon: '#060a16', fog: '#05060c', fogD: 0.0,
  sun: '#fff4e0', sunI: 2.2, sunDir: [0.6, 0.55, 0.58], hemiSky: '#8a8f99', hemiGround: '#111111', hemiI: 0.2,
  stars: 1, dust: '#c9ccd2', dustO: 0.0, env: 0.2, accent: '#c9d3e6', earth: 1, moon: 1,
};
const MOON_SURF = {
  ...SPACE, fog: '#07080c', fogD: 0.0004, sunI: 1.7, hemiI: 0.22, env: 0.12, dustO: 0.22, accent: '#cfd8e8',
};
const MARS_DAY = {
  top: '#b07a55', horizon: '#e2b083', fog: '#c99a72', fogD: 0.011,
  sun: '#ffe3c0', sunI: 1.9, sunDir: [-0.4, 0.7, 0.6], hemiSky: '#e8b48a', hemiGround: '#5a2e1c', hemiI: 0.75,
  stars: 0, dust: '#e0a070', dustO: 0.35, env: 0.45, accent: '#e8804a', earth: 0, moon: 0,
};
const STORM = {
  ...MARS_DAY, top: '#4a2e1a', horizon: '#7a5030', fog: '#6e4628', fogD: 0.07,
  sun: '#a87a50', sunI: 0.35, hemiI: 0.4, dust: '#9a6436', dustO: 0.95, env: 0.2, accent: '#d9a066',
};
const STORM_DARK = {
  ...STORM, top: '#24160c', horizon: '#3e281a', fog: '#36241a', fogD: 0.075, sunI: 0.12, hemiI: 0.22,
};
const OUTRO = {
  ...SPACE, horizon: '#120f26', sun: '#ffd9a0', sunI: 1.8, sunDir: [0.85, 0.35, 0.3], hemiI: 0.3,
  accent: '#f4c46a', earth: 1, moon: 1,
};

export const ATMOS_KEYS = [
  AK(0.0, EARTH_DUSK),
  AK(0.15, EARTH_DUSK),
  AK(0.188, { ...EARTH_DUSK, top: '#101738', horizon: '#90a0c8', fog: '#657aa8', fogD: 0.0025, stars: 0.8 }),
  AK(0.206, { ...SPACE, top: '#050718', horizon: '#0c1228', fog: '#060a18', fogD: 0.0004, stars: 1.0 }),
  AK(0.218, SPACE),
  AK(0.248, SPACE),
  AK(0.268, MOON_SURF),
  AK(0.418, MOON_SURF),
  AK(0.44, SPACE),
  AK(0.462, { ...SPACE, earth: 0, moon: 0 }),
  AK(0.49, MARS_DAY),
  AK(0.64, MARS_DAY),
  AK(0.672, { ...MARS_DAY, horizon: '#e8ba8c', fogD: 0.009 }),
  AK(0.768, { ...MARS_DAY, horizon: '#e8ba8c', fogD: 0.009 }),
  AK(0.8, STORM),
  AK(0.855, STORM_DARK),
  AK(0.875, { ...STORM, fogD: 0.03 }),
  AK(0.905, { ...OUTRO, earth: 1, moon: 1 }),
  AK(1.0, OUTRO),
];

/** how strong the dust storm is (Oppy panels, swirl, telemetry) */
export const stormAt = (p) => sramp(p, 0.768, 0.8) * (1 - sramp(p, 0.862, 0.895));
