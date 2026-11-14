# CURRENT_STATE.md — What the site is right now

> Snapshot written 2026-11-15 after the **3D scroll-story rebuild**.
> Rules still come first: `AGENTS.md` → `.agents/rules/00–30`. This file describes what exists.
> NASA Space Apps Challenge 2026 entry, built by a kid with an AI coding helper. Keep explanations short and plain.

---

## 1. What it is

**"Echoes in the Dust: The Cosmic Relay Race"** is now one full-screen 3D world (`100vw × 100vh`, fixed) that the camera
flies through while the narrator speaks: **Earth → sky → space → Moon (Surveyor 3) → Mars (Sojourner) → Mars (Opportunity) → dust storm → starlit monuments**.
There are no card layouts any more. Big floating type (Fraunces) and word-by-word karaoke captions sit over the 3D canvas.
The light, fog, sky, dust and the UI accent color all change with the story.

Two ways to travel (pill in the bottom dock):
- **Autopilot** — the voice is the clock. Audio time → story progress → page scroll → camera. Tracks 01→05 play in a row.
- **Self-Pilot** — the scroll is the clock. Scrolling into a sentence plays just that sentence, then pauses until you scroll on.
  A pulsing **"Switch to Autopilot ▶"** button is always shown in Self-Pilot.
- Scrolling (wheel / swipe / arrow keys) during Autopilot switches to Self-Pilot without a jump.

---

## 2. Stack

Vite 8 · React 19 (plain `.jsx`, React Compiler) · Tailwind v4 · GSAP 3 + `@gsap/react` · Lenis · three + @react-three/fiber + @react-three/drei · lucide-react · Fontsource fonts.
No new npm packages were added. `npm run build` and `npm run lint` both pass with no errors.

---

## 3. File map

```
src/main.jsx                fonts, GSAP plugins, Lenis, renders <App/>
src/App.jsx                 fixed 3D world (lazy chunk) + tall invisible scroll track (1800vh) + UI overlay
src/lib/narrator.js         ★ the brain: audio ↔ scroll ↔ captions, Autopilot/Self-Pilot, relay jumps, panels
src/lib/store.js            `live` (per-frame values, no re-renders) + tiny React store (mode, act, card, panel…)
src/lib/timeline.js         progress ↔ track/line/time helpers
src/lib/math.js, noise.js   easing helpers, seeded noise for terrain
src/lib/smoothScroll.js     Lenis (off with reduced motion)
src/data/narration.js       AUTO-GENERATED: exact script text + sentence & word timestamps + scroll range per line
src/data/missions.js        ALL facts/copy: story text, missions, sketchbook facts, sources, credits, badge text
src/world/World.jsx         the one <Canvas> (dpr [1,1.5], log depth, pauses when tab hidden, 'demand' if reduced motion)
src/world/path.js           planet positions + terrain heights, site anchors, CAMERA_KEYS, ATMOS_KEYS, stormAt()
src/world/Atmosphere.jsx    sky dome shader, stars, fog, sun/hemi light, dust particles, storm clouds, CSS --accent
src/world/CameraRig.jsx     flies the camera between keyframes (eased, damped)
src/world/Planet.jsx        textured sphere + curved terrain patch at the pole + glow + rocks
src/world/Kid.jsx           helmeted kid explorer (gold mirrored visor — never a face) + glowing <Baton/>
src/world/EarthScene.jsx    rocket + launch pad, cloud deck, 3 satellites
src/world/MoonScene.jsx     Surveyor 3 (scoop dig), Apollo 12 flag + footprints
src/world/MarsScene.jsx     Sojourner + Pathfinder lander (APXS scan), Opportunity (NASA GLB), tracks, RAT grind, heartbeat LED
src/world/RelayTrail.jsx    outro constellation trail Earth → Surveyor → Sojourner → Oppy → you
src/world/parts.jsx         Strut, Beacon (tap target), Tag (3D-anchored DOM label), useClickable, since()
src/world/textures.js       code-drawn textures (glows, clouds, rings, solar cells, Earth & Mars maps)
src/ui/Gate.jsx             opening screen: "Engage helmet: Autopilot ▶" / "Self-Pilot"
src/ui/Captions.jsx         karaoke line (word states past/now/next, italic emphasis words)
src/ui/KineticTitles.jsx    act titles, HUD strip (real data), storm telemetry, "tap to discover" hint
src/ui/RelayTrack.jsx       top progress track + baton + 5 jump stops
src/ui/Dock.jsx             glass dock: mode pill, play/pause, mute, Sources, "Pass the baton"
src/ui/Sketchbook.jsx       "Explorer sketchbook" card (cutout art with parallax tilt, facts, stamp)
src/ui/SourcesDrawer.jsx    NASA sources, asset credits, how-it-was-made, full transcript
src/ui/BadgeMaker.jsx       relay badge maker (canvas → PNG, nothing sent anywhere)
src/ui/WorldBoundary.jsx    if WebGL/3D fails, the story UI and voice keep working
scripts/sync-captions.py    one-time caption timing tool (see §6)
public/models/opportunity.glb   NASA 3D Resources "Mars Exploration Rover – Opportunity (MER-B)" (36 KB, Draco)
public/draco/               Draco decoder copied from three (so the GLB loads offline, no CDN)
public/textures/moon-1k.webp    NASA SVS CGI Moon Kit color map (1K)
public/img/cutouts/*.webp   the 3 sketch cutouts (from public/images/*.png, converted)
```
Deleted: `ActScene`, `Prologue`, `Epilogue`, `Credits`, `Globe3D`, `SuitPicker`, `AudioDock`, `Karaoke`, `CountUp`, `ScienceFile`, all 5 slider interactions, `useNarration`.

