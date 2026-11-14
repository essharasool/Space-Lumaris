# CURRENT_STATE.md — What the site is right now

> Snapshot written 2026-11-14 at commit `133deae` ("complete cosmic relay race story, audio dock, interactions, and mission patch generator").
> Purpose: let any AI agent understand the **current** build before it changes anything.
> Rules still come first: `AGENTS.md` → `.agents/rules/00–30`. This file describes what exists. It does not set rules.
> The project is a **NASA Space Apps Challenge 2026** entry built by a kid with an AI coding helper. Keep explanations short and plain (see `00-workflow.md`).

---

## 1. What it is (one paragraph)

**"Echoes in the Dust: The Cosmic Relay Race"** is a single-page, scroll-driven, narrated story site (challenge category: *Abandoned but Not Forgotten*). It tells how three robots left on other worlds each "passed a baton" of knowledge forward:
**Surveyor 3 (Moon, 1967) → Sojourner (Mars, 1997) → Opportunity / "Oppy" (Mars, 2004)** → then **you**.
An AI-voiced narration (5 mp3 tracks) plays with karaoke-style captions. Each mission act has real data, a hands-on mini-interaction, a spinning planet, and an expandable "Science File" with NASA sources. It ends with a downloadable personalised mission patch.

---

## 2. Stack (as actually installed)

| Thing | What's used |
|---|---|
| Build | Vite 8, React 19 (plain `.jsx`, React Compiler babel plugin on) |
| Styling | Tailwind v4 (`@import "tailwindcss"` + `@theme` tokens in `src/styles/index.css`) |
| Motion | GSAP 3 + `@gsap/react` (`ScrollTrigger`, `SplitText` registered in `main.jsx`) |
| Scroll | Lenis, driven by `gsap.ticker` (`src/lib/smoothScroll.js`, exports a `lenis` instance; off when reduced-motion) |
| 3D | three + @react-three/fiber (drei installed, not used yet) |
| Icons | lucide-react (AudioDock, ScienceFile) |
| Fonts | Fraunces (display), Atkinson Hyperlegible Next (body), Atkinson Hyperlegible Mono (HUD/numbers) via @fontsource |
| Scripts | `npm run dev` · `npm run build` · `npm run lint` |

---

## 3. File map (only what matters)

```
index.html                  <title> is still "nasa-project"
src/main.jsx                fonts, GSAP plugins, initSmoothScroll(), renders <App/>
src/App.jsx                 page order (see §4)
src/lib/smoothScroll.js     Lenis setup
src/hooks/useNarration.js   one shared <audio> player + karaoke line logic + keyboard + ?timing mode
src/data/missions.js        ALL mission facts, stats, photos, science files, sources
src/data/narration.js       5 tracks: id, src, title, lines[{t, text}]  (text must match content/scripts.md exactly)
src/styles/index.css        suit CSS variables, planet tints, type scale, .hud-label, .theme-btn press styles
src/components/
  RelayTrack.jsx            fixed top progress bar with moving baton + 5 clickable stops
  SuitPicker.jsx            theme switcher (3 "suits")
  AudioDock.jsx             fixed bottom glass audio player
  Karaoke.jsx               caption list, active line animated word-by-word with SplitText
  CountUp.jsx               stat tile; number counts up on scroll
  ScienceFile.jsx           ticket-stub expandable card + "FILED ✓" stamp
  interactions/TrenchDig.jsx   (Surveyor)  slider digs a trench
  interactions/ThenNow.jsx     (Surveyor)  before/after image slider 1967 vs 1969
  interactions/SizeRuler.jsx   (Sojourner) size comparison: microwave / rover / kid
  interactions/RatGrind.jsx    (Oppy)      press-and-hold to grind rock, reveals "blueberries"
  interactions/DustStorm.jsx   (Oppy)      slider darkens sky, solar power drops to 0
src/scenes/
  Prologue.jsx              hero + "Engage Helmet" button
  ActScene.jsx              ONE template for all 3 acts, driven by missions.js
  Globe3D.jsx               lazy-loaded spinning sphere (moon grey / mars rust)
  Epilogue.jsx              "your turn" + mission patch generator (canvas → PNG)
  Credits.jsx               footer: sources, fonts, AI disclosure
public/audio/01-intro.mp3 … 05-outro.mp3   (present)
public/img/                 DOES NOT EXIST YET (see §8)
content/scripts.md          final narration scripts (source of truth for narration text)
MASTER_PLAN.md, PROMPTS.md, TODO.md   plan, build prompts, kid's checklist
```

