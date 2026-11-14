// Verified facts for the three mission acts.
// Source rules: see .agents/rules/30-facts.md.
// Never invent numbers or quotes. Accuracy is judged.

export const missions = [
  {
    id: 'surveyor',
    title: 'Surveyor 3',
    nickname: 'The Moon Scout',
    planet: 'moon',
    date: '20 Apr 1967',
    place: 'Oceanus Procellarum',
    coords: '3.0° S, 23.4° W',
    nssdcaId: '1967-035A',
    batonLine: '“Yes, the lunar ground is firm enough to land our astronauts.”',
    stats: [
      { label: 'Landed', value: '20 Apr 1967', unit: '' },
      { label: 'Landed mass', value: 'about 300', unit: 'kg' },
      { label: 'Launch mass', value: '1,026', unit: 'kg' },
      { label: 'Visited by', value: 'Apollo 12', unit: '(2.5 yrs later)' },
    ],
    interaction: 'trench',
    scienceFile: {
      headline: 'Because of the surface scoop → we learned the lunar soil holds weight',
      text: 'Surveyor 3 used a motorized scoop to dig trenches up to 17.5 cm into lunar soil. By measuring the electric motor current required to scrape the dirt, engineers proved the Moon’s crust was bearing-strength safe for the Apollo 12 lunar module and astronauts Pete Conrad and Alan Bean, who landed beside it in November 1969.',
      sources: [
        { label: 'NASA NSSDCA - Surveyor 3', url: 'https://science.nasa.gov/surveyor-3' },
        { label: 'NASA Apollo Lunar Surface Journal: Surveyor 3', url: 'https://www.nasa.gov/wp-content/uploads/static/history/alsj/a12/a12.surveyor.html' },
        { label: 'Apollo 12 Photo Catalog AS12-48-7133', url: 'https://nssdc.gsfc.nasa.gov/imgcat/html/object_page/a12_h_48_7133.html' },
      ],
    },
    photos: [
      {
        id: 'surveyor-1967',
        file: '/img/nasa/surveyor-1967.webp',
        alt: 'Surveyor 3 standing alone in a lunar crater in 1967',
        credit: 'NASA',
      },
      {
        id: 'AS12-48-7133',
        file: '/img/nasa/surveyor-apollo12.webp',
        alt: 'Apollo 12 astronaut Pete Conrad examining Surveyor 3 with the Lunar Module in the distance, November 1969',
        credit: 'NASA (AS12-48-7133)',
      },
    ],
  },
  {
    id: 'sojourner',
    title: 'Sojourner',
    nickname: 'The First Mars Rover',
    planet: 'mars',
    date: '4 Jul 1997',
    place: 'Ares Vallis (Carl Sagan Memorial Station)',
    coords: '19.33° N, 33.55° W',
    nssdcaId: '1996-068A',
    batonLine: '“Yes, wheeled robots can safely navigate and study Martian terrain.”',
    stats: [
      { label: 'Mass', value: 'about 10.5', unit: 'kg (23 lb)' },
      { label: 'Wheels', value: '6', unit: 'rocker-bogie' },
      { label: 'Planned mission', value: '7', unit: 'sols' },
      { label: 'Worked', value: '83', unit: 'sols' },
    ],
    interaction: 'ruler',
    scienceFile: {
      headline: 'Because of the APXS spectrometer → we learned the chemistry of Mars rocks',
      text: 'No bigger than a microwave oven, Sojourner was the first rover on Mars. It deployed an Alpha Particle X-Ray Spectrometer (APXS) directly against Martian rocks such as “Barnacle Bill” and “Yogi” to read their elemental chemistry, proving mobile exploration was possible beyond Earth and Moon.',
      sources: [
        { label: 'NASA NSSDCA - Mars Pathfinder', url: 'https://nssdc.gsfc.nasa.gov/planetary/mesur.html' },
        { label: 'NASA JPL - Mars Pathfinder Sojourner', url: 'https://www.jpl.nasa.gov/missions/mars-pathfinder-sojourner-rover' },
        { label: 'NASA Photojournal PIA01122', url: 'https://photojournal.jpl.nasa.gov/catalog/PIA01122' },
      ],
    },
    photos: [
      {
        id: 'PIA01122',
        file: '/img/nasa/PIA01122.webp',
        alt: 'Sojourner rover near rock Yogi at Ares Vallis on sol 22',
        credit: 'NASA/JPL (PIA01122)',
      },
    ],
  },
  {
    id: 'opportunity',
    title: 'Opportunity',
    nickname: 'Oppy',
    planet: 'mars',
    date: '25 Jan 2004',
    place: 'Meridiani Planum (Eagle Crater)',
    coords: '1.95° S, 354.47° E',
    nssdcaId: '2003-032A',
    batonLine: '“Yes, liquid water once soaked the ground of Mars.”',
    stats: [
      { label: 'Total distance', value: '45.16', unit: 'km (28.06 mi)' },
      { label: 'Designed for', value: '90', unit: 'sols' },
      { label: 'Explored for', value: 'over 14', unit: 'years' },
      { label: 'Last contact', value: '10 Jun 2018', unit: 'sol 5,111' },
    ],
    interaction: 'rat-dust',
    scienceFile: {
      headline: 'Because of the RAT grinder → we learned ancient water once soaked Mars',
      text: 'Opportunity used its Rock Abrasion Tool (RAT) to grind into Martian bedrock, revealing microscopic hematite spheres nicknamed “blueberries” that form in the presence of water. Designed for just 90 sols, Oppy explored for over 14 years. It held the off-world driving record until NASA’s Perseverance rover passed it on 11 Oct 2026.',
      sources: [
        { label: 'NASA Science - MER Opportunity', url: 'https://science.nasa.gov/mission/mer-opportunity/' },
        { label: 'NASA JPL - Six Things to Know About Opportunity', url: 'https://www.jpl.nasa.gov/news/six-things-to-know-about-nasas-opportunity-mars-rover/' },
        { label: 'NASA Photojournal PIA22929', url: 'https://photojournal.jpl.nasa.gov/catalog/PIA22929' },
        { label: 'NASA 3D Resources - Opportunity Model', url: 'https://science.nasa.gov/resource/spirit-and-opportunity-rover-3d-model/' },
      ],
    },
    photos: [
      {
        id: 'PIA22929',
        file: '/img/nasa/PIA22929.webp',
        alt: 'Opportunity’s last image transmitted from Perseverance Valley on sol 5,111',
        credit: 'NASA/JPL-Caltech (PIA22929)',
      },
      {
        id: 'PIA22930',
        file: '/img/nasa/PIA22930.webp',
        alt: 'Martian sky darkening as the global dust storm arrived over Opportunity',
        credit: 'NASA/JPL-Caltech/TAMU (PIA22930)',
      },
      {
        id: 'PIA22908',
        file: '/img/nasa/PIA22908.webp',
        alt: 'Opportunity’s final 360-degree panorama in Perseverance Valley',
        credit: 'NASA/JPL-Caltech/Cornell/ASU (PIA22908)',
      },
    ],
  },
];
