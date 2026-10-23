/* Zustände der Checkout-Seite: Zahlungsart, Fehler, Laden, fertig. */
import { CHECKOUT_MODE_TEXT } from '../../data/checkout.js';
import { payModeOf } from '../../data/payments.js';
import { formatCOP } from '../utils/format.js';
import { whatsappUrl } from '../utils/whatsapp.js';

const SUBMIT_LABELS = {
  wa: 'Enviar pedido por WhatsApp',
  card: 'Pedir enlace de pago',
  addi: 'Pedir enlace de Addi',
};

export function renderMode(root, modeKey, total) {
  root.querySelectorAll('[data-checkout-mode]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.checkoutMode === modeKey));
  });
  root.querySelector('[data-checkout-mode-text]').textContent = CHECKOUT_MODE_TEXT[modeKey];
  const label = `${SUBMIT_LABELS[modeKey]} · ${formatCOP(total)}`;
  root.querySelector('[data-checkout-submit-label]').textContent = label;
  const submit = root.querySelector('[data-checkout-submit]');
  submit.classList.toggle('checkout-form__submit--addi', modeKey === 'addi');
}

export function showError(root, error) {
  const box = root.querySelector('[data-checkout-error]');
  box.hidden = !error;
  box.textContent = error?.message ?? '';
  if (error?.field) root.querySelector(`[name="${error.field}"]`).focus();
}

export function setBusy(root, busy) {
  root.querySelector('[data-checkout-submit]').disabled = busy;
}

export function renderSteps(root, current) {
  root.querySelectorAll('[data-checkout-step]').forEach((step) => {
    const index = Number(step.dataset.checkoutStep);
    step.classList.toggle('is-done', index < current);
    step.classList.toggle('is-current', index === current);
  });
}

export function showDone(root, { message, total, modeKey }) {
  root.querySelector('[data-checkout-main]').hidden = true;
  root.querySelector('[data-checkout-done]').hidden = false;
  root.querySelector('[data-done-meta]').textContent =
    `${formatCOP(total)} COP · ${payModeOf(modeKey).title}`;
  root.querySelector('[data-done-whatsapp]').href = whatsappUrl(message);
  renderSteps(root, 2);
  window.scrollTo({ top: 0 });
}
