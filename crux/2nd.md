# Crux: *Echoes in the Dust: The Cosmic Relay Race* (Digital Web Blueprint)

## 1. Core Project Direction & Aesthetic

* **Format:** 100% digital, code-driven interactive web storybook (no physical or handmade paintings).
* **Design Inspirations:**
* **Awwwards:** High-end scroll choreography, seamless full-screen scene transitions, and immersive storytelling pacing.
* **Three.js:** 3D flying particle starfields and spatial depth.
* **CodePen:** Interactive cursor mechanics, CSS `mix-blend-mode` / `clip-path` reveals, and micro-interactions.



---

## 2. What You Asked For (Story & User Flow)

1. **The Window Intro:** Opens with a kid sitting by a window at night looking up at the Moon and Mars, wondering how humans travel to space and how off-world research works (synced with your opening narration script).
2. **The Helmet Transition:** As the story begins, the camera zooms out the window into space and the kid puts on an astronaut helmet—turning the user's screen into a first-person visor POV.
3. **Interactive Exploration & Discovery:** The user explores the dark lunar and Martian surfaces, discovering abandoned NASA hardware (**Surveyor 3**, **Sojourner**, and **Opportunity / "Oppy"**) to trigger story progression and audio.
4. **Full-Site Cohesion & Prompt:** An actionable developer prompt covering both the intro sequence and the interactive mechanics across the rest of the site.

---

## 3. Key Findings & Agreed-Upon Digital Mechanics

| Mechanic | Inspiration Source | How It Works Digitally |
| --- | --- | --- |
| **Window-to-Space Zoom** | Awwwards + Three.js | Scroll-triggered scale/zoom directly through the window into a 3D flying particle starfield, landing smoothly on the Moon/Mars surface. |
| **Glassmorphism Helmet HUD** | Modern UI / CSS | Frames the viewport edges like the inside of an astronaut visor using CSS `backdrop-filter: blur()`, overlaid with glowing SVG telemetry (blinking recording dot, coordinates, oxygen meter, target tracker). |
| **X-Ray / Blueprint Cursor Reveal** | CodePen | Tracks cursor coordinates to project a scanner mask (`clip-path` or `radial-gradient`) over dark terrain—revealing glowing neon wireframes/blueprints of buried rovers before snapping them into full digital color on click. |
| **2.5D Digital Vector Parallax** | GSAP / Framer Motion | Separates crisp digital SVG/PNG assets into distinct depth layers (starry sky, distant mountains, rovers, foreground rocks) moving at different speeds on scroll and mouse movement. |

---

## 4. Final Digital-Only Developer Prompt

```markdown
# Role & Goal
Act as an expert creative web developer specializing in React, Three.js, GSAP, and modern UI trends. Build the structure for a highly interactive storytelling website titled "Echoes in the Dust: The Cosmic Relay Race." The design language is 100% digital, high-tech, and relies on modern CSS effects, layered SVGs, and interactive cursors.

# Core Mechanics & Flow to Build:

1. **The Window-to-Space Zoom (Intro Transition)**
- Create a hero section featuring a digital scene of a kid looking out a window at the night sky, paired with the intro narration.
- On scroll trigger, implement a smooth scale/zoom transition directly into the sky, passing through a Three.js flying particle starfield before landing on the planetary surface.

2. **The Glassmorphism Helmet HUD**
- As the starfield transition ends, animate an astronaut helmet visor overlay framing the screen edges using CSS `backdrop-filter: blur(12px)` for a frosted glass effect.
- Layer glowing SVG HUD widgets over this frame (blinking red recording dot, futuristic coordinates, target tracker, and a stylized oxygen meter) that persist throughout the exploration scenes.

3. **X-Ray / Blueprint Cursor Reveal (Exploration Mode)**
- Start the Moon and Mars exploration scenes in low light.
- Implement a custom cursor that acts as an X-Ray scanner using CSS `mix-blend-mode` or a `clip-path` mask tied to mouse coordinates.
- When hovering over hidden SVG rovers (Surveyor 3, Sojourner, Opportunity), reveal a glowing neon wireframe/blueprint beneath the dust. Clicking a discovered rover snaps it into full digital color and triggers its story segment and audio.

4. **2.5D Digital Vector Parallax**
- Build a reusable parallax component using GSAP ScrollTrigger or Framer Motion.
- Accept multiple digital SVG/PNG layers (deep starry sky, midground mountains, rovers, foreground rocks) and apply distinct movement multipliers based on scroll position and mouse movement to create a deep digital diorama effect.

```