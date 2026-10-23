import { EVENTS, emit } from '../../core/events.js';
import { applyCode, getRule, removeCode } from '../discount.js';

let lastError = '';

function feedbackFor(summary) {
  if (lastError) return lastError;
  if (summary.code.reason) return summary.code.reason;
  return summary.code.partial ? 'Aplicado a los productos que participan.' : '';
}

export function renderPromo(root, summary) {
  const rule = getRule();
  root.querySelector('[data-promo-form]').hidden = Boolean(rule);
  root.querySelector('[data-promo-applied]').hidden = !rule;
  if (rule)
    root.querySelector('[data-promo-label]').textContent = `${rule.codigo} · ${rule.etiqueta}`;
  root.querySelector('[data-promo-feedback]').textContent = feedbackFor(summary);
}

async function submitCode(root, event) {
  event.preventDefault();
  const input = root.querySelector('[data-promo-input]');
  const code = input.value.trim().toUpperCase();
  if (!code) return;
  root.querySelector('[data-promo-apply]').disabled = true;
  lastError = (await applyCode(code)) ?? '';
  root.querySelector('[data-promo-apply]').disabled = false;
  if (!lastError) input.value = '';
  emit(EVENTS.cartChange);
}

export function bindPromo(root) {
  root
    .querySelector('[data-promo-form]')
    .addEventListener('submit', (event) => submitCode(root, event));
  root.querySelector('[data-promo-input]').addEventListener('input', () => (lastError = ''));
  root.querySelector('[data-promo-remove]').addEventListener('click', removeCode);
}
