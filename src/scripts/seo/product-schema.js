/* Strukturierte Daten (schema.org Product) für Google, als JSON-Text für <script type="application/ld+json">. */
import { SITE_URL } from '../config.js';
import { averageRating } from '../catalog/reviews.js';
import { effectivePrice } from '../catalog/sizes.js';

function offersOf(product) {
  const prices = product.sizes.map(effectivePrice);
  return {
    '@type': 'AggregateOffer',
    priceCurrency: 'COP',
    lowPrice: Math.min(...prices),
    highPrice: Math.max(...prices),
    offerCount: prices.length,
    availability: 'https://schema.org/InStock',
  };
}

function ratingOf(reviews) {
  if (!reviews.length) return undefined;
  const value = averageRating(reviews).toFixed(1);
  return { '@type': 'AggregateRating', ratingValue: value, reviewCount: reviews.length };
}

export function productSchema(product, reviews) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.plainDescription || product.name,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    url: `${SITE_URL}/producto/${product.slug}/`,
    offers: offersOf(product),
    aggregateRating: ratingOf(reviews),
  });
}