---

## 4. The story timeline (progress 0 → 1)

| Act | Audio | Progress | What happens |
|---|---|---|---|
| 0 Earth | 01-intro | 0.00–0.20 | Twilight hill, kid from behind looking up; Moon + Mars in the sky; satellites; rocket ignites on "…but with a rocket" and the camera chases it up through clouds |
| 1 Moon | 02-surveyor | 0.20–0.42 | Fly to the Moon, land by Surveyor 3 in its crater; Apollo 12 flag + footprints; Earth hangs in the black sky |
| 2 Mars | 03-sojourner | 0.42–0.64 | Ares Vallis canyon; Sojourner rolls off the Pathfinder ramp, turns its APXS to rock "Yogi" |
| 3 Mars | 04-oppy | 0.64–0.86 | Meridiani Planum; NASA Oppy model, glowing tracks ("45.16 km of tracks"), RAT rock; **dust storm** from "When a massive dust storm…" (sky darkens, dust swirls, panels go brown, heartbeat light slows and goes out, "Last contact · Sol 5,111 · 10 Jun 2018") |
| 4 Outro | 05-outro | 0.86–1.00 | Dust clears, vista of Earth + Moon + Mars, gold constellation trail drawn site to site, monument labels, kid holds the baton out to you; "Pass the baton" badge button |

Each line's exact scroll range is in `narration.js` (`line.scroll`). Camera beats are in `path.js` `CAMERA_KEYS`.

## 5. Interactions (tap the robot or its pulsing beacon)

- **Surveyor 3** — scoop lowers, scrapes a trench, moon-dust puffs, a ring rises with "Safe to land ✓".
- **Sojourner** — rover turns, APXS beam on the rock, colored crystals float up, "microwave"-sized hologram box.
- **Oppy** — RAT spins with golden sparks, ground circle opens, blue hematite "blueberries" glow.
- Every tap also opens the **Explorer Sketchbook** card (cutout drawing labelled "Illustration (AI-assisted)", stamp badge, verified facts). Closes with ✕, Escape, or when the act changes.

## 6. Captions & timing

`scripts/sync-captions.py` was run once. It used faster-whisper large-v3 (from the reel-editor venv, read-only), plus ffprobe for durations and ffmpeg `silencedetect`.
Whisper's words are **aligned to the exact script words**, so the caption text never changes. Only the times come from the audio.
Re-run after any re-recording:
```
HF_HOME=<whisper cache> <python with faster-whisper> -I scripts/sync-captions.py
```
**Known audio mismatch:** in `01-intro.mp3` the recording seems to skip "past the floating satellites". Whisper hears "Past the clouds, all the way to the Moon and Mars". The caption keeps the script words, so those 3 words light up almost together.

## 7. Accessibility & performance

- Captions also go to an `aria-live` region; full transcript in Sources. Space = play/pause. Tap targets ≥ 44 px. Focus rings use the accent.
- `prefers-reduced-motion`: native scroll, no camera sway/damping, no dust, the canvas only redraws when the story moves, CSS animations off.
- One Canvas, `dpr [1, 1.5]`, `frameloop="always"` while the tab is visible, `never` when hidden. The 3D chunk is lazy (~290 kB gzip). Audio is prefetched one track at a time into memory (falls back to streaming).
- Fake-data ban respected: HUD shows only real dates, places, coordinates, sols and distance.

## 8. Known gaps / ideas

- Rule conflict, decided by the user's brief: `20-design.md` says AI art should not show robot close-ups. The sketchbook cutouts are AI-assisted robot drawings, used as the brief asked and labelled.
- `public/images/*.png` originals are still there (now duplicated as WebP in `public/img/cutouts/`). They can be deleted to shrink `dist`.
- Old leftovers not touched: `src/assets/hero.png`, `react.svg`, `vite.svg`, `public/icons.svg`.
- The Surveyor 3, Sojourner, rocket and kid models are simple hand-built shapes. They could be refined.
- Not yet tested on a real cheap phone (only headless Chrome at 1280×720 and 390×844).
- drei `<Html>` labels print a harmless "synchronously unmount a root" warning in dev (React StrictMode only).
