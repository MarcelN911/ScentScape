/*
 * Lieferdaten auf diesem Gerät merken, damit sie beim nächsten Kauf schon ausgefüllt sind.
 * Notizen nicht: die gehören zu genau einem Pedido.
 */
import { readJson, writeJson } from '../../utils/storage.js';

const STORAGE_KEY = 'ss_checkout_customer';
const SKIP = ['notes'];

export function rememberCustomer(customer) {
  const kept = Object.entries(customer).filter(([name]) => !SKIP.includes(name));
  writeJson(localStorage, STORAGE_KEY, Object.fromEntries(kept));
}

export function rememberedCustomer() {
  return readJson(localStorage, STORAGE_KEY, {});
}

export function fillRemembered(form) {
  const saved = rememberedCustomer();
  Object.entries(saved).forEach(([name, value]) => {
    const field = form.elements[name];
    if (field && !field.value) field.value = value;
  });
}
