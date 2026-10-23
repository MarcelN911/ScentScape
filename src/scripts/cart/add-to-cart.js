/*
 * Klick-Aktion "add-to-cart": <button data-action="add-to-cart" data-cart-item="{…}" data-quantity="1">
 */
import { registerAction } from '../core/actions.js';
import { showToast } from '../core/events.js';
import { flyToCart } from './fly.js';
import { addItem } from './store.js';

function addFromButton(button) {
  const item = JSON.parse(button.dataset.cartItem);
  const quantity = Number(button.dataset.quantity ?? 1);
  addItem({ ...item, quantity });
  showToast(`✓ ${item.name} · ${item.size} ml en tu carrito`);
  flyToCart(button, item.image);
  button.dispatchEvent(new CustomEvent('ss:added', { bubbles: true }));
}

registerAction('add-to-cart', addFromButton);
