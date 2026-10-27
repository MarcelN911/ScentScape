/* Catálogo Digital ohne DOM: Auswahl, Seitenzahl, Link zum PDF und Hinweistext. */
import { CATALOG_COLLECTIONS, CATALOG_PER_PAGE } from '../../../data/catalog.js';

export function createCatalogState() {
  return { collection: 0, prices: 0, phase: 'idle', progress: 0 };
}

export function itemsOf(entries, state) {
  const { gender } = CATALOG_COLLECTIONS[state.collection];
  return gender ? entries.filter((entry) => entry.gender === gender) : entries;
}

/**
 * Teilt die Fragancias auf die Abschnitte der Kollektion auf (z. B. Dama, Caballero/Unisex).
 * genderOf liest das Geschlecht: aus einem Eintrag oder aus einem Element im PDF.
 */
export function sectionsOf(collection, items, genderOf = (item) => item.gender) {
  return collection.sections
    .map((section) => ({
      title: section.title,
      items: items.filter((item) => section.genders.includes(genderOf(item))),
    }))
    .filter((section) => section.items.length);
}

/** Deckblatt plus je Abschnitt eine Seite je 4 Fragancias */
export function pagesOf(collection, items) {
  const sheets = sectionsOf(collection, items).reduce(
    (sum, section) => sum + Math.ceil(section.items.length / CATALOG_PER_PAGE),
    0,
  );
  return 1 + Math.max(1, sheets);
}

export function pdfPath(state) {
  const params = new URLSearchParams({ coleccion: CATALOG_COLLECTIONS[state.collection].key });
  if (state.prices === 1) params.set('precios', 'no');
  return `/catalogo/imprimir/?${params}`;
}

export function hintOf(state, count) {
  if (state.phase === 'ready') return 'Se abre en una pestaña nueva, lista para guardar como PDF.';
  return `Portada, ${count} fragancias y ${state.prices === 0 ? 'precios actualizados.' : 'sin precios.'}`;
}
