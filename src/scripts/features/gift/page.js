/* Seite "Gift Card": Farbe, Betrag, Namen, Nachricht, Lieferart, Vorschau und "In den Warenkorb". */
import { GIFT_COLORS, GIFT_DEFAULTS, GIFT_DELIVERY } from '../../../data/gift-card.js';
import { addWithFeedback } from '../../cart/add-to-cart.js';
import { formatCOP } from '../../utils/format.js';
import { bindTilt, setColor, setFlipped, startIdle } from './card.js';
import {
  amountScale,
  createGiftState,
  isValid,
  readCustom,
  readTexts,
  renderForm,
  valueOf,
} from './form.js';
import { setOdometer } from './odometer.js';

function paintAmount(card, value) {
  const text = formatCOP(value);
  setOdometer(card.querySelector('[data-gift-amount] [data-odometer]'), text);
  card.style.setProperty('--amount-k', amountScale(text));
}

function paintTexts(card, form) {
  const texts = readTexts(form);
  card.querySelector('[data-gift-to]').textContent = texts.to;
  card.querySelector('[data-gift-from]').textContent = texts.from;
  const message = card.querySelector('[data-gift-message]');
  message.textContent = `“${texts.message || GIFT_DEFAULTS.message}”`;
  message.classList.toggle('is-faded', !texts.message);
  form.querySelector('[data-gift-count]').textContent = form.elements.message.value.length;
}

function paintSide(gift) {
  const { root, card, state } = gift;
  setFlipped(card, state.back);
  root.classList.toggle('is-back', state.back);
  root.querySelector('[data-gift-flip-label]').textContent = state.back
    ? 'Ver frente'
    : 'Ver reverso';
}

function render(gift) {
  renderForm(gift.form, gift.state);
  paintAmount(gift.card, valueOf(gift.state));
  paintTexts(gift.card, gift.form);
  paintSide(gift);
}

function pickColor(gift, index) {
  if (index === gift.state.color) return;
  const color = setColor(gift.card, index, gift.state.color);
  gift.state.color = index;
  gift.root.querySelector('[data-gift-color-name]').textContent = color.name;
  gift.root.querySelector('.split').style.setProperty('--glow', color.glow);
  gift.root.querySelectorAll('[data-gift-color]').forEach((swatch) => {
    swatch.setAttribute('aria-checked', String(Number(swatch.dataset.giftColor) === index));
  });
}

function pickAmount(gift, amount) {
  gift.form.elements.custom.value = '';
  Object.assign(gift.state, { amount, custom: 0 });
}

const CLICKS = [
  ['[data-gift-color]', (gift, el) => pickColor(gift, Number(el.dataset.giftColor))],
  [
    '[data-gift-amount-option]',
    (gift, el) => pickAmount(gift, Number(el.dataset.giftAmountOption)),
  ],
  ['[data-gift-delivery]', (gift, el) => (gift.state.delivery = Number(el.dataset.giftDelivery))],
  ['[data-gift-flip]', (gift) => (gift.state.back = !gift.state.back)],
];

function handleClick(gift, event) {
  for (const [selector, action] of CLICKS) {
    const element = event.target.closest(selector);
    if (element) {
      action(gift, element);
      return render(gift);
    }
  }
  return undefined;
}

function handleInput(gift, event) {
  if (event.target.name === 'custom') gift.state.custom = readCustom(event.target);
  if (event.target.name === 'message') gift.state.back = true;
  render(gift);
}

/* Was auf der Karte steht und wie sie geliefert wird */
function giftDetails(gift) {
  const texts = readTexts(gift.form);
  return {
    color: GIFT_COLORS[gift.state.color].name,
    recipient: texts.recipient,
    sender: texts.sender,
    message: texts.message,
    delivery: GIFT_DELIVERY[gift.state.delivery].title,
  };
}

function giftItem(gift) {
  const value = valueOf(gift.state);
  const details = giftDetails(gift);
  return {
    ...details,
    sku: `gift-${details.color}-${value}-${details.recipient}`,
    giftCard: true,
    name: `Gift Card ${details.color}`,
    brand: 'ScentScape',
    image: '/assets/img/scentscape-logo.png',
    regularPrice: value,
    quantity: 1,
  };
}

function submit(gift, event) {
  event.preventDefault();
  const value = valueOf(gift.state);
  if (!isValid(value)) return;
  const message = `Gift Card ${GIFT_COLORS[gift.state.color].name} · ${formatCOP(value)} · añadida`;
  addWithFeedback(giftItem(gift), gift.card, message);
  gift.state.back = false;
  render(gift);
}

/* Beim Schreiben der Nachricht zeigt die Karte ihre Rückseite */
function showBackWhileWriting(gift, signal) {
  const field = gift.form.elements.message;
  const show = (back) => () => {
    gift.state.back = back;
    render(gift);
  };
  field.addEventListener('focus', show(true), { signal });
  field.addEventListener('blur', show(false), { signal });
}

function bindGift(gift, signal) {
  gift.root.addEventListener('click', (event) => handleClick(gift, event), { signal });
  gift.form.addEventListener('input', (event) => handleInput(gift, event), { signal });
  gift.form.addEventListener('submit', (event) => submit(gift, event), { signal });
  showBackWhileWriting(gift, signal);
  bindTilt(gift.card, signal);
  signal.addEventListener('abort', startIdle(gift.card));
}

export function initGiftPage(signal) {
  const root = document.querySelector('[data-gift-page]');
  if (!root) return;
  const card = root.querySelector('[data-gift-card]');
  const gift = {
    root,
    card,
    form: root.querySelector('[data-gift-form]'),
    state: createGiftState(),
  };
  bindGift(gift, signal);
  render(gift);
  setTimeout(() => root.classList.add('is-in'), 80);
}
