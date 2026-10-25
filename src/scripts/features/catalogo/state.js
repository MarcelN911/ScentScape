/* Catálogo Digital ohne DOM: Auswahl, Seitenzahl, Links und Hinweistext. */
import { CATALOG_COLLECTIONS, CATALOG_PER_PAGE } from '../../../data/catalog.js';

export function createCatalogState() {
  return { collection: 0, prices: 0, client: '', phone: '', phase: 'idle', progress: 0 };
}

export function itemsOf(entries, state) {
  const { gender } = CATALOG_COLLECTIONS[state.collection];
  return gender ? entries.filter((entry) => entry.gender === gender) : entries;
}

/** Deckblatt plus eine Seite je 4 Fragancias */
export function pagesOf(count) {
  return 1 + Math.max(1, Math.ceil(count / CATALOG_PER_PAGE));
}

/** Kolumbianische Handynummer (10 Ziffern, beginnt mit 3) bekommt die 57 davor */
export function phoneNumber(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 && digits.startsWith('3') ? `57${digits}` : digits;
}

export function pdfPath(state) {
  const params = new URLSearchParams({ coleccion: CATALOG_COLLECTIONS[state.collection].key });
  if (state.prices === 1) params.set('precios', 'no');
  if (state.client.trim()) params.set('para', state.client.trim());
  return `/catalogo/imprimir/?${params}`;
}

export function whatsappLink(state, count) {
  const name = state.client.trim();
  const collection = CATALOG_COLLECTIONS[state.collection].title;
  const link = new URL(pdfPath(state), window.location.origin).href;
  const text = `Hola${name ? ` ${name}` : ''}, te comparto el catálogo ScentScape (${collection}): ${count} fragancias. ${link}`;
  return `https://wa.me/${phoneNumber(state.phone)}?text=${encodeURIComponent(text)}`;
}

export function hintOf(state, count) {
  const number = phoneNumber(state.phone);
  if (state.phase === 'ready') {
    return number
      ? `Se abrirá WhatsApp con el número +${number}.`
      : 'Se abrirá WhatsApp para que elijas el contacto.';
  }
  return `Portada, ${count} fragancias y ${state.prices === 0 ? 'precios actualizados.' : 'sin precios.'}`;
}
