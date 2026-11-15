# Project Crux: *Lumaris: The Cosmic Relay Race*

## 1. Core Requirements & Agreed Constraints

* **Challenge Focus:** NASA Space Apps Challenge — *"Abandoned but not Forgotten"* (spotlighting robotic hardware left on the Moon and Mars: **Surveyor 3**, **Sojourner**, and **Opportunity**).
* **Zero Audio Re-Recording:** Existing voiceover files (`01-intro.mp3` through `05-outro.mp3` / `07-finale.mp3` in `/public/audio/`) stay completely unchanged. The website acts as a visual conductor, syncing text highlights, background transitions, and mission cards to audio timestamps.
* **NASA Narrative Rubric:** Weave official **NSSDCA** historical facts and telemetry organically into the story rather than listing dry specs. Explicitly link **engineering design → scientific discoveries** and highlight the **emotional bond between engineers and their hardware**.

---

## 2. Approved UX Flow & Design Inspiration (*Three.js + Awwwards + CodePen*)

* **Visual Theme & Typography:** Deep cosmic navy (`#050814`), glowing amber telemetry accents, cyan data readouts, warm narrative text, and clean sci-fi monospace headers.
* **Intro Experience (Interactive Exploration):**
* Opens in a dark bedroom scene where a child gazes out a frosted window at the stars.
* Clicking **"Engage Helmet HUD"** slides down a semi-transparent **Astronaut Helmet Visor** frame and activates a flashlight/spotlight cursor effect so users can explore the space environment interactively.


* **Main Storytelling (*Awwwards* Scrollytelling + *Three.js* Depth):**
* **3D Atmosphere:** Ambient Three.js starfield and drifting lunar/Martian regolith dust reacting smoothly to cursor parallax.
* **Audio-Synced Narrative:** Read-along ("karaoke") text highlights line-by-line with the audio while background visuals shift dynamically (Earth → Moon → Mars) to show how each machine operated, how it looks, and where it rests today.


* **Interactive Cards (*CodePen* Micro-Interactions + Dual Imagery):**
* Replaced plain stickers with 3D-flipping, rivet-framed **"NASA Tech-Patch Badges"** featuring wireframe blueprint hover views.
* Clicking a badge flips/opens a modal pairing **custom artwork** with **official NASA archival imagery** (e.g., `PIA00358`, `PIA01122`, `PIA22359`), NSSDCA specs, and the human backstory.


* **Outro Transition:** The Astronaut Helmet Visor HUD lifts away into glowing orbital trails, offering options to replay or inspect mission logs.

---

## 3. NSSDCA Data & Engineer-to-Product Bond

| Hardware | Location & Landing Date | Engineering & Scientific Impact (NSSDCA) | Engineer-to-Product Human Bond |
| --- | --- | --- | --- |
| **Surveyor 3** | Moon (*Oceanus Procellarum*)<br>

<br>April 20, 1967 | **1,026 kg** launch mass (296 kg landing mass); electric **Surface Soil Sampling Scoop** proved lunar regolith could support human landers. | Built by Hughes Aircraft engineers to physically dig into lunar soil; visited in Nov 1969 by Apollo 12 astronauts Pete Conrad & Alan Bean—the only probe visited by humans off-world. |
| **Sojourner** | Mars (*Ares Vallis*)<br>

<br>July 4, 1997 | **11.5 kg**, 13W solar panel, **rocker-bogie suspension**, and **APXS** spectrometer; proved ancient water flowed on Mars. | Led by Donna Shirley and a determined JPL team who overcame skepticism to build a micro-rover, feeling every jolt over Martian rocks via telemetry like a heartbeat. |
| **Opportunity** | Mars (*Meridiani Planum*)<br>

<br>January 25, 2004 | **185 kg**; used its **Rock Abrasion Tool (RAT)** and solar panels to operate nearly **15 years** (vs. 90-day goal) and drive **45.16 km**, finding water-soaked clay minerals. | Treated like a living crewmate by Steve Squyres and operators who lived on "Mars time" (shifting sleep by 40 mins daily) until its final message during the 2018 global dust storm. |

---

## 4. Technical Architecture & Final Antigravity Prompt

* **Project Structure:** React + Vite app powered by a floating retro-futuristic audio dock (`/public/audio/`) and a modular data file (`src/data/missionsData.js`) storing mission specs, human backstories, custom art paths, and NASA archival image references.

```text
Create a fully responsive, highly polished React & Vite interactive storytelling web app for the NASA Space Apps Challenge project titled "Lumaris: The Cosmic Relay Race", focusing on abandoned space hardware (Surveyor 3, Sojourner, and Opportunity) on the Moon and Mars.

DESIGN & VISUAL THEME (Awwwards & Three.js Inspired):
- Theme: Deep space cosmic navy (#050814) with amber telemetry highlights, cyan data readouts, and warm parchment text styling.
- Intro Experience: Start with an atmospheric bedroom scene where a child gazes out a frosted window at the stars, wondering about the universe. Include a smooth transition button ("Engage Helmet HUD") that slides down a semi-transparent Astronaut Helmet Visor frame and applies a flashlight/spotlight cursor reveal effect.
- Background: A responsive Three.js particle starfield and slow-moving planetary regolith/dust layer reacting smoothly to mouse movement.

AUDIO SYNCHRONIZATION ENGINE & NARRATIVE:
- Map local audio files located in /public/audio/ (supporting existing 01-intro.mp3 through final audio tracks seamlessly without requiring audio re-recording).
- Build a custom retro-futuristic floating audio player dock with play/pause, volume control, and dynamic timeline tracking.
- Scrollytelling / Karaoke Text: As each audio scene plays, highlight the corresponding narrative text line-by-line on screen, transitioning background visuals smoothly from Earth's night sky to the Moon and Mars.

THE "ENGINEER-TO-PRODUCT" BOND & NSSDCA DATA CARDS:
- Three interactive "Tech-Patch" mission cards for Surveyor 3, Sojourner, and Opportunity designed with mechanical rivet styles, wireframe blueprint hover views, and image toggles between custom artwork and official NASA archival photos.
- Each card must bridge hard NSSDCA facts with the human story of the creators:
  1. Surveyor 3: Showcasing its 1,026 kg launch mass and electric soil scoop, alongside the human connection of Hughes Aircraft engineers building an arm to dig into the Moon, later visited by Apollo 12 astronauts Pete Conrad and Alan Bean.
  2. Sojourner: Showcasing its 11.5 kg frame, 13W solar panel, APXS, and rocker-bogie suspension, highlighting Donna Shirley and the JPL team who poured grit into a micro-rover that proved water existed on Mars.
  3. Opportunity: Showcasing its Rock Abrasion Tool (RAT), solar panels, and 45.16 km marathon journey over nearly 15 years, honoring Steve Squyres and the engineers who lived on "Mars time" and treated the rover like a steadfast crewmate.

OUTRO TRANSITION:
- An immersive closing animation where the astronaut visor HUD lifts up, leaving glowing orbital trails across the screen, inviting users to replay or explore mission logs.

Ensure clean code structure, modular data architecture (src/data/missionsData.js), zero missing imports, and full mobile responsiveness.

```