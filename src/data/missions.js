// All story content and verified facts. Components never hard-code facts.
// Facts follow .agents/rules/30-facts.md only. Accuracy is judged.
// Text with *stars* marks the italic emotional key word (Fraunces italic).

export const story = {
  brand: 'NASA Space Apps Challenge 2026',
  category: 'Abandoned but Not Forgotten',
  title: 'Lumaris',
  headline: 'The Cosmic *Relay* Race',
  lead: 'Three robots were left on other worlds. Each one passed a baton of knowledge to the next. Now the baton is coming to you.',
  modes: {
    autopilot: { label: 'Autopilot', hint: 'The narrator flies you through the story.' },
    self: { label: 'Self-Pilot', hint: 'Scroll at your own speed. The voice follows you.' },
  },
  start: { autopilot: 'Engage helmet: Autopilot', self: 'Self-Pilot', scrollHint: 'or just scroll to steer' },
  switchToAutopilot: 'Switch to Autopilot',
  hintLabel: 'Your turn',
  tapForSound: 'Tap anywhere to hear the narrator',
  stops: ['Earth', 'Moon', 'Mars: Sojourner', 'Mars: Oppy', 'Your lap'],
  intro: {
    kicker: 'Earth · tonight',
    hud: ['Prologue', 'Earth', 'Looking up'],
  },
  outro: {
    kicker: 'Final lap · 2026 and beyond',
    title: 'Now it’s *your* lap',
    hud: ['Epilogue', 'Moon + Mars', 'Three monuments'],
    record:
      'On 11 Oct 2026, NASA’s Perseverance rover drove past Oppy’s 45.16 km record. The relay keeps going.',
    monuments: [
      { id: 'surveyor', label: 'Surveyor 3 · 1967' },
      { id: 'sojourner', label: 'Sojourner · 1997' },
      { id: 'oppy', label: 'Opportunity · 2004–2018' },
    ],
  },
  // words spoken in italics in the floating captions (matched without punctuation, lower case)
  emphasis: {
    intro: ['sky', 'quiet', 'relay', 'dreams', 'rocket'],
    surveyor: ['garden', 'safe', 'scout', 'trench', 'seeds', 'baton'],
    sojourner: ['moon', 'sojourner', 'microwave', 'apxs', 'mars'],
    oppy: ['marathon', 'fourteen', 'rat', 'water', 'rest', 'storm', 'numbers', 'sleep'],
    outro: ['abandoned', 'monuments', 'finish', 'baton', 'turn'],
  },
  aiLabel: 'AI-generated illustration',
};

