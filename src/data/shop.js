/* Inhalte der Produktseite (/productos/) */
export const RIBBON_NOTES = [
  'vainilla',
  'rosa',
  'oud',
  'bergamota',
  'canela',
  'jazmín',
  'ámbar',
  'limón',
  'pachulí',
  'almizcle',
  'praliné',
  'azafrán',
  'pimienta',
  'cedro',
];

export const GENDER_FILTERS = ['Todos', 'Dama', 'Caballero', 'Unisex'];

export const SORT_OPTIONS = [
  { value: 'rel', label: 'Recomendados' },
  { value: 'asc', label: 'Precio ↑' },
  { value: 'desc', label: 'Precio ↓' },
  { value: 'az', label: 'A–Z' },
];

/* Schwebende Flaschen im Hero: Slug, Position und Tiefe (Parallax-Stärke) */
export const HERO_BOTTLES = [
  {
    slug: 'khamrah',
    right: '4%',
    top: '18%',
    width: '18vw',
    opacity: 0.22,
    blur: 0,
    depth: [-50, -30],
    rotate: -10,
  },
  {
    slug: 'club-de-nuit-intense-ndt',
    right: '24%',
    top: '46%',
    width: '10vw',
    opacity: 0.12,
    blur: 3,
    depth: [-90, -60],
    rotate: 14,
  },
  {
    slug: 'amethyst',
    right: '-2%',
    top: '60%',
    width: '13vw',
    opacity: 0.16,
    blur: 1.5,
    depth: [-30, -20],
    rotate: 6,
  },
];
