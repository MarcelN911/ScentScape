/* Absenden: Code bestätigen, Bestellung in nexomar speichern, WhatsApp öffnen, Bolsa leeren. */
import { confirmCode, getRule, removeCode } from '../cart/discount.js';
import { summaryOf } from '../cart/pricing.js';
import { clearCart, getItems } from '../cart/store.js';
import { whatsappUrl } from '../utils/whatsapp.js';
import { orderMessage } from './message.js';
import { saveOrder } from './order.js';

export function currentOrder() {
  const items = getItems();
  const rule = getRule();
  return { items, rule, summary: summaryOf(items, rule) };
}

function finish(order, customer, tab) {
  const message = orderMessage({ ...order, customer });
  if (tab) tab.location.href = whatsappUrl(message);
  saveOrder(customer, order.items, order.rule);
  clearCart();
  removeCode();
}

/** Gibt null oder { message } bei einem Fehler zurück. Das Fenster öffnet direkt beim Klick (Pop-up-Sperre). */
export async function submitOrder(customer) {
  const tab = window.open('', '_blank');
  const codeError = await confirmCode(customer.phone, getItems());
  if (codeError) {
    tab?.close();
    return { message: codeError };
  }
  finish(currentOrder(), customer, tab);
  return null;
}
