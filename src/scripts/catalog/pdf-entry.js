/* Was eine Fragancia im Catálogo Digital braucht: Bild, Name, Preis, Geschlecht. */
import { imageUrl } from '../utils/image.js';
import { catalogPriceOf } from './catalog-entry.js';

export function pdfEntryOf(product) {
  return {
    name: product.name,
    image: product.images[0] ? imageUrl(product.images[0], 400) : '/assets/img/scentscape-logo.png',
    price: catalogPriceOf(product),
    gender: product.gender,
  };
}

/** Für das PDF selbst zusätzlich Marke, Beschreibung und Größen (die Vorschau bleibt klein). */
export function pdfPageEntryOf(product) {
  return {
    ...pdfEntryOf(product),
    brand: product.brand,
    description: product.plainDescription,
    sizes: product.sizes.map((size) => size.label),
  };
}

/** Anzahl je Kollektion, z. B. { todo: 173, dama: 60, … } */
export function countByCollection(entries, collections) {
  return Object.fromEntries(
    collections.map((item) => [
      item.key,
      entries.filter((entry) => !item.gender || entry.gender === item.gender).length,
    ]),
  );
}
