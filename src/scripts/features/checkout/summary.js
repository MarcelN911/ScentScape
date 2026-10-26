/* Rechte Spalte von "Finalizar compra": Positionen und Summen. Rechnet nicht selbst, zeigt nur summaryOf(). */
import { lineMetaOf } from '../../cart/line-meta.js';
import { lineTotal } from '../../cart/pricing.js';
import { shippingHint, shippingValue } from '../../cart/shipping-text.js';
import { formatCOP } from '../../utils/format.js';

const FALLBACK_IMAGE = '/assets/img/scentscape-logo.png';
const minus = (amount) => `−${formatCOP(amount)} COP`;

function lineOf(template, item) {
  const line = template.content.firstElementChild.cloneNode(true);
  line.classList.toggle('is-gift', Boolean(item.giftCard));
  line.querySelector('[data-line-image]').src = item.image || FALLBACK_IMAGE;
  line.querySelector('[data-line-qty]').textContent = item.quantity;
  line.querySelector('[data-line-name]').textContent = item.name;
  line.querySelector('[data-line-meta]').textContent = lineMetaOf(item) || 'ScentScape';
  line.querySelector('[data-line-total]').textContent = formatCOP(lineTotal(item));
  return line;
}

function renderLines(root, items) {
  const template = root.querySelector('[data-sum-line]');
  root.querySelector('[data-sum-lines]').replaceChildren(...items.map((i) => lineOf(template, i)));
}

/** Zeile mit Text links und Betrag rechts; ohne value verschwindet sie. */
function renderRow(row, label, value) {
  row.hidden = !value;
  if (!value) return;
  if (label) row.querySelector('dt').textContent = label;
  row.querySelector('dd').textContent = value;
}

function codeValue(code) {
  if (code.freeShipping) return 'Envío gratis';
  return code.amount ? minus(code.amount) : '';
}

/** Die Zeilen, die nur manchmal erscheinen: [Element, Beschriftung, Betrag]. */
function optionalRows(summary, codes) {
  const { code, giftCard, saleDiscount } = summary;
  return [
    ['[data-sum-sale]', '', saleDiscount && minus(saleDiscount)],
    ['[data-sum-code]', `Código ${codes.promo}`, codeValue(code)],
    ['[data-sum-gift]', `Gift card ${giftCard.code}`, giftCard.amount && minus(giftCard.amount)],
  ];
}

function renderRows(root, summary, codes) {
  root.querySelector('[data-sum-subtotal]').textContent = `${formatCOP(summary.subtotal)} COP`;
  root.querySelector('[data-sum-shipping]').textContent = shippingValue(summary);
  optionalRows(summary, codes).forEach(([selector, label, value]) => {
    renderRow(root.querySelector(selector), label, value);
  });
}

/** codes = { promo: Rabattcode oder '' } */
export function renderSummary(root, items, summary, codes) {
  renderLines(root, items);
  renderRows(root, summary, codes);
  root.querySelector('[data-sum-count]').textContent = `(${summary.count})`;
  root.querySelector('[data-sum-hint]').textContent = shippingHint(summary, codes.promo);
  root.querySelector('[data-sum-total]').textContent = formatCOP(summary.total);
}
