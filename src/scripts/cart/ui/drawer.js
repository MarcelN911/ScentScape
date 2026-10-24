import { registerAction } from '../../core/actions.js';
import { EVENTS, listen } from '../../core/events.js';
import { getItems } from '../store.js';

let root;

/** Wechselt zwischen der Liste ("cart") und dem Formular ("checkout"). */
export function setCartView(view) {
  root.dataset.view = view;
  if (view === 'checkout') root.querySelector('[data-checkout-form] input')?.focus();
}

export function setCartOpen(open) {
  if (open) setCartView('cart');
  root.toggleAttribute('data-cart-open', open);
  document.documentElement.classList.toggle('is-locked', open);
}

export function initDrawer(element) {
  root = element;
  registerAction('open-cart', () => setCartOpen(true));
  registerAction('close-cart', () => setCartOpen(false));
  registerAction('cart-back', () => setCartView('cart'));
  registerAction('cart-checkout', () => getItems().length && setCartView('checkout'));
  listen(EVENTS.cartOpen, () => setCartOpen(true));
  document.addEventListener('keydown', (event) => event.key === 'Escape' && setCartOpen(false));
  document.addEventListener('astro:before-preparation', () => setCartOpen(false));
}
