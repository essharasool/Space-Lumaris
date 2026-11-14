# PROMPTS.md: copy-paste steps (in order)

**How to use this:** do one prompt at a time. Start a **new chat** in Antigravity for each section (A1, A2, …) so Gemini Flash stays fast and cheap. After each step works, save it with git (ask your brother the first time).

---

## A0. One-time setup (brother helps, about 15 min)

1. Install **Node.js LTS** from nodejs.org.
2. First save everything: `git add -A` then `git commit -m "plan"`. Then, in the `essha` folder terminal (if it asks "directory not empty", choose **Ignore files and continue**, NEVER "Remove"):
```bash
npm create vite@latest . -- --template react
npm i gsap @gsap/react lenis three @react-three/fiber @react-three/drei lucide-react @fontsource-variable/fraunces @fontsource-variable/atkinson-hyperlegible-next @fontsource/atkinson-hyperlegible-mono
npm i -D tailwindcss @tailwindcss/vite
npx skills add https://github.com/greensock/gsap-skills
```
   (The last line gives Antigravity official GSAP "skills". If it asks which agent, pick **antigravity**.)
3. Copy the audio files into `public/audio/` with these names (no spaces):
   `01-intro.mp3`, `02-surveyor.mp3`, `03-sojourner.mp3`, `04-oppy.mp3`, `05-outro.mp3`
4. In Antigravity → Customizations → Rules, make sure the 4 files in `.agents/rules/` are set to **Always On**.

---

## A. Build prompts for Antigravity

**A0.5: Smooth scrolling**
> Create `src/lib/smoothScroll.js` exactly like the "Smooth scrolling" section in `10-stack.md`, and call it once from `main.jsx` after registering ScrollTrigger and SplitText. Export the lenis instance so other components can call `stop()`, `start()` and `scrollTo()`. Don't change anything else.

**A1: Base + suits**
> Set up Tailwind v4 with the Vite plugin. Create `src/styles/index.css` with the 3 suits from `20-design.md`, the fluid type scale, and fonts imported in `main.jsx`. Build `src/components/SuitPicker.jsx`: 3 round buttons (Stardust, Rocketeer, Daylight) that set `data-suit` on `<html>` and save it to localStorage. Show a test page with an h1, a paragraph and a button so I can see the suits work. Keep it small.

**A2: Data files**
> Create `src/data/missions.js` with 3 missions (surveyor, sojourner, opportunity) using ONLY facts from `30-facts.md`. Fields: id, title, nickname, planet, date, place, coords, stats (label/value/unit array), batonLine, interaction, scienceFile (short text + sources array), photos (id, file, alt, credit). Do NOT change `src/data/narration.js`; it is already filled in.

**A3: Narration engine**
> Build `src/hooks/useNarration.js` (play, pause, seek, current time, active line index, current track, onEnded → next track) using one native Audio element. Build `AudioDock.jsx` (the only glass element: play/pause, scrubber, track name, mute; on mobile collapses to a play button + thin progress line) and `Karaoke.jsx` (active line bright, past lines dim, uses SplitText for a soft word reveal, respects reduced motion). Add a `?timing` URL mode: pressing Space logs the current time, and at the end it prints the lines array with times as JSON to the console.

**A4: Prologue**
> Build `src/scenes/Prologue.jsx`: full-screen bedroom illustration (`/img/art/bedroom.webp`) with a big Fraunces title and one button "ENGAGE HELMET". Clicking it starts track 1 and plays a GSAP zoom through the window into a dark sky. No starfield library; use a CSS/canvas dot starfield under 100 lines. Include an "Illustration (AI-assisted)" caption.

**A5: Act template**
> Build `src/scenes/ActScene.jsx` that renders any mission from `missions.js`: asymmetric layout (photo 7 cols, text 5 cols on desktop; stacked on mobile), real HUD strip (coords, date, place in mono), CountUp stats, the baton line, and a `ScienceFile.jsx` ticket-stub card that flips open and gets a "FILED ✓" stamp. Pin the photo with ScrollTrigger on desktop only. Set `data-planet` on the section. Render all 3 acts in App.jsx in order.

**A6: One hands-on interaction per act** (one prompt each, in separate chats)
> Surveyor ("digging a tiny trench"): build `TrenchDig.jsx`. The user drags a scoop down into an SVG soil layer, a trench shape appears, and a meter says "Soil is firm: safe to land!". Then build `ThenNow.jsx`, a before/after drag slider comparing `/img/nasa/surveyor-1967.webp` and `/img/nasa/surveyor-apollo12.webp`, keyboard accessible.

