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

function relatedScore(product, other) {
  return (
    (other.family && other.family === product.family ? 2 : 0) +
    (other.gender === product.gender ? 1 : 0)
  );
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
