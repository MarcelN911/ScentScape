/* Zustand und Eingaben des Gift-Card-Formulars. */
import { GIFT_DEFAULT_AMOUNT, GIFT_DEFAULTS, GIFT_DELIVERY } from '../../../data/gift-card.js';
import { GIFT_CARD_MAX, GIFT_CARD_MIN } from '../../config.js';
import { formatCOP } from '../../utils/format.js';

export function createGiftState() {
  return { color: 0, amount: GIFT_DEFAULT_AMOUNT, custom: 0, delivery: 0, back: false };
}

export const valueOf = (state) => state.custom || state.amount;
export const isValid = (value) => value >= GIFT_CARD_MIN && value <= GIFT_CARD_MAX;

/** Ziffern aus dem Feld "Otro monto", höchstens 7 Stellen, mit Tausenderpunkten */
export function readCustom(input) {
  const digits = input.value.replace(/\D/g, '').slice(0, 7);
  input.value = digits ? Number(digits).toLocaleString('es-CO') : '';
  return Number(digits) || 0;
}

/** Je länger der Betrag, desto kleiner die Schrift auf der Karte */
export function amountScale(text) {
  if (text.length >= 10) return 0.78;
  return text.length >= 9 ? 0.88 : 1;
}

function mark(form, selector, isOn) {
  form
    .querySelectorAll(selector)
    .forEach((element) => element.setAttribute('aria-checked', String(isOn(element))));
}

function renderChoices(form, state) {
  mark(form, '[data-gift-amount-option]', (el) => {
    return !state.custom && Number(el.dataset.giftAmountOption) === state.amount;
  });
  mark(form, '[data-gift-delivery]', (el) => Number(el.dataset.giftDelivery) === state.delivery);
}

function renderCustom(form, state, valid) {
  const invalid = Boolean(state.custom) && !valid;
  const custom = form.querySelector('[data-gift-custom-wrap]');
  custom.classList.toggle('is-active', Boolean(state.custom));
  custom.classList.toggle('is-invalid', invalid);
  form.querySelector('[data-gift-range]').classList.toggle('is-invalid', invalid);
}

export function renderForm(form, state) {
  const value = valueOf(state);
  const valid = isValid(value);
  renderChoices(form, state);
  renderCustom(form, state, valid);
  form.querySelector('[data-gift-total]').textContent = formatCOP(value);
  form.querySelector('[data-gift-submit]').disabled = !valid;
  const hint = valid
    ? GIFT_DELIVERY[state.delivery].hint
    : 'Elige un monto entre $50.000 y $5.000.000.';
  form.querySelector('[data-gift-hint]').textContent = hint;
}

export function readTexts(form) {
  const read = (name) => form.elements[name].value.trim();
  return {
    to: read('to') || GIFT_DEFAULTS.to,
    from: read('from') || GIFT_DEFAULTS.from,
    message: read('message'),
    recipient: read('to'),
    sender: read('from'),
  };
}
