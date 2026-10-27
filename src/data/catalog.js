/* Catálogo Digital: Kollektionen, Preis-Varianten und Seitenaufbau des PDFs (Texte aus der Vorlage). */

export const CATALOG_YEAR = 2026;

/* Fragancias je PDF-Seite (2 × 2) */
export const CATALOG_PER_PAGE = 4;

/*
 * key steht im Link (?coleccion=dama), gender ist der Wert aus nexomar.
 * sections: Abschnitte im PDF wie in der Vorlage. Jeder beginnt mit einer schwarzen Kopfleiste.
 */
export const CATALOG_COLLECTIONS = [
  {
    key: 'todo',
    title: 'Toda la colección',
    gender: null,
    sections: [
      { title: 'Dama', genders: ['D'] },
      { title: 'Caballero/Unisex', genders: ['C', 'U'] },
    ],
  },
  { key: 'dama', title: 'Dama', gender: 'D', sections: [{ title: 'Dama', genders: ['D'] }] },
  {
    key: 'caballero',
    title: 'Caballero',
    gender: 'C',
    sections: [{ title: 'Caballero', genders: ['C'] }],
  },
  { key: 'unisex', title: 'Unisex', gender: 'U', sections: [{ title: 'Unisex', genders: ['U'] }] },
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
