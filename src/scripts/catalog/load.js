/*
 * Lädt Produkte und Bewertungen beim Build (einmal, für alle Seiten).
 * Testprodukte ("PRUEBA …") und nicht verfügbare Produkte erscheinen nicht im Shop.
 */
import { ENDPOINTS, getJson } from '../api/client.js';
import { normalizeProduct } from './normalize.js';
import { normalizeReview } from './reviews.js';
import { assignSlugs } from './slugs.js';

let catalogPromise;
let reviewsPromise;

function isListed(raw) {
  return raw.disponible !== false && !/^prueba\b/i.test(raw.nombre ?? '');
}

async function loadCatalog() {
  const raw = await getJson(ENDPOINTS.products);
  const products = raw.filter(isListed).map(normalizeProduct);
  return assignSlugs(products.filter((product) => product.sizes.length > 0));
}

async function loadReviews() {
  const raw = await getJson(ENDPOINTS.reviews);
  return raw.map(normalizeReview).filter((review) => review.text && review.rating > 0);
}

export function getCatalog() {
  catalogPromise ??= loadCatalog();
  return catalogPromise;
}

export function getReviews() {
  reviewsPromise ??= loadReviews();
  return reviewsPromise;
}
