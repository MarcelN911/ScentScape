import { THEME_ACCENTS, findFamily } from '../../data/families.js';

/** Bühnenfarbe einer Produktkarte: oro, rosa oder vino (nach Familie, sonst oro). */
export function themeOf(product) {
  return findFamily(product.family)?.theme ?? 'oro';
}

export function accentOf(product) {
  return THEME_ACCENTS[themeOf(product)];
}

/** Zeile über dem Produktnamen: "Especiada · Dama" oder, ohne Familie, "LATTAFA · Dama". */
export function metaLineOf(product) {
  const first = product.family ?? product.brand;
  return [first, product.genderLabel].filter(Boolean).join(' · ');
}

const EYEBROWS = { D: 'Perfume para Damas', C: 'Perfume para Caballeros', U: 'Perfume unisex' };
const LABELS = { D: 'Perfume para Dama', C: 'Perfume para Caballero', U: 'Perfume unisex' };

/** Zeile über dem Namen in Shop und Produktseite: "Perfume para Dama" */
export function labelOf(product) {
  return LABELS[product.gender];
}

export function eyebrowOf(product) {
  return EYEBROWS[product.gender];
}

export function topNotesOf(product, count = 3) {
  if (product.notes) return product.notes.flat().slice(0, count);
  return findFamily(product.family)?.notes.slice(0, count) ?? [];
}
