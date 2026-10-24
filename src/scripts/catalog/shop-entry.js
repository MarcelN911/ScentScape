/*
 * Kleiner Datensatz pro Produkt für die Seite "Productos" (als JSON in der Seite).
 * Damit filtert und sortiert der Browser, und die Vorschau im Index zeigt Größen und Preise.
 */
import { cartItemFor } from '../cart/cart-item.js';
import { imageUrl } from '../utils/image.js';
import { toPlain } from '../utils/text.js';
import { effectivePrice } from './sizes.js';
import { labelOf } from './theme.js';

function sizeEntry(product, size) {
  return { ml: size.ml, price: size.price, sale: size.salePrice, item: cartItemFor(product, size) };
}

function initialOf(name) {
  return toPlain(name.trim().charAt(0)).toUpperCase();
}

function textPart(product) {
  return {
    href: `/producto/${product.slug}/`,
    name: product.name,
    brand: product.brand,
    label: labelOf(product),
    badge: product.badge,
    search: toPlain(`${product.brand} ${product.name}`),
    initial: initialOf(product.name),
  };
}

export function shopEntryOf(product, order) {
  return {
    ...textPart(product),
    id: product.id,
    order,
    gender: product.gender,
    image: imageUrl(product.images[0], 700),
    families: product.scentFamilies,
    ingredients: product.ingredients,
    price: Math.min(...product.sizes.map(effectivePrice)),
    sizes: product.sizes.map((size) => sizeEntry(product, size)),
  };
}
