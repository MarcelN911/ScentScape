/* Absenden: Code bestätigen, Bestellung speichern, WhatsApp öffnen, Warenkorb leeren. */
import { confirmCode, getRule, removeCode } from '../cart/discount.js';
import { getPreferences, updatePreferences } from '../cart/preferences.js';
import { summaryOf } from '../cart/pricing.js';
import { clearCart, getItems } from '../cart/store.js';
import { whatsappUrl } from '../utils/whatsapp.js';
import { orderMessage } from './message.js';
import { saveOrder } from './order.js';

export function currentOrder() {
  const items = getItems();
  const rule = getRule();
  return { items, rule, summary: summaryOf(items, rule), preferences: getPreferences() };
}

/* Das Fenster muss direkt beim Klick aufgehen, sonst blockiert der Browser es als Pop-up. */
function openBlankTab() {
  return window.open('', '_blank');
}

function finish(order, customer, tab) {
  const message = orderMessage({ ...order, customer });
  if (tab) tab.location.href = whatsappUrl(message);
  saveOrder(customer, order.items, order.rule);
  clearCart();
  removeCode();
  updatePreferences({ gift: false, note: '', date: '' });
  return message;
}

/** Gibt { error } oder { message, total, modeKey } zurück. */
export async function submitOrder(customer) {
  const tab = openBlankTab();
  const codeError = await confirmCode(customer.phone, getItems());
  if (codeError) {
    tab?.close();
    return { error: { message: codeError } };
  }
  const order = currentOrder();
  const message = finish(order, customer, tab);
  return { message, total: order.summary.total, modeKey: order.preferences.payMode };
}
