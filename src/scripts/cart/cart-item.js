/* Baut aus Produkt + Größe die Warenkorb-Zeile. Läuft beim Build (data-cart-item) und im Browser. */
import { imageUrl } from '../utils/image.js';

function productPart(product) {
  return {
    productId: product.id,
    name: product.name,
    brand: product.brand,
    image: imageUrl(product.images[0], 240),
    category: product.category,
    genders: product.genders,
    ruleBrand: product.brand,
    ruleData: true,
  };
}

export function cartItemFor(product, size) {
  const sizePart = { size: size.ml, regularPrice: size.price, salePrice: size.salePrice };
  return { sku: `${product.id}-${size.ml}`, ...productPart(product), ...sizePart };
}

export function cartItemJson(product, size = product.sizes[0]) {
  return JSON.stringify(cartItemFor(product, size));
}
