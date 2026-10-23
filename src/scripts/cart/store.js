/*
 * Warenkorb-Zustand. Gespeichert in localStorage unter demselben Schlüssel wie auf der alten Seite,
 * damit ein bestehender Warenkorb beim Umstieg erhalten bleibt.
 * Jede Änderung löst EVENTS.cartChange aus, darauf reagiert die Anzeige.
 */
import { EVENTS, emit } from '../core/events.js';
import { readJson, writeJson } from '../utils/storage.js';

const STORAGE_KEY = 'elixir_cart';
let items = typeof localStorage === 'undefined' ? [] : readJson(localStorage, STORAGE_KEY, []);

function commit(nextItems) {
  items = nextItems;
  writeJson(localStorage, STORAGE_KEY, items);
  emit(EVENTS.cartChange, items);
}

export function getItems() {
  return items;
}

export function addItem(item) {
  const existing = items.find((entry) => entry.sku === item.sku);
  if (!existing) return commit([...items, { ...item, quantity: item.quantity ?? 1 }]);
  changeQuantity(item.sku, item.quantity ?? 1);
}

export function changeQuantity(sku, delta) {
  const next = items.map((item) =>
    item.sku === sku ? { ...item, quantity: item.quantity + delta } : item,
  );
  commit(next.filter((item) => item.quantity > 0));
}

export function removeItem(sku) {
  commit(items.filter((item) => item.sku !== sku));
}

export function clearCart() {
  commit([]);
}
