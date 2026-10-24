/* Rabattcode in der Bolsa: "Aplicar" prüft den Code, "Quitar" entfernt ihn wieder. */
import { EVENTS, emit } from '../../core/events.js';
import { applyCode, getRule, removeCode } from '../discount.js';

const feedback = { text: '', error: false };

function setFeedback(text, error = false) {
  Object.assign(feedback, { text, error });
}

export function renderPromo(root, summary) {
  const rule = getRule();
  const input = root.querySelector('[data-promo-input]');
  root.querySelector('[data-promo-button]').textContent = rule ? 'Quitar' : 'Aplicar';
  if (rule) input.value = rule.codigo;
  input.readOnly = Boolean(rule);
  const message = summary.code.reason || feedback.text;
  const element = root.querySelector('[data-promo-feedback]');
  element.textContent = message;
  element.classList.toggle('is-error', Boolean(summary.code.reason) || feedback.error);
}

async function apply(input) {
  const code = input.value.trim().toUpperCase();
  if (!code) return setFeedback('Ingresa un código.', true);
  setFeedback('Verificando…');
  emit(EVENTS.cartChange);
  const error = await applyCode(code);
  setFeedback(error ?? `¡Código ${code} aplicado!`, Boolean(error));
}

async function submit(root, event) {
  event.preventDefault();
  const input = root.querySelector('[data-promo-input]');
  if (getRule()) {
    input.value = '';
    setFeedback('');
    return removeCode();
  }
  await apply(input);
  emit(EVENTS.cartChange);
}

export function bindPromo(root) {
  root
    .querySelector('[data-promo-form]')
    .addEventListener('submit', (event) => submit(root, event));
}
