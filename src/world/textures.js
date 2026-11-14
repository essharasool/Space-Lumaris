// Small textures drawn in code (no downloads): glows, clouds, rings, solar cells, planet maps.
import * as THREE from 'three';
import { fbm, rng } from '../lib/noise';

function canvasTexture(w, h, draw, srgb = true) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const cache = {};
const once = (key, make) => (cache[key] ??= make());

/** soft round glow */
export const softDot = () =>
  once('dot', () =>
    canvasTexture(64, 64, (ctx) => {
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(0.3, 'rgba(255,255,255,0.55)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    }),
  );

/** fluffy cloud / dust puff */
export const puff = () =>
  once('puff', () =>
    canvasTexture(128, 128, (ctx) => {
      const r = rng(4);
      for (let i = 0; i < 22; i++) {
        const x = 64 + (r() - 0.5) * 60;
        const y = 64 + (r() - 0.5) * 40;
        const rad = 14 + r() * 26;
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, 'rgba(255,255,255,0.32)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 128, 128);
      }
    }),
  );

/** thin ring for beacons */
export const ring = () =>
  once('ring', () =>
    canvasTexture(128, 128, (ctx) => {
      ctx.strokeStyle = 'rgba(255,255,255,1)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(64, 64, 52, 0, Math.PI * 2);
      ctx.stroke();
      const g = ctx.createRadialGradient(64, 64, 40, 64, 64, 62);
      g.addColorStop(0, 'rgba(255,255,255,0)');
      g.addColorStop(0.7, 'rgba(255,255,255,0.35)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    }),
  );

/** solar cells: dark blue with a fine grid */
export const solarCells = () =>
  once('solar', () => {
    const t = canvasTexture(128, 128, (ctx) => {
      ctx.fillStyle = '#1d2a55';
      ctx.fillRect(0, 0, 128, 128);
      ctx.strokeStyle = 'rgba(160,180,230,0.35)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i <= 128; i += 16) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 128);
        ctx.moveTo(0, i);
        ctx.lineTo(128, i);
        ctx.stroke();
      }
    });
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  });

/** equirectangular planet map from a color function of a point on the unit sphere */
function planetMap(w, h, colorAt) {
  return canvasTexture(w, h, (ctx) => {
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      const lat = (0.5 - y / h) * Math.PI;
      for (let x = 0; x < w; x++) {
        const lon = (x / w) * Math.PI * 2;
        const X = Math.cos(lat) * Math.cos(lon);
        const Y = Math.sin(lat);
        const Z = Math.cos(lat) * Math.sin(lon);
        const [r, g, b] = colorAt(X, Y, Z, lat);
        const i = (y * w + x) * 4;
        img.data[i] = r;
        img.data[i + 1] = g;
        img.data[i + 2] = b;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  });
}

const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const sn = (X, Y, Z, k, seed) => 0.5 * fbm(X * k + 11, Y * k + Z * 0.7 * k, 4, seed) + 0.5 * fbm(Y * k - 5, Z * k + X * 0.6 * k, 4, seed + 3);

// 512x256 on purpose: these are painted pixel-by-pixel on the main thread at startup (cheap phones!)
export const earthMap = () =>
  once('earth', () =>
    planetMap(512, 256, (X, Y, Z, lat) => {
      // multi-octave noise for continents vs ocean
      const n = sn(X, Y, Z, 2.4, 31);
      const detail = sn(X, Y, Z, 6.1, 44) * 0.3;
      const fine = sn(X, Y, Z, 14, 59) * 0.08;
      const landNoise = n + detail + fine;

      // polar regions
      const absLat = Math.abs(lat);
      const polar = Math.max(0, (-lat - 1.14) / 0.26); // south pole ice only
      const north = Math.max(0, (lat - 0.95) / 0.35); // the hill patch sits at the north pole: keep it green there

      // land/ocean decision
      const land = landNoise > 0.04 || polar > 0.4 || north > 0.5;

      let c;
      if (!land) {
        // ocean: deep blue to teal variation
        const shallow = Math.max(0, (landNoise - 0.0) * 3);
        c = mix([10, 28, 72], [22, 68, 110], Math.min(1, shallow + sn(X,Y,Z,8,22)*0.25));
      } else {
        // land: dark forest green base, lighter highlands
        c = mix([42, 72, 42], [96, 100, 56], Math.max(0, landNoise * 1.8 + fine));
        // deserts near equator low-lat
        const desert = sn(X, Y, Z, 5, 88) * 0.5;
        const isDesert = absLat < 0.55 && desert > 0.18 && landNoise < 0.35;
        if (isDesert) c = mix(c, [188, 150, 90], Math.min(1, (desert - 0.18) * 4));
      }
      // ice caps blend in
      if (polar > 0) c = mix(c, [220, 230, 240], Math.min(1, polar * 2.5));
      // subtle specular highlight on poles (brightness)
      if (polar > 0.5) c = mix(c, [245, 250, 255], (polar - 0.5) * 1.4);
      if (north > 0) c = mix(c, [58, 84, 54], Math.min(1, north));

      return c;
    }),
  );

export const marsMap = () =>
  once('mars', () =>
    planetMap(512, 256, (X, Y, Z, lat) => {
      const n = sn(X, Y, Z, 2.8, 51);
      const m = sn(X, Y, Z, 9, 77);
      const fine = sn(X, Y, Z, 18, 63) * 0.12;
      // base rusty ochre
      let c = mix([176, 88, 46], [122, 52, 30], Math.max(0, n * 1.8));
      // lighter dust / sand highlights
      c = mix(c, [210, 140, 85], Math.max(0, m + fine) * 0.6);
      // darker volcanic basalt regions
      const basalt = sn(X, Y, Z, 4.2, 39);
      if (basalt < -0.25) c = mix(c, [78, 38, 22], Math.min(1, (-basalt - 0.25) * 2.5));
      // Valles Marineris-like dark scar (lon near 300°, lat near 0)
      const lon = Math.atan2(Z, X); // -pi..pi
      const valles = Math.max(0, 1 - Math.hypot((lon - (-0.52)) * 3, lat * 8));
      if (valles > 0) c = mix(c, [60, 28, 18], valles * 0.6);
      // south polar ice; the north pole stays rust because the ground patch sits there
      const polar = Math.max(0, (-lat - 1.08) / 0.28);
      if (polar > 0) c = mix(c, [210, 190, 170], Math.min(1, polar * 2.2));
      const north = Math.max(0, (lat - 1.0) / 0.3);
      if (north > 0) c = mix(c, [178, 96, 56], Math.min(1, north));
      return c;
    }),
  );
