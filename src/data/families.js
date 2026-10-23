/*
 * Die fünf Duftfamilien der Vorlage.
 * theme: Bühnenfarbe der Produktkarten (oro, rosa, vino)
 * featured: Slug des Parfums, das die Familie auf der Startseite zeigt
 * notes: typische Noten, wenn ein Produkt noch keine eigene Pyramide hat
 */
export const FAMILIES = [
  {
    id: 'Especiada',
    line: 'Canela, azafrán y pimienta. Un calor que se queda en la piel.',
    dot: '#d9782e',
    theme: 'oro',
    featured: 'khamrah',
    notes: ['canela', 'azafrán', 'pimienta'],
  },
  {
    id: 'Floral',
    line: 'Rosa, jazmín y peonía en plena luz.',
    dot: '#e090a0',
    theme: 'rosa',
    featured: 'amethyst',
    notes: ['rosa', 'jazmín', 'muguet'],
  },
  {
    id: 'Amaderada',
    line: 'Oud, cedro y ámbar gris. Profundidad y carácter.',
    dot: '#a0603a',
    theme: 'vino',
    featured: 'amber-oud-ruby',
    notes: ['oud', 'cedro', 'ámbar'],
  },
  {
    id: 'Fresca',
    line: 'Cítricos, menta y notas acuosas. Aire limpio.',
    dot: '#4ab0b0',
    theme: 'oro',
    featured: 'boss-bottled-tonic',
    notes: ['limón', 'bergamota', 'acuosa'],
  },
  {
    id: 'Dulce',
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
