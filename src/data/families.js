/*
 * Die fünf Duftfamilien der Vorlage.
 * theme: Bühnenfarbe der Produktkarten (oro, rosa, vino)
 * glow: Farbe des Lichtscheins im Familien-Bereich der Startseite
 * featured: Slug des Parfums, das die Familie auf der Startseite zeigt
 * notes: typische Noten, wenn ein Produkt noch keine eigene Pyramide hat
 * accent: Farbe des Lichtscheins im Bereich "Familias olfativas" der Startseite
 * image: Flasche, die die Familie auf der Startseite zeigt (Cloudinary)
 * description: Text neben der Flasche
 */
const CDN = 'https://res.cloudinary.com/dzxcpxny0/image/upload/';

export const FAMILIES = [
  {
    id: 'Especiada',
    accent: '#F0BE91',
    image: `${CDN}v1780259113/nexomar/products/gvkn8sgzyk89yobusnop.png`,
    bottle: 'KHAMRAH',
    description:
      'Fragancias cálidas e intensas con notas como canela, pimienta, cardamomo o clavo. Transmiten carácter y sensualidad.',
    glow: '#f0be91',
    line: 'Canela, azafrán y pimienta. Un calor que se queda en la piel.',
    dot: '#d9782e',
    theme: 'oro',
    featured: 'khamrah',
    notes: ['canela', 'azafrán', 'pimienta'],
  },
  {
    id: 'Floral',
    accent: '#E8A7B4',
    image: `${CDN}v1780259870/nexomar/products/jg9lfcy0u9ijrprnft4u.png`,
    bottle: 'AMETHYST',
    description:
      'La familia más clásica: rosa, jazmín, peonía o azahar. Aromas románticos, femeninos y luminosos.',
    glow: '#61031b',
    line: 'Rosa, jazmín y peonía en plena luz.',
    dot: '#e090a0',
    theme: 'rosa',
    featured: 'amethyst',
    notes: ['rosa', 'jazmín', 'muguet'],
  },
  {
    id: 'Amaderada',
    accent: '#531019',
    image: `${CDN}v1780129567/nexomar/products/v2drbrjxce0sqi6gf0fh.png`,
    bottle: 'AMBER OUD RUBY',
    description:
      'Notas de sándalo, cedro, vetiver o pachulí. Elegantes, profundas y de gran permanencia.',
    glow: '#d4af7d',
    line: 'Oud, cedro y ámbar gris. Profundidad y carácter.',
    dot: '#a0603a',
    theme: 'vino',
    featured: 'amber-oud-ruby',
    notes: ['oud', 'cedro', 'ámbar'],
  },
  {
    id: 'Fresca',
    accent: '#F0BE91',
    image: `${CDN}v1780129590/nexomar/products/lhwwxkongihno3wcmsjp.png`,
    bottle: 'BOSS BOTTLED TONIC',
    description:
      'Cítricos, notas acuáticas y verdes como bergamota, limón o menta. Ligeras, limpias e ideales para el día.',
    glow: '#f0be91',
    line: 'Cítricos, menta y notas acuosas. Aire limpio.',
    dot: '#4ab0b0',
    theme: 'oro',
    featured: 'boss-bottled-tonic',
    notes: ['limón', 'bergamota', 'acuosa'],
  },
  {
    id: 'Dulce',
    accent: '#E8A7B4',
    image: `${CDN}v1780129570/nexomar/products/jplkstv2cg8g5jypninv.png`,
    bottle: 'CLOUD PINK',
    description:
      'También llamada gourmand: vainilla, caramelo, frutos rojos o praliné. Envolventes, cálidas y adictivas.',
    glow: '#f0be91',
    line: 'Vainilla, praliné y frutas. Un antojo elegante.',
    dot: '#ee9cc0',
    theme: 'rosa',
    featured: 'cloud-pink',
    notes: ['vainilla', 'praliné', 'frambuesa'],
  },
];

export const THEME_ACCENTS = { oro: '#d4af7d', rosa: '#f0be91', vino: '#61031b' };

export const NOTE_TIERS = [
  { label: 'Salida', long: 'Nota de salida', time: '0 – 15 min' },
  { label: 'Corazón', long: 'Nota de corazón', time: '15 min – 3 h' },
  { label: 'Fondo', long: 'Nota de fondo', time: '3 h en adelante' },
];

export function findFamily(id) {
  return FAMILIES.find((family) => family.id === id) ?? null;
}
