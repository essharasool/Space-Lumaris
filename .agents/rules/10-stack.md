# Stack & engineering rules

## Allowed packages (only these)
react, react-dom, vite, @vitejs/plugin-react, tailwindcss, @tailwindcss/vite,
gsap, @gsap/react, lenis, three, @react-three/fiber, @react-three/drei, lucide-react,
@fontsource-variable/fraunces, @fontsource-variable/atkinson-hyperlegible-next, @fontsource/atkinson-hyperlegible-mono

- Plain JavaScript (.jsx). No TypeScript, no Next.js, no Framer Motion, no Howler, no UI kits (shadcn, MUI, etc.).
- Tailwind v4: `@import "tailwindcss";` in `src/styles/index.css`, plus `@theme` tokens that read CSS variables.
- Animation: GSAP only. Use `useGSAP()` from `@gsap/react` (auto-cleanup). Register `ScrollTrigger` and `SplitText` once in `main.jsx`.

## Smooth scrolling (Lenis, driven by GSAP's clock)
Set up ONCE in `src/lib/smoothScroll.js`, called from `main.jsx`:
```js
import Lenis from 'lenis'; import 'lenis/dist/lenis.css';
import { gsap } from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger';
export function initSmoothScroll() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return null; // native scroll
  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, autoRaf: false }); // touch stays native (syncTouch off)
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
```
- Only ONE animation loop (gsap.ticker). No extra requestAnimationFrame loops.
- Touch devices keep native scrolling (smooth and cheap). Never turn on `syncTouch`.
- `lenis.stop()` when a modal opens, `lenis.start()` when it closes. Use `lenis.scrollTo('#act-2')` for RelayTrack links.
- Do NOT also use GSAP ScrollSmoother or CSS `scroll-behavior: smooth`.
- Scroll-linked animations use `scrub: 0.5` to `1` and only animate `transform`/`opacity`. Parallax: max 3 layers.
- Add `will-change: transform` only while animating. Never put it on everything.

## Structure
```
src/lib/smoothScroll.js   src/data/missions.js   src/data/narration.js (already filled; keep text exact)   src/hooks/useNarration.js
src/components/  SuitPicker AudioDock Karaoke RelayTrack ScienceFile Hotspot ThenNow CountUp
src/scenes/      Prologue ActScene Globe3D Epilogue Credits
src/styles/index.css   src/App.jsx   src/main.jsx
```
- ONE `ActScene.jsx` template renders all 3 acts from `missions.js`. Do not create Surveyor/Sojourner/Oppy copies.
- Audio files: `/audio/01-intro.mp3` … `/audio/05-outro.mp3`. Audio starts only after the user taps "Engage Helmet" (browser autoplay rules).

## Performance (must not lag on a cheap phone)
- `Globe3D` and the Opportunity model load with `React.lazy` + `Suspense`, only when near the viewport.
- One `<Canvas>` in the whole app: `dpr={[1, 1.5]}`, `frameloop="demand"`, stop when off-screen. Textures ≤ 2048px WebP. GLB ≤ 3 MB.
- Animate only `transform` and `opacity`. Never animate `filter`, `box-shadow`, `width`, `height`, `top`/`left` on scroll.
- Images: `<img loading="lazy" decoding="async" width height>` with WebP. Hero image is not lazy.
- `@media (prefers-reduced-motion: reduce)`: disable parallax, bounces, count-ups (show final values).
- Touch devices (`(hover: none)`): no custom cursor; scanner works by dragging a finger.

## Responsive
Mobile-first. Breakpoints: `md` 768, `lg` 1200. Test at 360, 768, 1024, 1440 widths.
- Mobile: single column, AudioDock collapses to play button + thin progress line, tap targets ≥ 44px.
- Desktop: asymmetric 7/5 column split, globe/photo pinned while text scrolls.

## Accessibility
Semantic HTML (`main`, `section`, `h1–h3`, `button`). Every image has real alt text. Visible focus rings. Karaoke text is also the caption track. Keyboard: Space = play/pause, ←/→ = seek 5s.
