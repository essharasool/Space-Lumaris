# MASTER PLAN v2 — *Echoes in the Dust: The Cosmic Relay Race*

**NASA Space Apps Challenge 2026** · Challenge: *Abandoned but Not Forgotten*
**Deadline:** Sunday 15 Nov 2026, 11:59 PM local time. Aim to submit by **8 PM**.
**Audience:** ages 7–14. Simple story on top, "Secret Science Files" underneath.
**Builder:** Antigravity with Gemini Flash, so the plan keeps every task small and cheap.
**Host:** Vercel.

> v1 (the Antigravity plan) is in git history. v2 keeps her story, fixes facts that were wrong, cuts what can't be built well in about 1.5 days, and adds a few ideas that cost little and stand out.

---

## 0. Rule check against the official challenge

| Requirement (source) | v1 | v2 |
|---|---|---|
| Tell the story of NASA hardware left on the Moon/Mars for school-age kids ("some or all") | ✅ 3 robots | ✅ Keep 3. Optional bonus: a "Ghost Robot Map" with the other items from the Resources tab |
| Show *how missions operated*, not lists of facts | ⚠️ Heavy on spec tables | ✅ Each act has one hands-on interaction that shows how the hardware worked |
| Link engineering to science | ✅ | ✅ Every act ends with a "Because of this part → we learned this" card |
| **Accuracy is important** | ❌ Several wrong or outdated facts (see §6) | ✅ Facts live in one checked data file, each with a source link |
| Use NASA data (judges look for it) | ⚠️ Mentioned, not linked | ✅ NSSDCA + Photojournal links in every Science File; credits page |
| Demo: **≤30 s video OR ≤7 slides**, public link, English | ❌ Missing | ✅ §8 |
| **Under-18 rule:** no recognisable name, voice or face of kids in the submission or demo | ⚠️ Not addressed | ✅ The voice is AI. The child character is always seen from behind or in a helmet. No real names or photos of the team |
| Space Apps branding, **not** the NASA logo. No NASA logo next to AI images | ❌ Not addressed | ✅ Rule in the Antigravity rules file |
| Rights to everything used | ⚠️ | ✅ Only NASA images (public domain), our own AI art, and OFL fonts. Credits page |

---

## 1. The story (her idea, sharpened)

**The Great Cosmic Relay Race.** Each robot ran one leg and handed the baton on.

| Leg | Robot | What the baton *is* | Hands-on moment (shows how it worked) |
|---|---|---|---|
| Prologue | — (kid at the window, back to camera) | A question: *"Could the ground out there hold us up?"* | Tap **ENGAGE HELMET** (this also unlocks audio, which browsers require) |
| 1 · Moon 1967 | **Surveyor 3** | *"Yes, the ground is solid."* | **Dig a trench** (matches the narration): drag the scoop into the soil, a trench appears and a meter says "firm: safe to land". Then a **"Then vs. Now" slider** compares Surveyor alone in 1967 with Apollo 12 astronauts beside it in 1969 |
| 2 · Mars 1997 | **Sojourner** | *"Yes, a robot can drive on Mars."* | **Bounce landing:** the airbag ball bounces, then deflates. **Size ruler:** drag Sojourner next to a kid silhouette and a microwave |
| 3 · Mars 2004–2018 | **Opportunity** | *"Yes, water once soaked Mars."* | **RAT grind** reveals hematite "blueberries". **Odometer** rolls up to 45.16 km as you scroll. **Dust storm:** a slider fills the sky with dust and the solar-power bar drains, which is how Oppy went to sleep |
| Epilogue | **You** | *The baton is still moving.* | **New in 2026:** Perseverance passed Oppy's driving record on **11 Oct 2026**. The relay is real and still going. The last baton goes to the reader: a "Mission Patch" with a name they type in (stays on their device) |

**Why the epilogue works:** v1 said Oppy "holds the world record". That stopped being true on 11 Oct 2026. Instead of hiding that, the site makes it the ending: Oppy literally passed the baton. Judges will notice the up-to-date research. The outro script doesn't mention the record, so no audio change is needed; the Perseverance update is on-screen text only. **Script fixes are in `TODO.md`** (Oppy's "last message" line is a myth and must change).

**"Ghost Robot Map" (stretch goal, only if time is left Sunday):** a flat 2D map of the Moon and Mars with faint dots for the other hardware on the Resources tab (Apollo descent stages, the 3 Moon buggies, Viking 1 & 2, Spirit, Phoenix, InSight, Ingenuity). Each dot gives one line: what it is, the year, and its status, linked to NSSDCA. No audio needed.

