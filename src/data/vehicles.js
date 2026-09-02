/**
 * The collection.
 *
 * Everything the interface shows for a car — copy, figures, framing, the word
 * that sits behind it — lives here, so switching cars is a single index change
 * and no component ever needs to know which car it is drawing.
 *
 * `presentation` describes how the model should be staged rather than how it
 * was authored: the loader measures each GLB and normalises scale, centre and
 * ground contact, then applies these per-car refinements on top.
 */
export const VEHICLES = [
  {
    id: 'aurum',
    /* The model number, set enormous behind the car. */
    /* The car's own colour, which the page takes its accent and the room's
       haze from. Warm platinum: the body is white but every highlight on it is champagne. */
    paint: '#e8dfcd',
    code: '1180S',
    /* The two figures the composition leads with. */
    headline: [
      { value: '1,180', unit: 'ps', label: 'Power' },
      { value: '352', unit: 'km/h', label: 'Top Speed' },
    ],
    index: 0,
    name: 'Aurum',
    year: '2024',
    title: 'Weight, removed',
    statement: 'We believe lightness is the only honest luxury',
    description:
      'Aurum is the founding car: a carbon monocoque wrapped in one unbroken surface, built to make 1,180 kg feel like an argument rather than a number. Nothing on it is there to be seen — the intakes feed, the vanes turn air, the wing works.',
    secondary:
      'Every car is finished by a single team over eleven weeks. Twenty-four will be built, and the last of them is already spoken for.',
    model: '/models/aurum.glb',
    /* The card opposite the copy: our figures rather than a film still. */
    specs: [
      { label: 'Power', value: '1,180', unit: 'ps' },
      { label: '0 – 100', value: '2.6', unit: 's' },
      { label: 'Kerb mass', value: '1,180', unit: 'kg' },
      { label: 'Built', value: '24', unit: 'cars' },
    ],
    mediaLabel: 'Inspect the Aurum without the interface',
    presentation: {
      /* Share of the viewport height the car should occupy. These cars are
         long and low, so a share that would suit an upright vehicle makes them
         enormous across; the numbers here are lower than the reference's for
         that reason alone. */
      fill: 0.46,
      /* Yaw that turns the authored front towards a front three-quarter view. */
      yaw: -0.62,
      /* Fine vertical nudge, in multiples of the car's height. */
      lift: 0,
      /* Relative width of the word set behind the model. */
      typeScale: 0.88,
    },
  },
  {
    id: 'nocturne',
    /* The model number, set enormous behind the car. */
    /* The car's own colour, which the page takes its accent and the room's
       haze from. Cool silver, against the Aurum's warm one — same white paint, different light in it. */
    paint: '#c8d2da',
    code: '1020S',
    /* The two figures the composition leads with. */
    headline: [
      { value: '1,020', unit: 'ps', label: 'Power' },
      { value: '340', unit: 'km/h', label: 'Top Speed' },
    ],
    index: 1,
    name: 'Nocturne',
    year: '2025',
    title: 'Quiet, at speed',
    statement: 'We believe a fast car should still be a place to sit',
    description:
      'Nocturne trades a measure of the Aurum’s ferocity for a cabin you can hold a conversation in at three hundred. The aerodynamic work moved to the underbody so the silhouette could stay calm above it.',
    secondary:
      'The rear wing is active but never theatrical: eleven degrees of travel, and invisible from the kerb.',
    model: '/models/nocturne.glb',
    specs: [
      { label: 'Power', value: '1,020', unit: 'ps' },
      { label: '0 – 100', value: '2.9', unit: 's' },
      { label: 'Top speed', value: '340', unit: 'km/h' },
      { label: 'Built', value: '40', unit: 'cars' },
    ],
    mediaLabel: 'Inspect the Nocturne without the interface',
    presentation: {
      fill: 0.44,
      yaw: -0.62,
      lift: 0,
      typeScale: 0.88,
    },
  },
  {
    id: 'vermilion',
    /* The model number, set enormous behind the car. */
    /* The car's own colour, which the page takes its accent and the room's
       haze from. Straight off the bodywork. */
    paint: '#d8291c',
    code: '980R',
    /* The two figures the composition leads with. */
    headline: [
      { value: '980', unit: 'ps', label: 'Power' },
      { value: '318', unit: 'km/h', label: 'Top Speed' },
    ],
    index: 2,
    name: 'Vermilion',
    year: '2026',
    title: 'One purpose only',
    statement: 'We believe some cars should not be asked to behave',
    description:
      'No sound deadening, no infotainment, no concession to the road. Vermilion is the Nocturne chassis stripped back to its intent and painted the one colour the house keeps for cars built to be driven at the limit.',
    secondary:
      'Homologated for track use. A road package exists; nobody here will recommend it to you.',
    model: '/models/vermilion.glb',
    specs: [
      { label: 'Power', value: '980', unit: 'ps' },
      { label: '0 – 100', value: '2.4', unit: 's' },
      { label: 'Downforce', value: '860', unit: 'kg' },
      { label: 'Built', value: '12', unit: 'cars' },
    ],
    mediaLabel: 'Inspect the Vermilion without the interface',
    presentation: {
      fill: 0.47,
      yaw: -0.62,
      lift: 0,
      typeScale: 1,
    },
  },
  {
    id: 'solaire',
    /* The model number, set enormous behind the car. */
    /* The car's own colour, which the page takes its accent and the room's
       haze from. The plating. */
    paint: '#e2952a',
    code: '1250G',
    /* The two figures the composition leads with. */
    headline: [
      { value: '1,250', unit: 'ps', label: 'Power' },
      { value: '355', unit: 'km/h', label: 'Top Speed' },
    ],
    index: 3,
    name: 'Solaire',
    year: '2026',
    title: 'Struck, not painted',
    statement: 'We believe a commission should outlive the commissioner',
    description:
      'Solaire is not painted gold; it is finished in it. The panels are polished, plated and lacquered by the same house that gilds cathedral doors, and the process takes longer than building the car underneath.',
    secondary:
      'Three will exist. Each is specified in a single meeting and never shown to the other two owners.',
    model: '/models/solaire.glb',
    specs: [
      { label: 'Power', value: '1,250', unit: 'ps' },
      { label: '0 – 100', value: '2.5', unit: 's' },
      { label: 'Top speed', value: '355', unit: 'km/h' },
      { label: 'Built', value: '3', unit: 'cars' },
    ],
    mediaLabel: 'Inspect the Solaire without the interface',
    presentation: {
      fill: 0.46,
      yaw: -0.62,
      lift: 0,
      typeScale: 0.88,
    },
  },
  {
    id: 'viridian',
    /* The model number, set enormous behind the car. */
    /* The car's own colour, which the page takes its accent and the room's
       haze from. The one finish offered. */
    paint: '#1ea34b',
    code: '940T',
    /* The two figures the composition leads with. */
    headline: [
      { value: '940', unit: 'ps', label: 'Power' },
      { value: '330', unit: 'km/h', label: 'Top Speed' },
    ],
    index: 4,
    name: 'Viridian',
    year: '2027',
    title: 'The roof is optional',
    statement: 'We believe the best cabin is the one you can open',
    description:
      'Viridian answers the one request the house hears more than any other: the Nocturne, with the sky in it. The structure was designed open from the first sketch, so nothing had to be added back to keep it stiff.',
    secondary:
      'The green is mixed in-house from seven pigments and is the only finish offered. Choosing the colour was never part of the commission.',
    model: '/models/viridian.glb',
    specs: [
      { label: 'Power', value: '940', unit: 'ps' },
      { label: '0 – 100', value: '2.8', unit: 's' },
      { label: 'Top speed', value: '330', unit: 'km/h' },
      { label: 'Built', value: '60', unit: 'cars' },
    ],
    mediaLabel: 'Inspect the Viridian without the interface',
    presentation: {
      fill: 0.46,
      yaw: -0.62,
      lift: 0,
      typeScale: 1,
    },
  },
];

export const VEHICLE_COUNT = VEHICLES.length;

/**
 * The custom properties a car imposes on the page.
 *
 * One authored colour per car, taken off its bodywork; the lit variant and the
 * channel triple are derived so the data never has to hold the same colour
 * three times. The triple is for `rgb(var(--accent-rgb) / a)`, which is how the
 * gradients tint without having to know the colour.
 */
export function paintVars(vehicle) {
  const hex = vehicle.paint;
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  // The hover state is the same colour with some of the room's light on it.
  const lit = channels.map((c) => Math.round(c + (255 - c) * 0.24));

  return {
    '--accent': hex,
    '--accent-rgb': channels.join(' '),
    '--accent-lit': `rgb(${lit.join(' ')})`,
  };
}

/** Zero-padded car number, as shown in the counter and the menu. */
export const projectNumber = (index) => String(index + 1).padStart(2, '0');
