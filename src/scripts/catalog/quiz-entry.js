/* Kurzform eines Produkts für den Test olfativo (wird als /data/quiz.json ausgeliefert). */
import { cartItemFor } from '../cart/cart-item.js';
import { formatCOP } from '../utils/format.js';
import { imageUrl } from '../utils/image.js';
import { accentOf } from './theme.js';

function displayOf(product) {
  return {
    image: imageUrl(product.images[0], 500),
    price: formatCOP(product.price),
    accent: accentOf(product),
    notes: product.notes,
  };
}

export function quizEntryOf(product) {
  const { slug, name, gender, genderLabel, family } = product;
  return {
    ...{ slug, name, gender, genderLabel, family },
    search: product.searchText,
    ...displayOf(product),
    cartItem: cartItemFor(product, product.sizes[0]),
  };
}
