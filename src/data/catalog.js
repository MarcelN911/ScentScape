/* Catálogo Digital: Kollektionen, Preis-Varianten und Seitenaufbau des PDFs (Texte aus der Vorlage). */

export const CATALOG_YEAR = 2026;

/* Fragancias je PDF-Seite (2 × 2) */
export const CATALOG_PER_PAGE = 4;

/* key steht im Link (?coleccion=dama), gender ist der Wert aus nexomar */
export const CATALOG_COLLECTIONS = [
  { key: 'todo', title: 'Toda la colección', short: 'Colección', gender: null },
  { key: 'dama', title: 'Dama', short: 'Dama', gender: 'D' },
  { key: 'caballero', title: 'Caballero', short: 'Caballero', gender: 'C' },
  { key: 'unisex', title: 'Unisex', short: 'Unisex', gender: 'U' },
];

export const CATALOG_PRICES = [
  { title: 'Con precios', sub: 'Para clientes y pedidos' },
  { title: 'Sin precios', sub: 'Para presentar la colección' },
];

export const CATALOG_TITLE = [
  ['Tu ', false],
  ['catálogo, ', false],
  ['en ', true],
  ['PDF.', true],
];

export const CATALOG_LIMITS = { client: 30, phone: 16 };