---

## 2. Themes: "Pick your Explorer Suit" (instead of light/dark)

She picked both ideas, so they're combined:
- **The planet sets the scene colours automatically** (bedroom → Moon grey → Mars rust) as you scroll.
- **The visitor picks a Suit** that sets the UI personality: accent colour, button shape, and how things move. Names are gender-neutral so every kid feels invited, while the looks still lean "sparkly" or "mechanical".

| Suit | Feel | Palette (accent on deep space) | Motion personality |
|---|---|---|---|
| **Stardust** | soft, dreamy, sparkly | blush `#F4A7B9`, lilac `#B9A3E3`, peach `#FFD3B0` on plum-night `#1B1430` | springy, with a small sparkle burst on tap |
| **Rocketeer** | bold, mechanical | safety orange `#FF6B1A`, signal yellow `#FFC83D`, steel `#9BA8B5` on gunmetal `#12161C` | snappy, with a "clunk" press and hazard stripes on hover |
| **Daylight** (the light mode) | paper storybook, best for classrooms and projectors | ink `#1E2A3A`, brick `#C0462B`, sky `#3D7BC4` on cream `#F6F0E4` | gentle fades |

- First visit uses Daylight or Stardust based on the device's light/dark setting. The choice is saved in `localStorage`.
- How it's built: `<html data-suit="stardust">` plus CSS variables. Each suit is one small CSS block, with no JavaScript re-render.
- All 3 suits must pass WCAG AA contrast for body text.

---

## 3. Visual system (no AI slop)

**Typography (free, self-hosted with Fontsource, no Google Fonts request):**
| Role | Font | Why |
|---|---|---|
| Story titles | **Fraunces** (variable; soft/wonky axes) | Picture-book warmth, not the usual tech-startup look |
| Body and captions | **Atkinson Hyperlegible Next** (variable) | Designed by the Braille Institute for legibility. Ideal for kids and dyslexic readers |
| Telemetry, numbers, HUD | **Atkinson Hyperlegible Mono** | Matches the body font, with clear numbers |

Fluid type scale (use `clamp`): body **18→20 px**, line-height 1.6, max width 60 characters. H1 **44→96 px**, H2 32→56, H3 24→32. HUD labels 12–14 px uppercase with +0.08em letter spacing. Nothing a kid has to read goes below 16 px.

**Art direction: "museum diorama meets picture book."**
- Real NASA photos are the hero images of each robot. Accuracy wins.
- Gemini art is used for scenes and mood only: the bedroom, the child seen from behind, sky backdrops, paper-cut foreground rocks. **Never** use AI art for close-ups of the robots, because AI gets their shape wrong. Every AI image gets a small label: "Illustration (AI-assisted)".
- One consistent art style. Prompts are in `PROMPTS.md` §B.
- Blueprint mode: thin white line drawings with numbered call-outs (like a museum label), instead of neon glow.

**Banned (these are what make a site look AI-made):** purple-to-blue gradients, gradient text, glassmorphism everywhere (allowed once: the audio dock), glowing neon borders, emoji used as icons, a grid of 3 cards with icons, a centred hero with "Unlock the…", fake HUD numbers (no oxygen meter; the HUD shows **real** data: coordinates, date, sol count, distance), stock phrases ("testament", "delve", "embark", "tapestry", "journey"), and Inter, Space Grotesk or Poppins.

**What it does instead:** asymmetric layouts, big real photos with museum-style captions (photo ID + credit), hand-made details like ticket-stub cards and mission stamps, real numbers set in mono type, and lots of empty space.

---

## 4. Tech stack (small, fast, and easy for Gemini Flash)

| Need | Choice | Not used, and why |
|---|---|---|
| App | **Vite + React (plain JavaScript)** | Next.js and TypeScript add files and errors Flash has to fight |
| Styling | **Tailwind CSS v4** (`@tailwindcss/vite`) + CSS variables for suits | — |
| Smooth scroll | **Lenis** (MIT, tiny), run by GSAP's clock. Native scrolling on touch screens and for reduced-motion users | GSAP ScrollSmoother needs wrapper divs and breaks `position: fixed` |
| All animation | **GSAP** + ScrollTrigger + SplitText + `@gsap/react` (all free since Webflow made GSAP free) | Framer Motion too. Two animation libraries means double the tokens and the bundle |
| 3D (one place only) | **three + @react-three/fiber + @react-three/drei**, lazy-loaded | 3D on every scene would lag phones |
| Audio | Native `<audio>` + a small `useNarration` hook | Howler isn't needed |
| Fonts | `@fontsource-variable/fraunces`, `@fontsource-variable/atkinson-hyperlegible-next`, `@fontsource/atkinson-hyperlegible-mono` | — |
| Icons | `lucide-react`, only for audio and player controls | Emoji |
| Deploy | Vercel (connect the GitHub repo) | — |

