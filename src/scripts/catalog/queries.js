import { FAMILIES } from '../../data/families.js';

export function findBySlug(catalog, slug) {
  return catalog.find((product) => product.slug === slug) ?? null;
}

function popularity(product) {
  return (product.badge ? 1000 : 0) + (product.featured ? 500 : 0) + product.hearts;
}

export function bestsellers(catalog, limit) {
  return [...catalog].sort((a, b) => popularity(b) - popularity(a)).slice(0, limit);
}

/* Gleiches Geschlecht (oder Unisex) zählt am meisten, dann gemeinsame Duftfamilien */
function relatedScore(product, other) {
  const sameGender = other.gender === product.gender || other.gender === 'U' ? 3 : 0;
  const shared = other.scentFamilies.filter((family) => product.scentFamilies.includes(family));
  return sameGender + shared.length;
}

export function relatedTo(product, catalog, limit = 8) {
  return catalog
    .filter((other) => other.id !== product.id)
    .sort(
      (a, b) =>
        relatedScore(product, b) - relatedScore(product, a) || popularity(b) - popularity(a),
    )
    .slice(0, limit);
}

export function familiesWithProducts(catalog) {
  return FAMILIES.filter((family) => catalog.some((product) => product.family === family.id));
}

export function countByFamily(catalog, familyId) {
  return catalog.filter((product) => product.family === familyId).length;
}
