/*
 * Gemeinsame Hilfen für beide Wege (WhatsApp, Bold): Antwort von nexomar lesen,
 * Codes zurücknehmen, die der Server ablehnt, und die Adresse der Seite "Gracias".
 */
import { CHECKOUT_ERRORS } from '../../../data/checkout.js';
import { removeCode } from '../../cart/discount.js';
import { removeGiftCard } from '../../cart/gift-redeem.js';
import { clearCart } from '../../cart/store.js';
import { createOrder } from '../../checkout/order.js';

/** { data } bei Erfolg, { error } bei einer Ablehnung, { offline: true } ohne Verbindung. */
export async function sendOrder(order) {
  try {
    const { ok, data } = await createOrder(order);
    return ok ? { data } : { error: rejection(data) };
  } catch {
    return { offline: true };
  }
}

/** Ein abgelehnter Code fliegt raus, damit die Summe auf der Seite wieder stimmt. */
function rejection(data) {
  if (data.codigoInvalido) removeCode();
  if (data.giftCardInvalida) removeGiftCard();
  return data.error || CHECKOUT_ERRORS.network;
}

export function thanksPath(data, via) {
  const params = new URLSearchParams({ via });
  if (data?.orderId) params.set('pedido', data.orderId);
  if (data?.token) params.set('t', data.token);
  return `/checkout/gracias/?${params}`;
}

/** Nach einer erfolgreichen Bestellung ist die Bolsa leer. */
export function clearOrderState() {
  clearCart();
  removeCode();
  removeGiftCard();
}
