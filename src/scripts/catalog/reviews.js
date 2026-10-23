import { toPlain } from '../utils/text.js';

export function normalizeReview(raw) {
  return {
    id: String(raw._id),
    name: raw.nombre ?? '',
    rating: Number(raw.calificacion) || 0,
    text: raw.texto ?? '',
    city: raw.ciudad ?? '',
    product: raw.producto ?? null,
    date: raw.createdAt ?? null,
  };
}

export function reviewsForProduct(reviews, product) {
  const key = toPlain(product.name);
  return reviews.filter((review) => review.product && toPlain(review.product) === key);
}

export function averageRating(reviews) {
  if (!reviews.length) return 0;
  return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
}

export function starsOf(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}
