/* Bolsa auf- und zuklappen. "Finalizar compra" ist ein Link zur Seite /checkout/. */
import { registerAction } from '../../core/actions.js';
import { EVENTS, listen } from '../../core/events.js';

let root;

export function setCartOpen(open) {
  root.toggleAttribute('data-cart-open', open);
  document.documentElement.classList.toggle('is-locked', open);
}

export function initDrawer(element) {
  root = element;
  registerAction('open-cart', () => setCartOpen(true));
  registerAction('close-cart', () => setCartOpen(false));
  listen(EVENTS.cartOpen, () => setCartOpen(true));
  document.addEventListener('keydown', (event) => event.key === 'Escape' && setCartOpen(false));
  document.addEventListener('astro:before-preparation', () => setCartOpen(false));
}