Rule-listed components that **don't exist yet**: `Hotspot`, Opportunity 3D model viewer. Unused leftovers: `src/assets/hero.png`, `react.svg`, `vite.svg`, `public/icons.svg`.

---

## 4. Page layout, top to bottom

Always-on-screen chrome:
- **RelayTrack** — fixed top bar (`z-40`, `bg-[var(--bg)]/90` + backdrop blur). Thin track line with a round accent "baton" dot whose `left` follows total page scroll %. Below it, 5 mono uppercase stop buttons: `Earth · Moon (Surveyor) · Mars (Sojourner) · Mars (Oppy) · Your Lap`. Click → `lenis.scrollTo(target, offset -60)`. Active stop = page progress split into 5 equal parts (not real section positions).
- **SuitPicker** — fixed pill at top-right under the bar (`top-14 right-4`). **Hidden below `sm` (640px)**, so phones can't change suit.
- **AudioDock** — fixed bottom, full width on mobile, 680px centred on `md+`. The only glassmorphism element. Shows play/pause (44px accent circle), "TRACK n/5" + track title, desktop-only time + range scrubber, prev/next/mute buttons. Mobile shows a thin progress line instead of the scrubber.

Main flow (`<main>`):

### 4.1 Prologue (`#prologue`)
- Faint CSS dot starfield (radial-gradient background).
- HUD label "Prologue · Humanity's Starting Line".
- **h1** "The Great Cosmic Relay Race" (Fraunces, huge, left-aligned, not centred).
- Lead paragraph about three quiet explorers passing the baton.
- **"Engage Helmet ▶"** pill button (accent bg) + note "Starts voice transmission & unlocks audio". On click: plays narration, gently scales the hero frame (GSAP), then after 600 ms `scrollIntoView` to `#act-surveyor`.
- Big rounded **hero frame** expecting `/img/art/bedroom.webp` (AI art, kid from behind at window). Caption + "Illustration (AI-assisted)" + tag "EARTH OBSERVATION POST".
- Karaoke box (only while track `intro` is current).

