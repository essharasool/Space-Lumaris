// Narration lines for the karaoke captions.
// `t` = second the line starts. Fill these with the ?timing mode (see TODO.md).
// Text is copied from content/scripts.md. If a line is re-recorded, change it here too.

export const tracks = [
  {
    id: 'intro',
    src: '/audio/01-intro.mp3',
    title: 'Prologue: The Window',
    lines: [
      { t: 0, text: 'Look up at the night sky.' },
      { t: 0, text: 'Past the clouds, past the floating satellites, all the way to the Moon and Mars.' },
      { t: 0, text: "It looks quiet, doesn't it?" },
      { t: 0, text: 'But if you look really closely, you might see the tracks of the greatest relay race in history.' },
      { t: 0, text: 'A race that took decades, where the runners were made of metal, wire, and dreams.' },
      { t: 0, text: 'Our story begins not with a starting pistol, but with a rocket.' },
    ],
  },
  {
    id: 'surveyor',
    src: '/audio/02-surveyor.mp3',
    title: 'Leg 1: Surveyor 3',
    lines: [
      { t: 0, text: 'Think of space like a giant, dark garden.' },
      { t: 0, text: 'Before humans could visit, we needed to know if the soil was safe.' },
      { t: 0, text: 'In 1967, a brave little scout named Surveyor 3 landed on the Moon.' },
      { t: 0, text: "It didn't have wheels to run; it just sat quietly, digging a tiny trench in the dirt." },
      { t: 0, text: 'It was planting one of the very first seeds of our cosmic garden,' },
      { t: 0, text: 'safely passing the baton to the Apollo astronauts who came to visit it two and a half years later.' },
    ],
  },
  {
    id: 'sojourner',
    src: '/audio/03-sojourner.mp3',
    title: 'Leg 2: Sojourner',
    lines: [
      { t: 0, text: "The race didn't stop at the Moon." },
      { t: 0, text: 'In 1997, millions of miles away on Mars, a tiny rover named Sojourner rolled out.' },
      { t: 0, text: 'It was no bigger than a microwave, moving like a slow, careful skateboard.' },
      { t: 0, text: 'Using its special APXS tool, it sniffed the Martian rocks, tasting the chemistry of an alien world.' },
      { t: 0, text: 'The baton had made it all the way to Mars!' },
    ],
  },
  {
    id: 'oppy',
    src: '/audio/04-oppy.mp3',
    title: 'Leg 3: Opportunity',
    lines: [
      { t: 0, text: 'Then came the marathon runner.' },
      { t: 0, text: 'In 2004, Opportunity bounced onto the red dirt.' },
      { t: 0, text: "'Oppy' was built to run for just 90 days, but it kept going for fourteen years!" },
      { t: 0, text: 'It used a tough little tool called the RAT to grind into rocks, unlocking secrets about ancient water.' },
      { t: 0, text: 'But even marathon runners need to rest.' },
      { t: 0, text: 'When a massive dust storm blocked the sun, Oppy sent its last message home.' },
      { t: 0, text: "It wasn't words, just numbers, but the numbers said: no power left, and the sky is dark." },
      { t: 0, text: 'The great runner finally went to sleep in the dust.' },
    ],
  },
  {
    id: 'outro',
    src: '/audio/05-outro.mp3',
    title: 'Epilogue: Your Turn',
    lines: [
      { t: 0, text: 'Some people look at Surveyor, Sojourner, and Opportunity and think they are abandoned.' },
      { t: 0, text: "But they aren't lost. They are monuments." },
      { t: 0, text: 'They are the finish lines for the next generation of explorers.' },
      { t: 0, text: 'They wait silently in the dark, holding the baton out, ready for us to come back and run the next lap.' },
      { t: 0, text: "The race isn't over. It's just your turn to run." },
    ],
  },
];
