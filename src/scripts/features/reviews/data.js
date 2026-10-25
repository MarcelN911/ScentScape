/* Bewertungen filtern und zählen (ohne DOM). */
import { toPlain } from '../../utils/text.js';

/** Fragancias mit Bewertungen, passend zur Suche, die meistbewerteten zuerst */
export function productsWithReviews(reviews, query) {
  const counts = new Map();
  reviews.forEach((review) => {
    if (review.product) counts.set(review.product, (counts.get(review.product) ?? 0) + 1);
  });
  return [...counts]
    .filter(([name]) => toPlain(name).includes(toPlain(query)))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
}

export function averageOf(reviews) {
  return reviews.reduce((sum, review) => sum + review.rating, 0) / (reviews.length || 1);
}

/** filter: { stars, product (genauer Name) oder query (Teil des Namens) } */
export function filterReviews(reviews, filter) {
  return reviews.filter((review) => {
    if (filter.stars && Math.round(review.rating) !== filter.stars) return false;
    if (filter.product) return review.product === filter.product;
    return !filter.query || toPlain(review.product).includes(toPlain(filter.query));
  });
}

export function plural(count, one, many) {
  return `${count} ${count === 1 ? one : many}`;
}