export const missions = [
  {
    id: 'surveyor',
    act: 1,
    title: 'Surveyor 3',
    nickname: 'The Moon Scout',
    planet: 'moon',
    kicker: 'Leg 01 · The Moon · 1967',
    headline: 'Surveyor 3, the Moon *scout*',
    date: '20 Apr 1967',
    place: 'Oceanus Procellarum',
    coords: '3.0° S, 23.4° W',
    nssdcaId: '1967-035A',
    hint: 'Tap Surveyor 3 to dig a trench',
    hologram: 'Safe to land ✓',
    apolloTag: 'Apollo 12 · Nov 1969',
    sketch: {
      image: '/img/cutouts/surveyor.webp',
      alt: 'Hand-drawn sketch of Surveyor 3: three legs, a tall mast with a solar panel, and a digging scoop on an arm',
      badge: 'Safe to land ✓',
      facts: [
        'Landed 20 Apr 1967 in Oceanus Procellarum on the Moon.',
        'Its scoop dug small trenches to test if the ground could hold a lander.',
        'About 2.5 years later (Nov 1969), Apollo 12 astronauts Pete Conrad and Alan Bean walked over to visit it.',
        'They brought its TV camera back to Earth.',
      ],
    },
    sources: [
      { label: 'NASA Science: Surveyor 3', url: 'https://science.nasa.gov/surveyor-3' },
      { label: 'Apollo Lunar Surface Journal: Surveyor 3', url: 'https://www.nasa.gov/wp-content/uploads/static/history/alsj/a12/a12.surveyor.html' },
      { label: 'NSSDCA photo AS12-48-7133', url: 'https://nssdc.gsfc.nasa.gov/imgcat/html/object_page/a12_h_48_7133.html' },
    ],
  },
  {
    id: 'sojourner',
    act: 2,
    title: 'Sojourner',
    nickname: 'The First Mars Rover',
    planet: 'mars',
    kicker: 'Leg 02 · Mars · 1997',
    headline: 'Sojourner, the *first* Mars rover',
    date: '4 Jul 1997',
    place: 'Ares Vallis',
    coords: '19.33° N, 33.55° W',
    hint: 'Tap Sojourner to scan a rock',
    hologram: 'Size of a microwave',
    sketch: {
      image: '/img/cutouts/sojourner.webp',
      alt: 'Hand-drawn sketch of Sojourner: a small six-wheeled rover with a flat solar panel on top and a thin antenna',
      badge: 'Size of a microwave · about 10.5 kg · Worked 83 Martian days',
      facts: [
        'Landed 4 Jul 1997 at Ares Vallis, bouncing down inside airbags.',
        'The first rover on Mars: six wheels, about 10.5 kg (23 lb).',
        'Planned to work for 7 days. It worked for 83!',
        'Its APXS tool read what Mars rocks are made of.',
      ],
    },
    sources: [
      { label: 'NSSDCA: Mars Pathfinder', url: 'https://nssdc.gsfc.nasa.gov/planetary/mesur.html' },
      { label: 'NASA JPL: Mars Pathfinder & Sojourner', url: 'https://www.jpl.nasa.gov/missions/mars-pathfinder-sojourner-rover' },
      { label: 'NASA Photojournal PIA01122', url: 'https://photojournal.jpl.nasa.gov/catalog/PIA01122' },
    ],
  },
  {
    id: 'oppy',
    act: 3,
    title: 'Opportunity',
    nickname: 'Oppy',
    planet: 'mars',
    kicker: 'Leg 03 · Mars · 2004–2018',
    headline: 'Opportunity, the *marathon* runner',
    date: '25 Jan 2004',
    place: 'Meridiani Planum',
    coords: '1.95° S, 354.47° E',
    hint: 'Tap Oppy’s arm to grind a rock',
    hologram: 'Hematite “blueberries”',
    tracksLabel: '45.16 km of tracks',
    telemetry: { label: 'Last contact', sol: 'Sol 5,111', date: '10 Jun 2018' },
    sketch: {
      image: '/img/cutouts/oppy.webp',
      alt: 'Hand-drawn sketch of the Opportunity rover: six wheels, blue solar wings, a camera mast and a robotic arm',
      badge: 'Hematite “blueberries” · a clue to ancient water',
      facts: [
        'Landed 25 Jan 2004 at Meridiani Planum.',
        'Built for 90 sols (Mars days). It explored for over 14 years.',
        'Its RAT tool ground into rocks and found hematite “blueberries”, which form in water. Water once soaked the ground here.',
        'It drove 45.16 km (28.06 mi), an off-world record until Perseverance passed it on 11 Oct 2026.',
      ],
      note: 'Oppy’s last message was data, not words. It showed no power left and a dark sky.',
    },
    sources: [
      { label: 'NASA Science: MER Opportunity', url: 'https://science.nasa.gov/mission/mer-opportunity/' },
      { label: 'NASA JPL: Six Things to Know About Opportunity', url: 'https://www.jpl.nasa.gov/news/six-things-to-know-about-nasas-opportunity-mars-rover/' },
      { label: 'NASA Photojournal PIA22929 (last image, sol 5,111)', url: 'https://photojournal.jpl.nasa.gov/catalog/PIA22929' },
    ],
  },
];

export const credits = {
  assets: [
    {
      label: 'Opportunity 3D model: NASA 3D Resources, “Mars Exploration Rover – Opportunity (MER-B)”',
      url: 'https://github.com/nasa/NASA-3D-Resources',
    },
    { label: 'Moon color map: NASA SVS CGI Moon Kit', url: 'https://svs.gsfc.nasa.gov/4720' },
    { label: 'NASA 3D Resources: Spirit and Opportunity rover', url: 'https://science.nasa.gov/resource/spirit-and-opportunity-rover-3d-model/' },
  ],
  built: [
    'Surveyor 3, Sojourner, the rocket and the explorer are simple 3D models built by hand for this project (no photos of real people).',
    'The rover drawings in the sketchbook are AI-generated and labelled “AI-generated illustration”.',
    'The narrator voice was made with ElevenLabs AI. Code was written with help from AI coding tools.',
    'The narrator is an AI voice. No faces or voices of anyone under 18 appear anywhere.',
    'The explorer always wears a mirrored helmet, so no face is ever shown.',
  ],
  type: ['Fraunces', 'Atkinson Hyperlegible Next', 'Atkinson Hyperlegible Mono'],
  tools: ['three.js + React Three Fiber', 'GSAP', 'Lenis'],
};

export const badge = {
  title: 'Make your relay badge',
  intro: 'Type your explorer name. The badge is drawn on your device and never sent anywhere.',
  placeholder: 'Explorer name',
  download: 'Download badge',
  lines: ['COSMIC RELAY RACE', 'NASA SPACE APPS CHALLENGE 2026', 'THE BATON IS YOURS'],
  fallbackName: 'NEXT EXPLORER',
};
