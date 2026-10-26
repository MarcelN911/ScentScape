/*
 * Rabattcode und Gift Card auf "Finalizar compra". Beide Formulare funktionieren gleich:
 * "Aplicar" prüft bei nexomar, danach heißt der Knopf "Quitar". Der Hinweis darunter sagt,
 * was der Code gerade bewirkt oder warum er nicht greift.
 */
import { applyCode, getRule, removeCode } from '../../cart/discount.js';
import { applyGiftCard, getGiftCard, removeGiftCard } from '../../cart/gift-redeem.js';
import { EVENTS, emit } from '../../core/events.js';
import { formatCOP } from '../../utils/format.js';

function giftInfo(summary) {
  const card = getGiftCard();
  if (!summary.giftCard.amount)
    return 'Una gift card no se puede usar para comprar otra gift card.';
  const rest = card.saldo - summary.giftCard.amount;
  return `Usas ${formatCOP(summary.giftCard.amount)} · te quedan ${formatCOP(rest)} en la tarjeta.`;
}

const KINDS = {
  promo: {
    current: () => getRule()?.codigo,
    apply: applyCode,
    remove: removeCode,
    info: (summary, code) => summary.code.reason || `Código ${code} aplicado.`,
    isError: (summary) => Boolean(summary.code.reason),
  },
  gift: {
    current: () => getGiftCard()?.codigo,
    apply: applyGiftCard,
    remove: removeGiftCard,
    info: giftInfo,
    isError: (summary) => !summary.giftCard.amount,
  },
};

/* Rückmeldung nach dem Klick ("Verificando…", Fehler) — bleibt bis zur nächsten Aktion stehen. */
const messages = { promo: null, gift: null };

/** Der Satz unter dem Feld: Rückmeldung nach dem Klick, sonst was der Code bewirkt. */
function feedbackOf(name, summary, code) {
  const message = messages[name];
  if (message) return message;
  if (!code) return { text: '', error: false };
  return { text: KINDS[name].info(summary, code), error: KINDS[name].isError(summary) };
}

function renderForm(form, summary) {
  const name = form.dataset.codeForm;
  const code = KINDS[name].current();
  const input = form.querySelector('[data-code-input]');
  if (code) input.value = code;
  input.readOnly = Boolean(code);
  form.querySelector('[data-code-button]').textContent = code ? 'Quitar' : 'Aplicar';
  const feedback = feedbackOf(name, summary, code);
  const element = form.querySelector('[data-code-feedback]');
  element.textContent = feedback.text;
  element.classList.toggle('is-error', feedback.error);
}

export function renderCodes(root, summary) {
  root.querySelectorAll('[data-code-form]').forEach((form) => renderForm(form, summary));
}

async function apply(name, input) {
  const code = input.value.trim().toUpperCase();
  if (!code) {
    messages[name] = { text: 'Escribe un código.', error: true };
    return;
  }
  messages[name] = { text: 'Verificando…', error: false };
  emit(EVENTS.cartChange);
  const error = await KINDS[name].apply(code);
  messages[name] = error ? { text: error, error: true } : null;
}

async function submit(form, event) {
  event.preventDefault();
  const name = form.dataset.codeForm;
  const input = form.querySelector('[data-code-input]');
  messages[name] = null;
  if (KINDS[name].current()) {
    input.value = '';
    KINDS[name].remove();
    return;
  }
  await apply(name, input);
  emit(EVENTS.cartChange);
}

export function bindCodes(root, signal) {
  root.querySelectorAll('[data-code-form]').forEach((form) => {
    form.addEventListener('submit', (event) => submit(form, event), { signal });
  });
}
