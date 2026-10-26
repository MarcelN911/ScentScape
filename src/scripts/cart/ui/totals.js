/* Summen in der Bolsa: Zähler im Header, Versand-Balken, Zeilen und Gesamtbetrag. */
import { formatCOP } from '../../utils/format.js';
import { getRule } from '../discount.js';
import { shippingHint, shippingProgress, shippingValue } from '../shipping-text.js';

function renderShipping(root, summary) {
  const text = root.querySelector('[data-ship-text]');
  text.textContent = shippingHint(summary, getRule()?.codigo);
  text.classList.toggle('is-free', summary.shipping.free);
  root
    .querySelector('[data-ship-bar]')
    .style.setProperty('--ship-progress', `${shippingProgress(summary)}%`);
  root.querySelector('[data-ship-value]').textContent = shippingValue(summary);
}

function renderRow(root, name, value) {
  root.querySelector(`[data-${name}-row]`).hidden = !value;
  if (value) root.querySelector(`[data-${name}-value]`).textContent = value;
}

function codeValue(code) {
  if (code.freeShipping) return 'Envío gratis';
  return code.amount ? `−${formatCOP(code.amount)} COP` : '';
}

function renderDiscounts(root, summary) {
  renderRow(root, 'sale', summary.saleDiscount ? `−${formatCOP(summary.saleDiscount)} COP` : '');
  const value = codeValue(summary.code);
  renderRow(root, 'discount', value);
  if (value) root.querySelector('[data-discount-label]').textContent = `Código ${getRule().codigo}`;
}

function renderCounts(root, summary) {
  document
    .querySelectorAll('[data-cart-count]')
    .forEach((badge) => (badge.textContent = summary.count));
  root.querySelector('[data-cart-empty]').hidden = summary.count > 0;
  root.querySelector('[data-cart-cta]').setAttribute('aria-disabled', String(!summary.count));
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
