/* Zeigt "Tu pedido" rechts neben dem Formular. */
import { lineMetaOf } from '../cart/line-meta.js';
import { lineTotal } from '../cart/pricing.js';
import { formatCOP } from '../utils/format.js';

function lineElement(template, item) {
  const line = template.content.firstElementChild.cloneNode(true);
  line.classList.toggle('is-gift-card', Boolean(item.giftCard));
  line.querySelector('[data-summary-image]').src = item.image ?? '';
  line.querySelector('[data-summary-name]').textContent = item.name;
  line.querySelector('[data-summary-meta]').textContent = `${lineMetaOf(item)} · x${item.quantity}`;
  line.querySelector('[data-summary-total]').textContent = formatCOP(lineTotal(item));
  return line;
}

function renderLines(root, items) {
  const template = root.querySelector('[data-summary-line]');
  root
    .querySelector('[data-summary-lines]')
    .replaceChildren(...items.map((item) => lineElement(template, item)));
}

function renderRow(root, name, value, label) {
  root.querySelector(`[data-summary-${name}]`).hidden = !value;
  root.querySelector(`[data-summary-${name}-value]`).textContent = value;
  if (label) root.querySelector(`[data-summary-${name}-label]`).textContent = label;
}

function codeValue(summary) {
  if (summary.code.freeShipping) return 'Envío gratis';
  return summary.code.amount > 0 ? `−${formatCOP(summary.code.amount)}` : '';
}

/** order = { items, summary, rule, preferences } */
export function renderSummary(root, order) {
  const { items, summary, rule, preferences } = order;
  renderLines(root, items);
  root.querySelector('[data-summary-gift]').hidden = !preferences.gift;
  const sale = summary.saleDiscount > 0 ? `−${formatCOP(summary.saleDiscount)}` : '';
  renderRow(root, 'sale', sale);
  renderRow(root, 'code', codeValue(summary), rule && `Código ${rule.codigo}`);
  const freeShipping = summary.freeShipping || summary.code.freeShipping;
  root.querySelector('[data-summary-shipping]').textContent = freeShipping
    ? 'Gratis'
    : 'Se confirma por WhatsApp';
  root.querySelector('[data-summary-total-value]').textContent = formatCOP(summary.total);
}
