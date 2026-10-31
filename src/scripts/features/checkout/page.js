/*
 * Seite "Finalizar compra": zeigt den Warenkorb mit allen Summen, prüft das Formular
 * und schickt den Pedido über WhatsApp oder Bold. Jede Änderung am Warenkorb
 * (auch in der Bolsa) zeichnet die Seite neu.
 */
import { getRule } from '../../cart/discount.js';
import { getGiftCard } from '../../cart/gift-redeem.js';
import { getItems } from '../../cart/store.js';
import { currentSummary } from '../../cart/summary.js';
import { checkCustomer, readCustomer } from '../../checkout/form.js';
import { getSettings, loadSettings } from '../../checkout/settings.js';
import { EVENTS, listen } from '../../core/events.js';
import { bindCodes, renderCodes } from './codes.js';
import { payOnline } from './online-order.js';
import { activeMethod, bindPayment, renderPayment } from './payment.js';
import { fillRemembered, rememberCustomer } from './remember.js';
import { bindSelects } from './select.js';
import { renderSummary } from './summary.js';
import { orderByWhatsApp } from './whatsapp-order.js';

function renderEmpty(root, isEmpty) {
  root.querySelector('[data-checkout-empty]').hidden = !isEmpty;
  root.querySelector('[data-checkout-content]').hidden = isEmpty;
}

function render(page) {
  const items = getItems();
  const summary = currentSummary();
  const settings = getSettings();
  page.state.method ??= settings.bold.activo ? 'bold' : null;
  renderEmpty(page.root, items.length === 0 && !page.state.busy);
  page.root.querySelector('[data-gift-wrap]').hidden = !(
    settings.giftCards.activas || getGiftCard()
  );
  renderSummary(page.root, items, summary, { promo: getRule()?.codigo ?? '' });
  renderCodes(page.root, summary);
  renderPayment(page.root, { method: page.state.method ?? 'whatsapp' }, settings, summary);
}

function showError(form, error) {
  form.querySelector('[data-checkout-error]').textContent = error?.message ?? '';
  if (error?.field) form.elements[error.field].focus();
}

/** Nur, was gerade wirklich greift: ein Code, der nicht passt, ginge sonst mit an nexomar. */
function orderOf(customer, page) {
  const summary = currentSummary();
  return {
    customer,
    items: getItems(),
    rule: summary.code.active ? getRule() : null,
    giftCard: summary.giftCard.amount ? getGiftCard() : null,
    method: activeMethod({ method: page.state.method ?? 'whatsapp' }, getSettings()),
  };
}

function setBusy(page, form, busy) {
  page.state.busy = busy;
  form.querySelector('[data-checkout-submit]').classList.toggle('is-busy', busy);
}

async function submit(page, event) {
  event.preventDefault();
  const form = event.currentTarget;
  const customer = readCustomer(form);
  const error = checkCustomer(form, customer, getItems());
  showError(form, error);
  if (error || page.state.busy) return;
  rememberCustomer(customer);
  const order = orderOf(customer, page);
  setBusy(page, form, true);
  const failure = order.method === 'bold' ? await payOnline(order) : await orderByWhatsApp(order);
  setBusy(page, form, false);
  showError(form, failure ? { message: failure } : null);
}

function bind(page, signal) {
  const form = page.root.querySelector('[data-checkout-form]');
  fillRemembered(form);
  bindSelects(form, signal);
  form.addEventListener('submit', (event) => submit(page, event), { signal });
  form.addEventListener('input', () => showError(form, null), { signal });
  bindCodes(page.root, signal);
  bindPayment(page.root, page.state, signal, () => render(page));
  listen(EVENTS.cartChange, () => render(page), { signal });
}

export function initCheckoutPage(signal) {
  const root = document.querySelector('[data-checkout-page]');
  if (!root) return;
  const page = { root, state: { method: null, busy: false } };
  bind(page, signal);
  render(page);
  loadSettings();
  setTimeout(() => root.classList.add('is-in'), 80);
}
