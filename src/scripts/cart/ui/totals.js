import { payModeOf } from '../../../data/payments.js';
import { FREE_SHIPPING_THRESHOLD } from '../../config.js';
import { formatCOP } from '../../utils/format.js';
import { getRule } from '../discount.js';
import { getPreferences } from '../preferences.js';

function shippingText(summary) {
  if (!summary.count) return `Envío gratis desde ${formatCOP(FREE_SHIPPING_THRESHOLD)} COP`;
  if (summary.code.freeShipping) return `¡Envío gratis con tu código ${getRule().codigo}! 🎉`;
  if (summary.freeShipping) return '✺ ¡Tienes envío gratis!';
  return `Te faltan ${formatCOP(summary.shortfall)} COP para envío gratis`;
}

function shippingProgress(summary) {
  if (summary.code.freeShipping || summary.freeShipping) return 100;
  return Math.min(100, (summary.total / FREE_SHIPPING_THRESHOLD) * 100);
}

function renderShipping(root, summary) {
  root.querySelector('[data-ship-text]').textContent = shippingText(summary);
  root
    .querySelector('[data-ship-bar]')
    .style.setProperty('--ship-progress', `${shippingProgress(summary)}%`);
}

function renderDiscount(root, summary) {
  const row = root.querySelector('[data-discount-row]');
  row.hidden = !(summary.code.amount > 0 || summary.code.freeShipping);
  if (row.hidden) return;
  root.querySelector('[data-discount-label]').textContent = `Código ${getRule().codigo}`;
  const value = summary.code.freeShipping ? 'Envío gratis' : `−${formatCOP(summary.code.amount)}`;
  root.querySelector('[data-discount-value]').textContent = value;
}

function renderCta(root, summary) {
  const mode = payModeOf(getPreferences().payMode);
  const cta = root.querySelector('[data-cart-cta]');
  cta.className = `totals__cta totals__cta--${mode.key}`;
  cta.setAttribute('aria-disabled', String(summary.count === 0));
  const label = mode.key === 'card' ? `${mode.cta} · ${formatCOP(summary.total)}` : mode.cta;
  root.querySelector('[data-cart-cta-label]').textContent = label;
  root.querySelector('[data-cart-cta-note]').textContent = mode.note;
}

function renderCounts(root, summary) {
  document
    .querySelectorAll('[data-cart-count]')
    .forEach((badge) => (badge.textContent = summary.count));
  root.querySelector('[data-cart-empty]').hidden = summary.count > 0;
  root
    .querySelectorAll('[data-cart-filled-only]')
    .forEach((part) => (part.hidden = summary.count === 0));
}

export function renderTotals(root, summary) {
  renderCounts(root, summary);
  renderShipping(root, summary);
  renderDiscount(root, summary);
  root.querySelector('[data-cart-total]').textContent = formatCOP(summary.total);
  renderCta(root, summary);
}
