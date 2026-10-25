/* Was die Seite "Reseñas" im Browser braucht: kurze Bewertungen und eine kleine Produktliste. */
import { imageUrl } from '../utils/image.js';

export function reviewEntryOf(review) {
  const { name, city, rating, text, product, date } = review;
  return { name, city, rating, text, product, date };
}

export function reviewProductOf(product) {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    image: product.images[0] ? imageUrl(product.images[0], 120) : '/assets/img/scentscape-logo.png',
    href: `/producto/${product.slug}/`,
  };
}
