/* Formular "Finalizar pedido" in der Bolsa: prüfen, absenden, danach zurück zur leeren Liste. */
import { checkCustomer, readCustomer } from '../../checkout/form.js';
import { submitOrder } from '../../checkout/submit.js';
import { getItems } from '../store.js';
import { setCartView } from './drawer.js';

function showError(form, error) {
  form.querySelector('[data-checkout-error]').textContent = error?.message ?? '';
  if (error?.field) form.elements[error.field].focus();
}

async function send(form, customer) {
  const button = form.querySelector('[data-checkout-submit]');
  button.disabled = true;
  const error = await submitOrder(customer);
  button.disabled = false;
  showError(form, error);
  if (error) return;
  form.reset();
  setCartView('cart');
}

function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const customer = readCustomer(form);
  const error = checkCustomer(customer, getItems());
  showError(form, error);
  if (!error) send(form, customer);
}

export function bindCheckout(root) {
  root.querySelector('[data-checkout-form]').addEventListener('submit', handleSubmit);
}