**3D: "a little 3D + some real models" (her choice):**
1. **Orbit globe:** one sphere with the free NASA CGI Moon Kit texture, which then swaps to a Mars texture (NASA 3D Resources). Pins at the landing sites. Used between acts as the "travel" moment. Textures at 2K max, WebP.
2. **Opportunity 3D model** from NASA 3D Resources (free, no copyright). It must be compressed to **under 3 MB** at gltf.report, and it only loads when the visitor opens "Inspect Oppy".
3. **No free NASA 3D model was found for Sojourner or Surveyor 3.** They get real photos plus clickable blueprint hotspots, which also look more unique.

**Performance budget (no lag):**
- First load under 250 KB gzipped JS. The 3D code is split out with `React.lazy`.
- Canvas: `dpr={[1, 1.5]}`, `frameloop="demand"`, stops rendering when off-screen. One Canvas only.
- Images: WebP/AVIF, 1600 px wide max, `loading="lazy"`, width and height set.
- Animate only `transform` and `opacity`. Never animate `filter: blur` or `box-shadow` on scroll.
- `prefers-reduced-motion`: turns off parallax and bounces and shows simple fades.
- Touch devices: no custom cursor. The X-ray scanner becomes "drag your finger to scan".

**Responsive:** mobile 360–767 (single column, dock collapses to a play button + progress line), tablet 768–1199 (photo and text stack, side-by-side in landscape), desktop 1200+ (asymmetric two-column scenes, globe pinned while text scrolls). Test at 360, 768, 1024 and 1440.

**Micro-interactions (each one small and each one meaningful):**
- Buttons press down 2 px, with a suit-specific effect (sparkle or clunk).
- Science File cards flip like a ticket stub, and a "STAMPED ✓" mark lands when opened.
- The relay-track progress bar at the top runs Earth → Moon → Mars, and a baton slides along it as you scroll.
- Karaoke text: each line brightens as it's spoken, and past lines dim.
- Numbers count up (45.16 km, 83 days, 14+ years) when they scroll into view.
- Hotspot dots pulse once, not forever.

---

## 5. Files and folders (keep it small)

```text
public/
  audio/ 01-intro.mp3  02-surveyor.mp3  03-sojourner.mp3  04-oppy.mp3  05-outro.mp3   # renamed: no spaces
  img/nasa/   (real NASA photos, named by ID: PIA01122.webp …)
  img/art/    (Gemini art, webp)
  models/opportunity.glb   textures/moon_2k.webp  mars_2k.webp
src/
  data/missions.js      # ALL facts, numbers, captions, sources: the only place facts live
  data/narration.js     # her scripts, split into lines + start times (seconds)
  hooks/useNarration.js # plays audio, tells which line is active
  components/  SuitPicker  AudioDock  Karaoke  RelayTrack  ScienceFile  Hotspot  ThenNow  CountUp
  scenes/      Prologue  ActScene (one template for all 3 acts)  Globe3D (lazy)  Epilogue  Credits
  styles/index.css      # Tailwind + suit variables + type scale
  App.jsx  main.jsx
```

**Karaoke timing trick (no AI tokens):** a hidden `?timing` mode. Play a track, tap the space bar at the start of each line, and it prints the times as JSON. Paste that into `narration.js`. Takes about 10 minutes for all 5 tracks.

---

## 6. Fact check (corrections to v1)

Sources: NSSDCA, NASA/JPL, Photojournal (links in `.agents/rules/30-facts.md`).

