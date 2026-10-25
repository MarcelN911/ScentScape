/* Texte einer Fragancia im Catálogo Digital */
import { formatCOP } from '../utils/format.js';
import { capitalize } from '../utils/text.js';

export function catalogNotesOf(product, count) {
  if (!product.notes) return product.brand;
  return product.notes.flat().slice(0, count).map(capitalize).join(' · ');
}

export function catalogPriceOf(product) {
  return `${product.sizes.length > 1 ? 'desde ' : ''}${formatCOP(product.price)}`;
}
