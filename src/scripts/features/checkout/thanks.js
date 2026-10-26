/*
 * Seite "Gracias". WhatsApp: Bestätigung mit Knopf zum Chat. Bold: fragt nexomar alle
 * paar Sekunden nach dem Zahlungsstand, bis er feststeht. Erst wenn bezahlt ist,
 * wird die Bolsa geleert — bei einer Ablehnung bleibt alles für einen neuen Versuch.
 */
import { ENDPOINTS, getJson } from '../../api/client.js';
import { openBold } from '../../checkout/bold.js';
import { retryPayment } from '../../checkout/order.js';
import { clearPending, getPending } from '../../checkout/pending.js';
import { rememberedCustomer } from './remember.js';
import { clearOrderState } from './result.js';
import { renderThanks, showThanksError } from './thanks-view.js';

const POLL_MS = 3000;
const MAX_POLLS = 20;
const OPEN = ['checking', 'en_proceso'];

function readParams() {
  const params = new URLSearchParams(window.location.search);
  return { via: params.get('via'), id: params.get('pedido'), token: params.get('t') };
}

async function fetchStatus(thanks) {
  try {
    return await getJson(ENDPOINTS.orderStatus(thanks.id, thanks.token));
  } catch {
    return null;
  }
}

function stateOf(status, polls) {
  if (status.pago !== 'pendiente') return status.pago;
  return polls < MAX_POLLS ? 'checking' : 'pendiente';
}

function settle(name) {
  if (name === 'pagado') clearOrderState();
  if (name === 'pagado' || name === 'cancelado') clearPending();
}

/** Zeichnet den Stand und gibt seinen Namen zurück. */
function show(thanks, status) {
  const name = stateOf(status, thanks.polls);
  settle(name);
  const { numero, total, giftCards } = status;
  renderThanks(thanks.root, name, { number: numero, total, giftCards });
  return name;
}

async function poll(thanks) {
  const status = await fetchStatus(thanks);
  if (!status) return renderThanks(thanks.root, 'missing', {});
  thanks.polls += 1;
  thanks.number = status.numero;
  const name = show(thanks, status);
  if (OPEN.includes(name) && thanks.polls < MAX_POLLS) {
    thanks.timer = setTimeout(() => poll(thanks), POLL_MS);
  }
  return undefined;
}

function check(thanks) {
  clearTimeout(thanks.timer);
  thanks.polls = 0;
  renderThanks(thanks.root, 'checking', { number: thanks.number });
  poll(thanks);
}

async function retry(thanks) {
  showThanksError(thanks.root, '');
  const { ok, data } = await retryPayment(thanks.id, thanks.token).catch(() => ({
    ok: false,
    data: {},
  }));
  if (!ok) return showThanksError(thanks.root, data.error ?? 'No pudimos iniciar el pago.');
  const redirectionUrl = window.location.href.split('&bold-')[0];
  const checkout = { number: thanks.number, customer: rememberedCustomer(), redirectionUrl };
  return openBold(data.pago, checkout).catch(() => showThanksError(thanks.root, 'Bold no cargó.'));
}

function handleAction(thanks, event) {
  const action = event.target.closest('[data-thanks-action]');
  const run = { check, retry }[action?.dataset.thanksAction];
  if (!run) return;
  event.preventDefault();
  run(thanks);
}

function showWhatsApp(root) {
  const pending = getPending();
  renderThanks(root, 'whatsapp', { number: pending?.number, whatsapp: pending?.whatsapp });
}

export function initThanksPage(signal) {
  const root = document.querySelector('[data-thanks-page]');
  if (!root) return;
  const thanks = { root, ...readParams(), polls: 0, number: '', timer: 0 };
  root.addEventListener('click', (event) => handleAction(thanks, event), { signal });
  signal.addEventListener('abort', () => clearTimeout(thanks.timer));
  if (thanks.via === 'whatsapp') showWhatsApp(root);
  else if (thanks.id && thanks.token) check(thanks);
  else renderThanks(root, 'missing', {});
  setTimeout(() => root.classList.add('is-in'), 80);
}