| v1 said | Correct / safer wording | Status |
|---|---|---|
| Oppy "holds the world record" | Held it from 2014–15 until **Perseverance passed it on 11 Oct 2026** (45.22 km vs Oppy's 45.16 km) | ❌ fixed |
| Oppy found "lakes and oceans" | Found minerals like **hematite "blueberries"** that form in water, showing **liquid water once soaked the ground** | ❌ fixed |
| Sojourner "proved ancient water flowed" | Don't claim this. Sojourner's job: prove a rover can drive and study rocks (APXS) on Mars | ❌ fixed |
| Sojourner 11.5 kg | **10.5 kg** (NSSDCA). JPL says 10.6 kg, so write "about 10.5 kg (23 lb)" | ❌ fixed |
| Sojourner "first wheels on another world" | **First rover on Mars.** (The Soviet Lunokhod 1 drove on the Moon in 1970.) | ⚠️ wording |
| Sojourner lasted… | Planned 7 days, worked **83 days** | ✅ |
| Pathfinder site 19.33 N, 33.55 W | ✅ matches NSSDCA (early reports said 19.13 N, 33.22 W) | ✅ |
| Surveyor 3 landing mass 296 kg | Sources say 296 or 302 kg, so write "**about 300 kg**". Launch 1,026 kg ✅ | ⚠️ wording |
| Surveyor 3 site 3.01 S, 23.42 W | ✅ (NASA: ~3° S, 23.41° W) | ✅ |
| Image `PIA00358` (Surveyor 3) | **Not found.** Pick a verified Surveyor 3 photo from the Apollo 12 set | ❌ replace |
| `AS12-48-7133` "Conrad examining the camera" | Two NASA captions disagree on this frame. **Open the image and check** before writing the caption | ⚠️ check |
| `PIA22359` (Oppy selfie) | **Not found.** Use **PIA22929** (Oppy's last image, sol 5,111, 10 June 2018), **PIA22930** (last images as the dust storm darkened the sky), **PIA22908** (final 360° panorama) | ❌ replace |
| Oppy 45.16 km, 90-sol plan, ~15 years, landed 25 Jan 2004 at 1.95 S, 354.47 E | ✅. Last contact **10 June 2018**, mission declared over **13 Feb 2019** | ✅ |
| "6,315 pictures", "13 W solar", "185 kg", "designed for 1,000 m" | Not verified yet. Check NSSDCA before using, or leave out | ⚠️ verify |
| Engineer stories (Donna Shirley, Squyres, "Mars time") | Fine as storytelling. **No made-up quotes.** Teams shifted their day ~40 min daily because a Mars day (sol) is ~24 h 40 min | ✅ wording |

---

## 7. 1.5-day build schedule

| When | Do | Done when |
|---|---|---|
| **Sat (today) – 1 h** | Install Node, set up the project, rules files, fonts, suits | Site runs locally, suit switcher works |
| **Sat – 3 h** | Prologue + ActScene template + audio dock + karaoke | One full act plays with synced text |
| **Sat – 2 h** | Gemini art (§B in PROMPTS.md), download NASA photos, compress | All images in `public/img` |
| **Sat night – 2 h** | Fill all 3 acts from `missions.js`, add one interaction per act | Whole story plays start to finish |
| **Sun AM – 2 h** | Globe3D (lazy), Opportunity model, Epilogue, Credits | — |
| **Sun midday – 2 h** | Mobile/tablet pass, reduced motion, Lighthouse check, deploy to Vercel | Lighthouse Performance ≥ 85 on mobile |
| **Sun PM – 1.5 h** | 30-sec demo video + Space Apps project page | Submitted by **8 PM** |
| Spare time | Ghost Robot Map, quiz/badge | — |

**Cut list if behind (cut in this order):** Opportunity 3D model → globe (use a flat image pan instead) → Then/Now slider → suit sparkle effects. **Never cut:** audio + karaoke, real photos, Science Files, mobile layout.

---

## 8. Submission checklist (official Space Apps guide)

- [ ] Project page in **English**: title, short description, how NASA data was used, list of tools, and an **AI-use note** (AI voice narration, Gemini illustrations, AI coding assistant)
- [ ] **Demo:** a **≤30-second** screen recording of the site (the AI narration is fine; no kid's face, voice or name), on YouTube as *Unlisted* (opens without sign-in). Alternative: ≤7 slides as a public Google Slides link
- [ ] **Final project link:** the Vercel URL + public GitHub repo
- [ ] Open every link in a private/incognito window to confirm it's public
- [ ] Space Apps logo only, no NASA meatball. Credits page lists every NASA image ID
- [ ] Submitted well before 11:59 PM local time

---

## 9. Ideas for later (after the hackathon)
Ghost Robot Map, a 3-question quiz that unlocks the Mission Patch, a printable colouring page of each robot (from the blueprint SVGs), a translated narration, and a "send a command to Mars" button that makes you wait (sped-up) for the radio delay.
