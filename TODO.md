# 🧑‍🚀 Your To-Do List

Tick each box `[x]` when it's done. Do them **from top to bottom**.
⭐ = must do · 🌙 = nice to have if there's time

---

## Part 1: Fix the voice recordings (about 20 min)

The final words for all 5 files are in **`content/scripts.md`**. Only **2 files** need re-making. Don't patch them: copy the **whole script** for that file and make it fresh, in the **same voice** as the others. Then delete the old mp3.

- [ ] ⭐ **1. Re-make `04-oppy.mp3`** from the full script in `content/scripts.md`.
  Why: Oppy never really *said* "My battery is low and it's getting dark." Its last message was just **numbers** (robot data). A reporter turned those numbers into that sentence. The new script tells the true (and still sad) version.

- [ ] ⭐ **2. Re-make `02-surveyor.mp3`** from the full script in `content/scripts.md`.
  Why: the astronauts came **two and a half** years later (April 1967 → November 1969), and Surveyor 3 was **one of** the first seeds (Surveyor 1 landed first, in 1966).

- [x] **3.** `01`, `03` and `05` stay exactly as they are. Don't re-make them.

- [x] **4.** The new words are already typed into `content/scripts.md` and `src/data/narration.js`.

> Everything else in your scripts is correct. ✔️ The microwave size, APXS, the RAT, 90 days, fourteen years, and the dust storm all match NASA.

---

## Part 2: Get the project ready (with your brother, about 20 min)

- [ ] ⭐ **5.** Install **Node.js** (the "LTS" button on nodejs.org).
- [ ] ⭐ **6.** Save your work with git **before** making the project:
  `git add -A` then `git commit -m "plan and scripts"`
- [ ] ⭐ **7.** Run the setup commands in `PROMPTS.md` → **A0**.
  ⚠️ If it asks *"Current directory is not empty"*, pick **"Ignore files and continue"**. **Never** pick "Remove existing files"!
- [ ] ⭐ **8.** Put the audio files in `public/audio/` and rename them:
  `01-intro.mp3` · `02-surveyor.mp3` · `03-sojourner.mp3` · `04-oppy.mp3` · `05-outro.mp3`
- [ ] ⭐ **9.** In Antigravity, turn the 4 rule files in `.agents/rules/` to **Always On**.

---

## Part 3: Pictures (about 1.5 hours)

- [ ] ⭐ **10.** Make the 5 Gemini pictures with the prompts in `PROMPTS.md` → **B**.
  Rules: the kid is **always seen from the back or wearing a helmet**, and **no robots** in the AI pictures (we use real NASA photos for robots).
- [ ] ⭐ **11.** Shrink each picture at **squoosh.app**: WebP format, 1600 wide. Save them in `public/img/art/`.
- [ ] ⭐ **12.** Download these real NASA photos from `photojournal.jpl.nasa.gov/catalog/` + the ID, and save them in `public/img/nasa/` named by ID (like `PIA01122.webp`):
  - `PIA01122`: Sojourner next to the rocks
  - `PIA22929`: Oppy's very last picture
  - `PIA22930`: Oppy's last pictures as the sky went dark
  - `PIA22908`: Oppy's last 360° view
- [ ] ⭐ **13.** Find 2 Surveyor 3 photos (one alone in 1967, one with the Apollo 12 astronauts in 1969). For photo **AS12-48-7133**, *look at it* first, because NASA has two different descriptions of it. Write what you actually see.
- [ ] 🌙 **14.** Download the Moon picture from the NASA CGI Moon Kit (svs.gsfc.nasa.gov/4720) and a Mars picture from NASA 3D Resources. Shrink both to 2048 wide WebP and save them in `public/textures/`.
- [ ] 🌙 **15.** Download the free "Spirit and Opportunity Rover" 3D model from NASA 3D Resources, shrink it at **gltf.report** to under 3 MB, and save it as `public/models/opportunity.glb`.

---

## Part 4: Build it with Antigravity (most of the time)

- [ ] ⭐ **16.** Do prompts **A1 → A11** in `PROMPTS.md`, **one at a time, a new chat each time**. Save with git after each one works.
- [ ] ⭐ **17.** Set the karaoke timing: open the site with `?timing` at the end of the address, play each track, and tap **Space** at the start of every sentence. Copy what it prints into `narration.js` (ask Antigravity to do the pasting).

---

## Part 5: Check the facts (about 15 min)

- [ ] ⭐ **18.** Search the code for `VERIFY`. For each one, check the NASA link in `.agents/rules/30-facts.md`. If you can't confirm it, **delete it**. A missing fact is better than a wrong one.
- [ ] ⭐ **19.** Make sure the site says Oppy **held** the driving record until **Perseverance passed it on 11 October 2026** (not "still holds").
- [ ] ⭐ **20.** Every Gemini picture has the small label **"Illustration (AI-assisted)"**.

---

## Part 6: Test it (about 30 min)

- [ ] ⭐ **21.** Open the site on a **phone**, a **tablet** (or a narrow browser window) and a **computer**. Does anything stick out sideways? Can you tap every button easily?
- [ ] ⭐ **22.** Try all 3 suits: **Stardust, Rocketeer, Daylight**. Can you read everything in each one?
- [ ] ⭐ **23.** Scrolling should feel smooth and never stuck. If it's jumpy on a phone, tell Antigravity: *"Scrolling lags on my phone, follow the performance rules in 10-stack.md."*

---

## Part 7: Hand it in (by 8 PM Sunday, the real deadline is 11:59 PM)

- [ ] ⭐ **24.** Put it online: connect the GitHub repo to **Vercel** (your brother helps).
- [ ] ⭐ **25.** Record the **30-second video** (script in `PROMPTS.md` → **C**). **No faces, no kid voices, no real names.** Upload it to YouTube as **Unlisted**.
- [ ] ⭐ **26.** Fill in the Space Apps project page **in English**: what you made, which NASA data you used, and a note that you used an AI voice, Gemini pictures and an AI coding helper.
- [ ] ⭐ **27.** Open every link in a **private/incognito** window to check that strangers can see it.
- [ ] ⭐ **28.** Press **Submit**! 🚀

---

## 🌙 Bonus (only if everything above is done)
- [ ] Ghost Robot Map (other NASA robots on the Moon and Mars)
- [ ] 3-question quiz that unlocks the Mission Patch
