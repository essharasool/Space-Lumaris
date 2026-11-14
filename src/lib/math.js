// Tiny math helpers shared by the 3D world and the UI.
export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => t * t * (3 - 2 * t);
export const smoother = (t) => t * t * t * (t * (t * 6 - 15) + 10);
/** 0 → 1 as p goes a → b (linear) */
export const ramp = (p, a, b) => clamp01((p - a) / (b - a));
/** 0 → 1 as p goes a → b (eased) */
export const sramp = (p, a, b) => smooth(ramp(p, a, b));
/** fades in a → b, holds, fades out c → d */
export const band = (p, a, b, c, d) => sramp(p, a, b) * (1 - sramp(p, c, d));
/** frame-rate independent damping factor */
export const damp = (dt, k) => 1 - Math.exp(-k * dt);
