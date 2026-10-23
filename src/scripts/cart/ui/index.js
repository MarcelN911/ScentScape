import { EVENTS, listen } from '../../core/events.js';
import { getRule } from '../discount.js';
import { summaryOf } from '../pricing.js';
import { getItems } from '../store.js';
import { initDrawer } from './drawer.js';
import { bindGift, renderGift } from './gift.js';
import { bindLines, renderLines } from './lines.js';
import { bindPayModes, renderPayModes } from './pay-modes.js';
import { bindPromo, renderPromo } from './promo.js';
import { renderTotals } from './totals.js';

function renderCart(root) {
  const summary = summaryOf(getItems(), getRule());
  renderLines(root);
  renderTotals(root, summary);
  renderPromo(root, summary);
  renderGift(root);
  renderPayModes(root);
}

export function initCartUi() {
  const root = document.querySelector('[data-cart-root]');
  if (!root) return;
  initDrawer(root);
  bindLines(root);
  bindPromo(root);
  bindGift(root);
  bindPayModes(root);
  listen(EVENTS.cartChange, () => renderCart(root));
  renderCart(root);
}
