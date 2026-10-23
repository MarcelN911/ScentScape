/* Checkout-Seite: Formular, Zahlungsart, Zusammenfassung und Absenden. */
import { EVENTS, listen } from '../core/events.js';
import { updatePreferences } from '../cart/preferences.js';
import { checkCustomer, readCustomer } from './form.js';
import { currentOrder, submitOrder } from './submit.js';
import { renderSummary } from './summary-view.js';
import { renderMode, renderSteps, setBusy, showDone, showError } from './view.js';

function render(root) {
  const order = currentOrder();
  renderSummary(root, order);
  renderMode(root, order.preferences.payMode, order.summary.total);
}

async function handleSubmit(root, event) {
  event.preventDefault();
  const customer = readCustomer(event.target);
  const error = checkCustomer(customer, currentOrder().items);
  showError(root, error);
  if (error) return;
  setBusy(root, true);
  const result = await submitOrder(customer);
  setBusy(root, false);
  if (result.error) showError(root, result.error);
  else showDone(root, result);
}

function bindModes(root, signal) {
  root.querySelectorAll('[data-checkout-mode]').forEach((button) => {
    const payMode = button.dataset.checkoutMode;
    button.addEventListener('click', () => updatePreferences({ payMode }), { signal });
  });
}

export function initCheckout(signal) {
  const root = document.querySelector('[data-checkout]');
  if (!root) return;
  const form = root.querySelector('[data-checkout-form]');
  form.addEventListener('submit', (event) => handleSubmit(root, event), { signal });
  bindModes(root, signal);
  listen(EVENTS.cartChange, () => render(root), { signal });
  renderSteps(root, 0);
  render(root);
}
