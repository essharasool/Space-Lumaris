# 🚀 Project Blueprint: *Lumaris*
**Challenge:** NASA Space Apps — *Abandoned but Not Forgotten*  
**Format:** Interactive Zero-Gravity Web Storybook  
**Target Audience:** School-age kids (Ages 7–12)

---

## 🔑 Key Findings & Hackathon Clarifications
* **Topic Freedom:** NASA does **not** assign specific hardware. Your team has 100% freedom to choose which abandoned machines to feature.
* **The "Friday Night Data Drop":** NASA unlocking data on Friday night simply opens access to official photo archives, mission logs, and resource links—it does not change your topic. Use those links to verify scientific facts and add real NASA photos to your project.
* **The Golden Number (3 Products):** Focusing on **3 connected machines** gives your story a complete Beginning, Middle, and End while remaining realistic to paint, animate, and code over a hackathon weekend.
* **Submission Deadline:** Sunday, November 15, 2026, at 11:59 PM (local time).

---

## ✨ Core Creative Vision (What You Liked & Agreed On)
* **Inspiration & Vibe:** Inspired by the emotional, poetic magic of past winner *HerCode Space ("A Solar Tale")*, reimagined as a **Cosmic Scrapbook** rather than a standard linear book.
* **Antigravity UI:** Instead of regular scrolling, hand-painted objects (Polaroid cards, stars, gears, solar panels) float in **zero gravity** on the screen using CSS animations or JavaScript physics (Matter.js). Kids "catch" and click floating items to unlock each chapter.
* **Hybrid Art & AI Animation:** 
  * **Physical Art:** Your real handmade acrylic paintings and sketches digitized into transparent `.png` stickers for the floating UI.
  * **Living Animations:** Looping storybook video clips (`.mp4`) generated via **Google Flow** (using text prompts or your uploaded paintings) to bring each robot's story to life.
* **Blended Science & Story:** Each page features simple, kid-friendly storytelling on the front, paired with a clickable **"🔬 NASA Secret Science File"** badge containing exact mission dates, locations, and discoveries for the judges.

---

## 📖 The Connected Story: *"The Great Cosmic Relay Race"*
**Central Theme:** These three robots weren't just random machines—they were teammates in a relay race across space, passing the torch of exploration from the Moon to Mars.

### Act I: Surveyor 3 (The Moon, 1967) — *The Scout Who Tested the Dust*
* **The Story:** Before humans visited the Moon, scientists worried the gray dust was like quicksand. Surveyor 3 landed softly and used its metal scoop to prove the ground was solid and safe.
* **Why It Was Abandoned:** It only had a one-way ticket—no return rocket and no heaters to survive freezing lunar nights. Once its battery drained, it fell asleep in the dust.
* **Why It Is Not Forgotten:** Two and a half years later, **Apollo 12** astronauts landed right next to it, gave it a visit ("hug"), and brought its camera arm back to Earth.
* **Bridge to Act II:** *Surveyor 3 proved we could land safely on the Moon. Scientists then asked: Can we build a robot with WHEELS to drive on Mars?*

### Act II: Sojourner (Mars, 1997) — *The Bouncy Pioneer*
* **The Story:** NASA's very first Mars rover—about the size of a microwave oven. To land without crashing, she wrapped herself in giant bubble-wrap airbags and **bounced** across the red rocks before rolling out on six small wheels.
* **Why It Was Abandoned:** She relied on her base-station lander to talk to Earth. When a freezing Martian night killed the lander's battery, tiny Sojourner circled her lander until her own solar panels faded in the cold dust.
* **Why It Is Not Forgotten:** Built to last just 7 days, she explored for nearly 3 months and proved that driving on another planet works.
* **Bridge to Act III:** *Scientists took Sojourner's wheel design, made it bigger and stronger, and built her big sister to explore even farther...*

### Act III: Opportunity / "Oppy" (Mars, 2004–2018) — *The Grand Marathon Runner*
* **The Story:** Built as Sojourner's big sister, Oppy climbed craters, drove over 28 miles (a full marathon!), and discovered that ancient Mars once had real lakes and oceans of water.
* **Why It Was Abandoned:** Oppy ran on solar power. In 2018, a giant planet-wide dust storm blocked the sun for months. Without sunlight, her batteries died and her heaters shut off in the freezing cold.
* **Why It Is Not Forgotten:** Designed for 90 days, she explored for **15 years** and holds the world record for driving the farthest on another world.

### Finale: *The Torch Passes to YOU*
* Surveyor 3 tested the Moon $\rightarrow$ Sojourner tested wheels on Mars $\rightarrow$ Oppy ran a 15-year marathon. They are resting under alien skies, passing the torch of discovery to the kids reading the story.

---

## 🎨 Art, Animation & Tech Checklist

### 1. Sketchbook & Acrylic Painting List
*(Leave ~1 inch of blank white paper around each item for easy background removal)*
* **3 Main Robot Scenes:**
  1. **Surveyor 3:** 3-legged lander on gray lunar craters with its scoop arm and Earth in the dark sky.
  2. **Sojourner:** Tiny 6-wheeled rover on red Martian dirt with puffy deflated white airbags behind it.
  3. **Opportunity (Oppy):** Tall rover with wide solar panel wings on a red ridge with tire tracks behind it.
* **Floating Zero-Gravity UI Assets:** Gold stars, metallic gears/screws, a blue solar panel grid, a lunar scoop, and white Polaroid borders.
* **Background:** Deep navy/purple acrylic wash with flicked white paint splatters for a starry sky.

### 2. Google Flow Animation Clips (`.mp4`)
* **Act I (Done!):** Astronaut walking across the Moon to gently touch Surveyor 3's camera mast (`surveyor_moon.mp4`).
* **Act II (Next):** Giant white airbags bouncing across red Martian rocks, deflating, and revealing tiny 6-wheeled Sojourner.
* **Act III (Final):** Oppy exploring a Martian crater as a red dust storm rolls in, dimming the sky as she powers down to sleep.

### 3. Website Assembly (HTML / CSS / JS)
* Place your painted starry sky as the full-screen background.
* Float your cut-out `.png` Polaroids and scrapbook items using CSS `@keyframes` or Matter.js.
* Clicking a floating card opens a modal containing the **Story Text**, the **Google Flow `.mp4` animation**, and the **"🔬 NASA Secret Science File"** tab.