> Sojourner: build a size ruler where the user drags Sojourner's silhouette next to a kid silhouette and a microwave. Sizes come from missions.js.

> Opportunity: (1) "RAT grind": the user holds a button over a rock photo and a circle is "ground" open (a clip-path circle grows) to show a hematite "blueberries" close-up with a caption. (2) A "dust storm" range slider. As it goes up, a dust overlay thickens (opacity only) and a "solar power" bar drains to 0. At 0 show: "10 June 2018: Oppy's last message home. Not words, just data: no power, dark sky."

**A7: Relay track**
> Build `RelayTrack.jsx`: a thin fixed bar at the top showing Earth → Moon → Mars stops, with a small baton that moves with page scroll (ScrollTrigger scrub). Clicking a stop calls `lenis.scrollTo()` to that act (or native `scrollIntoView` if Lenis is off).

**A8: Globe (lazy 3D)**
> Build `src/scenes/Globe3D.jsx` with React Three Fiber, lazy-loaded with React.lazy and only mounted when near the viewport. One sphere with `/textures/moon_2k.webp` that swaps to `mars_2k.webp` between acts, slow rotation, and landing-site pins from missions.js coords. `dpr={[1,1.5]}`, `frameloop="demand"`. On reduced motion, show a static image instead.

**A9: Oppy 3D inspector** (skip if behind)
> Add an "Inspect Oppy in 3D" button in the Opportunity act that lazy-loads `/models/opportunity.glb` in a modal with OrbitControls and 3 hotspots (solar panels, Pancam mast, wheels) whose text comes from missions.js.

**A10: Epilogue + credits**
> Build `Epilogue.jsx`: the relay track lights up fully. Text: Perseverance passed Oppy's record on 11 Oct 2026, so the baton is still moving, and now it's yours. Add a name input that creates a downloadable "Mission Patch" (SVG to PNG, client-side only, nothing sent anywhere). Build `Credits.jsx` listing every NASA image ID + source link, fonts, the AI-use note, and the Space Apps logo (no NASA logo).

**A11: Polish pass**
> Check the whole site at 360, 768, 1024 and 1440 widths. Fix overflow, make tap targets ≥ 44px, add focus rings, check contrast in all 3 suits, add `prefers-reduced-motion` fallbacks. Then run `npm run build` and tell me the JS bundle sizes.

**If something breaks:** "Two-strike rule: explain the error in one simple sentence and tell me which git commit to go back to."

---

## B. Gemini image prompts (one consistent style)

Paste this **style line** at the start of every image prompt:
> *Style: gouache picture-book illustration, visible brush texture, limited palette of deep navy, warm amber and dusty rose, soft grain, no text, no logos, wide 16:9.*

1. **Bedroom:** "…a child seen from behind, sitting at a frosted bedroom window at night, looking up at a bright Moon and a small red dot (Mars); a toy rocket on the windowsill; cozy lamp light."
2. **Moon horizon:** "…empty grey lunar plain with soft craters, black sky, Earth as a small blue crescent, room in the middle for a photo to be placed."
3. **Mars dawn:** "…rust and butterscotch Martian plain at dawn, pale salmon sky, small rocks in the foreground, empty middle area."
4. **Dust storm sky:** "…Mars landscape fading into thick orange dust haze, the Sun a dim pale disc."
5. **Epilogue:** "…the same child from behind, now wearing a too-big astronaut helmet, on a hill at night pointing at the stars."

Rules: the child is **always seen from behind or in a helmet** (Space Apps under-18 rule, and it avoids weird AI faces). **No robots in AI art**: robots come from real NASA photos. Save as WebP at 1600 px wide (squoosh.app).

**Real NASA photos to download** (photojournal.jpl.nasa.gov/catalog/ID): PIA01122 (Sojourner), PIA22929, PIA22930, PIA22908 (Oppy's last days). For Surveyor 3, search the Apollo 12 photo set (AS12-48-…) and **look at the picture** before using its caption.

---

## C. 30-second demo video script (for judges)

Record the screen with the AI narration playing. **No faces, no kid voices, no real names.**
| Time | Show |
|---|---|
| 0–4 s | Bedroom → "ENGAGE HELMET" → zoom into space |
| 4–11 s | Surveyor 3: scoop dig + Then/Now slider |
| 11–18 s | Sojourner bounce + size ruler |
| 18–25 s | Oppy odometer to 45.16 km + dust storm slider |
| 25–30 s | Suit switch (Stardust → Rocketeer → Daylight), then the "The baton is yours" patch |

Upload to YouTube as **Unlisted**, then check that it opens in an incognito window.