### 4.2 Act scenes ×3 (`#act-surveyor`, `#act-sojourner`, `#act-opportunity`)
Same template, `data-planet` = moon / mars / mars. Layout:
- **HUD header strip**: dot + `LEG 0n: TITLE` + `[NSSDCA id]` on left; `DATE · LOCATION · COORDS` (mono) on right. All values real, from `missions.js`.
- **Grid**: 1 column on mobile; on `lg` (1024px Tailwind default — the rules say 1200) a **7/5 split**.
  - **Left (7)**: main NASA photo (first item of `mission.photos`, 4:3, museum caption: credit, alt text, ID badge) → that act's interaction(s) → lazy `Globe3D` "ORBITAL RADAR: MOON/MARS" box.
  - **Right (5)**: "Mission Dossier" label, **h2** title, `"nickname" · PLANET`; **baton quote** card (left accent border, italic Fraunces); **2×2 CountUp stat tiles**; Karaoke (only while this act's track plays); **ScienceFile**.
- Nothing is pinned yet (rules ask for photo/globe pinned on desktop).

Per-act content:

| | Surveyor 3 | Sojourner | Opportunity |
|---|---|---|---|
| Nickname | The Moon Scout | The First Mars Rover | Oppy |
| Date / place | 20 Apr 1967 · Oceanus Procellarum | 4 Jul 1997 · Ares Vallis (Carl Sagan Memorial Station) | 25 Jan 2004 · Meridiani Planum (Eagle Crater) |
| Coords | 3.0° S, 23.4° W | 19.33° N, 33.55° W | 1.95° S, 354.47° E |
| Baton line | "Yes, the lunar ground is firm enough to land our astronauts." | "Yes, wheeled robots can safely navigate and study Martian terrain." | "Yes, liquid water once soaked the ground of Mars." |
| Stats | Landed 20 Apr 1967 · about 300 kg landed · 1,026 kg launch · Apollo 12 (2.5 yrs later) | about 10.5 kg (23 lb) · 6 wheels rocker-bogie · planned 7 sols · worked 83 sols | 45.16 km (28.06 mi) · designed 90 sols · over 14 years · last contact 10 Jun 2018 (sol 5,111) |
| Interactions | TrenchDig + ThenNow | SizeRuler | RatGrind + DustStorm |
| Science File | surface scoop → soil holds weight | APXS → chemistry of Mars rocks | RAT → ancient water; record passed by Perseverance 11 Oct 2026 |
| Main photo | `surveyor-1967.webp` | `PIA01122.webp` | `PIA22929.webp` |

### 4.3 Interactions (all self-contained cards: label "Interactive Test 0n", Fraunces h4, short kid copy, a visual stage, a control)
- **TrenchDig** — range slider 0→17.5 cm; dark "soil" box, trench cutout grows, grey scoop moves down; at ≥60% shows green "Soil is firm: safe to land! ✓".
- **ThenNow** — before/after compare of two Surveyor photos with a white ↔ divider; driven by a range input (no direct drag on the image). Labels "1967 · Surveyor 3 Alone" / "1969 · Apollo 12 Astronauts Visit".
- **SizeRuler** — three CSS boxes on a cm ruler: Microwave (~30 cm), Sojourner (65 cm long, ~30 cm tall, 6 wheel dots), "You" silhouette (~135 cm). Buttons highlight one.
- **RatGrind** — press-and-hold button (mouse + touch) grows a `clip-path` circle revealing a dark rock with 9 blue "hematite blueberries" and the note about water. Reset button.
- **DustStorm** — range slider darkens a Mars-orange sky (opacity overlay), dims a sun disc, drops a "Solar Array Power" bar; at 0% shows "10 June 2018 (Sol 5,111): Last telemetry received" + the true "last message was data, not words" line.

### 4.4 Epilogue (`#epilogue`)
- Centred text block: label "Epilogue · The Baton Never Stops", **h2** "The Race Isn't Over. It's Your Turn.", paragraph on Perseverance passing Oppy's record (11 Oct 2026, 45.22 km).
- Wide image frame expecting `/img/art/epilogue.webp` (AI art, "Illustration (AI-assisted)", tag "FUTURE RUNNER").
- Karaoke (while `outro` plays).
- **Mission patch generator** card: name input (max 24 chars) + "Download My Patch 🚀" button → draws a 600×600 circular patch on a hidden `<canvas>` (fixed Stardust colours, baton emblem, "COSMIC RELAY RACE", the name, "NASA SPACE APPS 2026", "THE BATON IS YOURS") and downloads a PNG. Nothing is sent anywhere.

### 4.5 Credits (`<footer>`, rendered after the AudioDock in the DOM)
Title block + "Space Apps Challenge 2026 Entry" badge; 3 columns: NASA data/photo links (6), typography & open source, Ethical & AI disclosure (NASA photos for robots, Gemini AI art labelled, AI narrator voice, no under-18 faces/voices). Closing line in mono.

---

## 5. Design system as implemented

- **Suits** (`<html data-suit>`; saved in `localStorage.suit`; first visit = `daylight` if OS light, else `stardust`). Variables exactly as in `20-design.md`. `:root` defaults to Daylight values, so a dark-mode visitor may see a brief light flash before React sets the attribute.
  - Stardust: deep purple bg, pink accent, 20px radius.
  - Rocketeer: near-black bg, orange accent, 4px radius, `.theme-btn:active` moves down 2px.
  - Daylight: cream bg, brick-red accent, 12px radius.
- Suit "motion personality" (springy / snappy / gentle GSAP eases) is **not built** — only the `:active` press styles in CSS.
- **Planet tint**: `--planet-tint` is defined for moon/mars in CSS but **nothing uses it**, so acts look the same colour-wise.
- **Type**: fluid clamp scale for body/h1/h2/h3 in CSS; `.hud-label` = mono, uppercase, 0.08em. Many components override sizes with Tailwind `text-xs`/`text-[10px]`, so some readable text is below 16px.
- **Look & feel**: dark rounded cards with thin `--muted`/20–30% borders, accent dots, mono HUD strips, museum captions on photos, dashed-border "ticket" Science File with a rotated green "FILED ✓" stamp. Asymmetric left-aligned hero.
- Colours are mostly CSS variables, but interactions use fixed Tailwind/hex colours (amber, cyan, green, zinc, Mars browns) that don't change with the suit.

---

## 6. Audio + karaoke behaviour

- `useNarration()` (called once in `App`) owns one `new Audio()`. Tracks auto-advance on `ended`.
- Audio starts only from a user tap (Engage Helmet or the dock's play button).
- **Karaoke timing is not calibrated**: every `t` in `narration.js` is `0`, so the active line is guessed by splitting track duration evenly. Fix: open `/?timing`, play, press Space at each line start, copy the printed JSON into `narration.js` (TODO #17).
- Keyboard (global): Space = play/pause (or stamp time in `?timing` mode), ←/→ = seek 5 s. Ignored while typing in inputs.
- Track and scroll are **not linked**: scrolling doesn't change the track, and changing the track doesn't scroll. Karaoke for a track only renders inside its own section, so you may need to scroll to see captions.
- **Known bug**: Oppy's track id is `oppy` but the mission id is `opportunity`, so `ActScene` never shows karaoke during track 4.

---

## 7. Accessibility & responsive status

Done: semantic `main/section/nav/aside/footer`, alt text on all images, `aria-label`s on dock and controls, `aria-live` captions, `role="radiogroup"` suits, sr-only labels on sliders/inputs, 44px+ tap targets on most buttons, reduced-motion checks (Lenis off, no SplitText/CountUp animation, Globe replaced by a text box).
Gaps: suit picker hidden on phones; heading levels skip (h4/h5 in Credits, h4 in cards); RelayTrack stop buttons are 30px tall; no custom focus-ring styling; only seen at default widths (TODO #21–23 not done).

---

## 8. Known gaps vs. the rules (to-do candidates — fix one per task)

**Missing assets (biggest visual gap):** `public/img/` doesn't exist. Every `<img>` hides itself on error, so all photo frames, the ThenNow slider and both AI art frames currently show **empty dark boxes**. Expected files: `img/art/bedroom.webp`, `img/art/epilogue.webp`, `img/nasa/surveyor-1967.webp`, `surveyor-apollo12.webp`, `PIA01122.webp`, `PIA22929.webp`, `PIA22930.webp`, `PIA22908.webp` (TODO #10–13). PIA22930 and PIA22908 are listed in data but not displayed anywhere.

**Performance rules not met (`10-stack.md`):**
- `Globe3D` renders **3 separate `<Canvas>`es** (one per act) with `frameloop="always"`; rule = one Canvas, `frameloop="demand"`, stop off-screen, load only near viewport. Plain coloured sphere, no NASA textures.
- RelayTrack moves the baton with `style.left` (layout) instead of `transform`.
- Prologue scrolls with `scrollIntoView` instead of `lenis.scrollTo`.
- No scroll-linked reveals, parallax, or pinning yet.

**Design / copy rule hits (`20-design.md`):**
- Emoji in UI: "Download My Patch 🚀".
- Banned words: "unlocks audio" (Prologue), "journey" (Prologue lead). (Narration text "unlocking secrets" is a recorded script — leave it.)
- DustStorm shows a computed "TAU ATMOSPHERIC OPACITY" number and a solar % — this is simulated, which is close to the "fake HUD data" ban.
- "Claim Your Official Mission Patch" — it isn't official; reword.

**Facts not in `30-facts.md` (treat as `/* VERIFY */`):** NSSDCA IDs `1996-068A` and `2003-032A`; trench depth 17.5 cm; "motor current" method; rock "Barnacle Bill"; Sojourner 65 cm / ~30 cm tall; "diamond-tipped" RAT; kid height ~135 cm.

**Content-in-components:** ThenNow labels, interaction copy/numbers, Credits links and Prologue/Epilogue text are hard-coded in components instead of `missions.js`/`narration.js` (rule 4 of `00-workflow.md`).

**Small fixes:** `index.html` title is "nasa-project"; Credits typo "hardware hardware"; `CountUp` counts dates ("20 Apr 1967" counts 0→20) and "1,026" only animates the "1"; AudioDock uses `dark:` classes that never apply (suits don't use Tailwind dark mode); mission patch ignores the chosen suit colours.

---

## 9. Quick orientation for a new agent

1. Read `AGENTS.md` and the 4 rule files. They override anything here.
2. Facts → only `30-facts.md`. Text → `missions.js` / `narration.js`.
3. One task at a time, targeted edits, `npm run build` after big changes, suggest a commit message, explain in 1–3 kid-friendly sentences.
4. Update this file's "Known gaps" section when you fix something.
