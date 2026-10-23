/* Gift-Card-Seite: Farbe, Betrag, Namen, Nachricht, Lieferart und "In den Warenkorb". */
import { GIFT_AMOUNTS, GIFT_COLORS, GIFT_DELIVERY } from '../../../data/gift-card.js';
import { addItem } from '../../cart/store.js';
import { showToast } from '../../core/events.js';
import { formatCOP } from '../../utils/format.js';
import { bindCardTilt } from './tilt.js';
import { isValidAmount, paintGift, paintTexts } from './view.js';

function startState() {
  return {
    color: 0,
    amount: GIFT_AMOUNTS[1],
    custom: false,
    delivery: GIFT_DELIVERY[0],
    flipped: false,
  };
}

function choose(state, choice) {
  const { choice: group, value } = choice.dataset;
  if (group === 'color') Object.assign(state, { color: Number(value), flipped: false });
  if (group === 'amount') Object.assign(state, { amount: Number(value), custom: false });
  if (group === 'delivery') state.delivery = value;
}

function readCustomAmount(state, input) {
  const digits = input.value.replace(/\D/g, '').slice(0, 7);
  input.value = digits ? Number(digits).toLocaleString('es-CO') : '';
  Object.assign(
    state,
    digits ? { amount: Number(digits), custom: true } : { amount: GIFT_AMOUNTS[1], custom: false },
  );
}

function giftItem(state, form) {
  const read = (name) => form.elements[name].value.trim();
  return {
    sku: `giftcard-${Date.now()}`,
    giftCard: true,
    name: 'Gift card',
    regularPrice: state.amount,
    quantity: 1,
    ...{ recipient: read('to'), sender: read('from'), message: read('message') },
    ...{ delivery: state.delivery, color: GIFT_COLORS[state.color].name },
  };
}

function addToCart(state, form) {
  if (!isValidAmount(state.amount)) return showToast('Elige un monto entre $50.000 y $5.000.000');
  addItem(giftItem(state, form));
  return showToast(`✓ Gift card ${formatCOP(state.amount)} en tu carrito`);
}

function onInput(root, state, event) {
  if (event.target.name === 'custom') readCustomAmount(state, event.target);
  paintTexts(root, event.currentTarget);
  paintGift(root, state);
}

function bindForm(root, state, signal) {
  const form = root.querySelector('[data-gift-form]');
  form.addEventListener('input', (event) => onInput(root, state, event), { signal });
  const onSubmit = (event) => {
    event.preventDefault();
    addToCart(state, form);
  };
  form.addEventListener('submit', onSubmit, { signal });
}

function bindClicks(root, state, signal) {
  root.addEventListener(
    'click',
    (event) => {
      const choice = event.target.closest('[data-choice]');
      if (choice) choose(state, choice);
      if (event.target.closest('[data-gift-stage], [data-gift-flip]'))
        state.flipped = !state.flipped;
      paintGift(root, state);
    },
    { signal },
  );
}

export function initGiftCard(signal) {
  const root = document.querySelector('[data-gift]');
  if (!root) return;
  const state = startState();
  bindClicks(root, state, signal);
  bindForm(root, state, signal);
  bindCardTilt(root, signal);
  paintGift(root, state);
}
