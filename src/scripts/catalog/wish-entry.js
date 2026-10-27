/* Was die Seitenleiste "Favoritos" pro Produkt braucht: Name, Bild, Preis und Link. */
import { imageUrl } from '../utils/image.js';
import { priceFromText } from './sizes.js';
import { labelOf } from './theme.js';

export function wishEntryOf(product) {
  return {
    id: product.id,
    name: product.name,
    label: labelOf(product),
    price: priceFromText(product),
    image: product.images[0] ? imageUrl(product.images[0], 200) : '/assets/img/scentscape-logo.png',
    href: `/producto/${product.slug}/`,
  };
}
