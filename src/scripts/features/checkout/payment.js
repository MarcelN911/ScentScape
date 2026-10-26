/*
 * Zahlungsart auf "Finalizar compra": Pago en línea (Bold) oder WhatsApp.
 * Bold erscheint nur, wenn nexomar es für den Shop freigegeben hat. Der Knopf unten
 * nennt, was passiert, und bei Bold den Betrag.
 */
import { PAYMENT_METHODS } from '../../../data/checkout.js';
import { formatCOP } from '../../utils/format.js';

const methodById = (id) => PAYMENT_METHODS.find((method) => method.id === id);

/** Bold gewählt, aber (noch) nicht verfügbar: dann gilt WhatsApp. */
export function activeMethod(state, settings) {
  return state.method === 'bold' && !settings.bold.activo ? 'whatsapp' : state.method;
}

function submitLabel(method, total) {
  if (method.id === 'bold' && total === 0) return { label: 'Confirmar pedido', amount: '' };
  if (method.id === 'bold') return { label: method.button, amount: formatCOP(total) };
  return { label: method.button, amount: '' };
}

export function renderPayment(root, state, settings, summary) {
  const id = activeMethod(state, settings);
  root.querySelector('[data-pay-method="bold"]').hidden = !settings.bold.activo;
  root.querySelectorAll('[data-pay-method]').forEach((card) => {
    card.setAttribute('aria-checked', String(card.dataset.payMethod === id));
  });
  const method = methodById(id);
  root.querySelector('[data-pay-note]').textContent = method.note;
  const { label, amount } = submitLabel(method, summary.total);
  root.querySelector('[data-submit-label]').textContent = label;
  root.querySelector('[data-submit-amount]').textContent = amount;
}

export function bindPayment(root, state, signal, onChange) {
  root.querySelector('[role="radiogroup"]').addEventListener(
    'click',
    (event) => {
      const card = event.target.closest('[data-pay-method]');
      if (!card) return;
      state.method = card.dataset.payMethod;
      onChange();
    },
    { signal },
  );
}
