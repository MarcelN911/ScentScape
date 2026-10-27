/* Bolsa: einmal beim ersten Seitenaufruf verbinden, danach bei jeder Änderung neu zeichnen. */
import { loadSettings } from '../../checkout/settings.js';
import { EVENTS, listen } from '../../core/events.js';
import { currentSummary } from '../summary.js';
import { initCartDrawer } from './drawer.js';
import { bindLines, renderLines } from './lines.js';
import { renderTotals } from './totals.js';

function renderCart(root) {
  renderLines(root);
  renderTotals(root, currentSummary());
}

export function initCartUi() {
  const root = document.querySelector('[data-drawer="cart"]');
  if (!root) return;
  initCartDrawer();
  bindLines(root);
  listen(EVENTS.cartChange, () => renderCart(root));
  renderCart(root);
  loadSettings();
}
