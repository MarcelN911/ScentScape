/*
 * Klick-Aktion "add-to-cart": <button data-action="add-to-cart" data-cart-item="{…}" data-quantity="1">
 * Bild fliegt zur Bolsa, Hinweis erscheint, danach öffnet sich die Bolsa.
 */
import { registerAction } from '../core/actions.js';
import { EVENTS, emit, showToast } from '../core/events.js';
import { FLIGHT_MS, flyToCart } from './fly.js';
import { addItem } from './store.js';

function sizeLabel(item) {
  return item.size ? ` · ${item.size} ml` : '';
}

/** Fügt eine Zeile hinzu und spielt die gleiche Rückmeldung wie die Buttons ab. */
export function addWithFeedback(item, source) {
  addItem(item);
  showToast(`${item.name}${sizeLabel(item)} · añadido`, { cart: true });
  flyToCart(source, item.image);
  setTimeout(() => emit(EVENTS.cartOpen), FLIGHT_MS);
}

function addFromButton(button) {
  const item = JSON.parse(button.dataset.cartItem);
  const quantity = Number(button.dataset.quantity ?? 1);
  addWithFeedback({ ...item, quantity }, button);
  button.dispatchEvent(new CustomEvent('ss:added', { bubbles: true }));
}

registerAction('add-to-cart', addFromButton);
