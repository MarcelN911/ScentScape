/* Zeigt die Gift Card so, wie sie gerade eingestellt ist. */
import { GIFT_COLORS, GIFT_DEFAULTS } from '../../../data/gift-card.js';
import { GIFT_CARD_MAX, GIFT_CARD_MIN } from '../../config.js';
import { formatCOP } from '../../utils/format.js';

export function isValidAmount(amount) {
  return amount >= GIFT_CARD_MIN && amount <= GIFT_CARD_MAX;
}

function paintColor(root, index) {
  const color = GIFT_COLORS[index];
  const card = root.querySelector('[data-gift-card]');
  card.style.setProperty('--gc-bg', color.background);
  card.style.setProperty('--gc-ink', color.ink);
  card.style.setProperty('--gc-foil', color.foil);
  card.style.setProperty('--gc-logo', color.logo);
  root.querySelector('[data-gift-color-name]').textContent = color.name;
}

function paintAmount(root, state) {
  const amount = root.querySelector('[data-gift-amount]');
  amount.textContent = formatCOP(state.amount);
  amount.style.animation = 'none';
  void amount.offsetWidth;
  amount.style.animation = '';
  root.querySelector('[data-gift-total]').textContent = formatCOP(state.amount);
  const tooLow = state.custom && state.amount < GIFT_CARD_MIN;
  const hint = root.querySelector('[data-gift-hint]');
  hint.classList.toggle('is-error', state.custom && !isValidAmount(state.amount));
  hint.textContent = tooLow
    ? `Monto mínimo ${formatCOP(GIFT_CARD_MIN)}`
    : `Desde ${formatCOP(GIFT_CARD_MIN)} hasta ${formatCOP(GIFT_CARD_MAX)}`;
}

function paintChoices(root, state) {
  root.querySelectorAll('[data-choice]').forEach((choice) => {
    const value = state[choice.dataset.choice];
    const pressed =
      !(choice.dataset.choice === 'amount' && state.custom) &&
      String(value) === choice.dataset.value;
    choice.setAttribute('aria-pressed', String(pressed));
  });
  root.querySelector('[data-gift-custom]').classList.toggle('is-active', state.custom);
}

export function paintTexts(root, form) {
  const read = (name) => form.elements[name].value.trim();
  root.querySelector('[data-gift-to]').textContent = read('to') || GIFT_DEFAULTS.to;
  root.querySelector('[data-gift-from]').textContent = read('from') || GIFT_DEFAULTS.from;
  root.querySelector('[data-gift-message]').textContent = read('message') || GIFT_DEFAULTS.message;
}

export function paintGift(root, state) {
  paintColor(root, state.color);
  paintAmount(root, state);
  paintChoices(root, state);
  root.querySelector('[data-gift-card]').classList.toggle('is-flipped', state.flipped);
  root.querySelector('[data-gift-flip-label]').textContent = state.flipped
    ? 'Ver frente'
    : 'Ver reverso';
}
