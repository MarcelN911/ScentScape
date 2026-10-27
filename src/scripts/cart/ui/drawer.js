/* Bolsa auf- und zuklappen. "Finalizar compra" ist ein Link zur Seite /checkout/. */
import { EVENTS, listen } from '../../core/events.js';
import { initDrawer } from '../../layout/drawer.js';

export function initCartDrawer() {
  const setOpen = initDrawer('cart');
  listen(EVENTS.cartOpen, () => setOpen(true));
}
