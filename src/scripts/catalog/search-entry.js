/*
 * Was die Suche im Header pro Produkt braucht: Name, Marke, Bild, Preis, Link
 * und einen Suchtext aus Marke + Name (klein, ohne Akzente), z. B. "lattafa khamrah".
 */
import { toPlain } from '../utils/text.js';
import { wishEntryOf } from './wish-entry.js';

export function searchEntryOf(product) {
  return {
    ...wishEntryOf(product),
    brand: product.brand ?? '',
    search: toPlain(`${product.brand ?? ''} ${product.name}`),
  };
}
