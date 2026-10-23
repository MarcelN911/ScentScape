/* Daten für die schwebende Vorschau in der Listenansicht (als JSON am Element). */
import { formatCOP } from '../utils/format.js';
import { imageUrl } from '../utils/image.js';
import { capitalize } from '../utils/text.js';
import { accentOf, eyebrowOf, metaLineOf, sizesTextOf, topNotesOf } from './theme.js';

export function previewJson(product) {
  return JSON.stringify({
    name: product.name,
    meta: metaLineOf(product),
    eyebrow: eyebrowOf(product),
    description: product.plainDescription.slice(0, 220),
    price: formatCOP(product.price),
    sizes: sizesTextOf(product),
    image: imageUrl(product.images[0], 700),
    cover: product.hasCoverPhoto,
    notes: topNotesOf(product).map(capitalize),
    accent: accentOf(product),
  });
}
