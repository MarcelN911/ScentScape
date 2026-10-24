import { FREE_SHIPPING_THRESHOLD } from '../../config.js';
import { formatCOP } from '../../utils/format.js';
import { getRule } from '../discount.js';

function shippingText(summary) {
  if (!summary.count) return `Envío gratis desde ${formatCOP(FREE_SHIPPING_THRESHOLD)} COP`;
  if (summary.code.freeShipping) return `¡Envío gratis con tu código ${getRule().codigo}!`;
  if (summary.freeShipping) return '¡Envío gratis incluido!';
  return `Te faltan ${formatCOP(summary.shortfall)} COP para envío gratis`;
}

function shippingProgress(summary) {
  if (summary.code.freeShipping) return 100;
  return Math.min(100, (summary.total / FREE_SHIPPING_THRESHOLD) * 100);
}

function renderShipping(root, summary) {
  const text = root.querySelector('[data-ship-text]');
  const free = summary.freeShipping || summary.code.freeShipping;
  text.textContent = shippingText(summary);
  text.classList.toggle('is-free', free);
  root
    .querySelector('[data-ship-bar]')
    .style.setProperty('--ship-progress', `${shippingProgress(summary)}%`);
  root.querySelector('[data-ship-value]').textContent = free ? 'Gratis' : 'A calcular';
}

function renderRow(root, name, value) {
  root.querySelector(`[data-${name}-row]`).hidden = !value;
  if (value) root.querySelector(`[data-${name}-value]`).textContent = value;
}

function renderDiscounts(root, summary) {
  const { code } = summary;
  renderRow(root, 'sale', summary.saleDiscount ? `−${formatCOP(summary.saleDiscount)} COP` : '');
  const codeValue = code.freeShipping
    ? 'Envío gratis'
    : code.amount && `−${formatCOP(code.amount)} COP`;
  renderRow(root, 'discount', codeValue);
  if (codeValue)
    root.querySelector('[data-discount-label]').textContent = `Código ${getRule().codigo}`;
}

function renderCounts(root, summary) {
  document
    .querySelectorAll('[data-cart-count]')
    .forEach((badge) => (badge.textContent = summary.count));
  root.querySelector('[data-cart-empty]').hidden = summary.count > 0;
  root.querySelector('[data-cart-cta]').disabled = summary.count === 0;
}

export function renderTotals(root, summary) {
  renderCounts(root, summary);
  renderShipping(root, summary);
  renderDiscounts(root, summary);
  root.querySelector('[data-cart-subtotal]').textContent = `${formatCOP(summary.subtotal)} COP`;
  root
    .querySelectorAll('[data-cart-total]')
    .forEach((el) => (el.textContent = formatCOP(summary.total)));
}
