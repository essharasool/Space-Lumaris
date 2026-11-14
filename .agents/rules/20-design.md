# Design rules — must NOT look AI-generated

## Suits (theme system, replaces light/dark)
Set on `<html data-suit="...">`. Saved in localStorage key `suit`. First visit: `daylight` if the OS is in light mode, else `stardust`.
Each suit only defines CSS variables:
```css
[data-suit="stardust"]  { --bg:#1B1430; --surface:#251C40; --ink:#F7EEF5; --muted:#BFB3CF; --accent:#F4A7B9; --accent-2:#B9A3E3; --accent-3:#FFD3B0; --radius:20px; }
[data-suit="rocketeer"] { --bg:#12161C; --surface:#1C222B; --ink:#EEF1F4; --muted:#9BA8B5; --accent:#FF6B1A; --accent-2:#FFC83D; --accent-3:#9BA8B5; --radius:4px; }
[data-suit="daylight"]  { --bg:#F6F0E4; --surface:#FFFFFF; --ink:#1E2A3A; --muted:#5B6675; --accent:#C0462B; --accent-2:#3D7BC4; --accent-3:#E8B04A; --radius:12px; }
```
Scenes also get `data-planet="earth|moon|mars"`, which tints backgrounds (moon = cool greys, mars = rust/butterscotch). Body text must pass WCAG AA in every suit.
Motion personality: stardust = springy (`back.out(1.6)`) + small sparkle on tap; rocketeer = snappy (`power3.out`, 0.2s) + 2px "clunk" press; daylight = gentle fades.

## Typography
- Display: Fraunces (variable; use the soft/wonky axes for warmth). Body: Atkinson Hyperlegible Next. Numbers/HUD: Atkinson Hyperlegible Mono.
- Scale (clamp): body 18→20px / 1.6; max-width 60ch; h1 44→96px; h2 32→56px; h3 24→32px; HUD labels 12–14px uppercase, letter-spacing .08em. Nothing readable below 16px except HUD labels.
- Tight display leading (1.0–1.1); use real typographic quotes and en dashes.

## BANNED (AI-slop tells)
- Purple→blue gradients, gradient text, rainbow glows, neon borders, glow on everything.
- Glassmorphism, except ONE place: the AudioDock.
- Emoji as icons or bullets in the UI.
- "Three cards with icons" grids; centered hero with gradient headline; generic CTA words.
- Fake HUD data (oxygen %, random hex, fake loaders). HUD shows REAL data from missions.js: coordinates, dates, sols, distance.
- Copy words: testament, delve, embark, journey, tapestry, unlock, unleash, seamless, cutting-edge, "dive in", "in the vast expanse".
- Fonts: Inter, Space Grotesk, Poppins, Orbitron, Montserrat.
- Lorem ipsum or placeholder stock images.

## DO
- Asymmetric layouts, generous whitespace, big real NASA photos with museum captions: `PIA01122 · NASA/JPL`.
- Tactile details: ticket-stub Science File cards, a stamped "FILED ✓" mark, a relay-track progress bar with a moving baton, thin white blueprint line drawings with numbered call-outs.
- Kid-friendly copy: short sentences, concrete comparisons ("as heavy as a bicycle", "the size of a microwave"), second person ("you").
- Every AI illustration gets a small caption: "Illustration (AI-assisted)". AI art never shows robot close-ups (use real NASA photos for robots).
- Never place the NASA logo/meatball anywhere. Use only the Space Apps Challenge logo, and never next to AI art.
