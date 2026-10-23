/* Zeigt die Warenkorb-Zeilen. Vorhandene Zeilen werden aktualisiert statt neu gebaut (keine erneute Animation). */
import { formatCOP } from '../../utils/format.js';
import { lineTotal } from '../pricing.js';
import { changeQuantity, getItems, removeItem } from '../store.js';

function metaOf(item) {
  const parts = item.giftCard
    ? [item.color, item.recipient && `Para ${item.recipient}`, item.delivery]
    : [`${item.size} ml`, item.brand];
  return parts.filter(Boolean).join(' · ');
}

function fillLine(line, item) {
  line.dataset.sku = item.sku;
  line.classList.toggle('is-gift-card', Boolean(item.giftCard));
  line.querySelector('[data-line-image]').src = item.image ?? '';
  line.querySelector('[data-line-name]').textContent = item.name;
  line.querySelector('[data-line-meta]').textContent = metaOf(item);
  line.querySelector('[data-line-qty]').textContent = item.quantity;
  line.querySelector('[data-line-total]').textContent = formatCOP(lineTotal(item));
}

function removeStaleLines(container, items) {
  const skus = new Set(items.map((item) => item.sku));
  container
    .querySelectorAll('[data-sku]')
    .forEach((line) => skus.has(line.dataset.sku) || line.remove());
}

function lineFor(container, template, item) {
  const existing = [...container.children].find((line) => line.dataset.sku === item.sku);
  if (existing) return existing;
  const line = template.content.firstElementChild.cloneNode(true);
  container.append(line);
  return line;
}

export function renderLines(root) {
  const container = root.querySelector('[data-cart-lines]');
  const template = root.querySelector('[data-cart-line]');
  const items = getItems();
  removeStaleLines(container, items);
  items.forEach((item) => fillLine(lineFor(container, template, item), item));
}

function handleLineClick(event) {
  const line = event.target.closest('[data-sku]');
  const change = event.target.closest('[data-line-change]');
  if (!line) return;
  if (change) changeQuantity(line.dataset.sku, Number(change.dataset.lineChange));
  if (event.target.closest('[data-line-remove]')) removeItem(line.dataset.sku);
}

export function bindLines(root) {
  root.querySelector('[data-cart-lines]').addEventListener('click', handleLineClick);
}
