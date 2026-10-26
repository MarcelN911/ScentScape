/*
 * Der zuletzt angelegte Pedido dieser Sitzung. Schließt jemand das Bold-Fenster und zahlt
 * dann doch, nutzt die Seite denselben Pedido weiter, statt einen zweiten anzulegen.
 * fingerprint: Warenkorb, Codes und Kundin — ändert sich etwas, entsteht ein neuer Pedido.
 */
import { readJson, removeKey, writeJson } from '../utils/storage.js';

const STORAGE_KEY = 'ss_pending_order';

export function fingerprintOf(order) {
  const { items, rule, giftCard, customer } = order;
  const lines = items.map((item) => [item.sku, item.quantity]);
  return JSON.stringify([lines, rule?.codigo, giftCard?.codigo, customer]);
}

export function getPending() {
  return readJson(sessionStorage, STORAGE_KEY, null);
}

export function savePending(pending) {
  writeJson(sessionStorage, STORAGE_KEY, pending);
}

export function clearPending() {
  removeKey(sessionStorage, STORAGE_KEY);
}
