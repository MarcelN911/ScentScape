/*
 * Gift-Card-Seite auf dem Handy:
 * - Mini-Vorschau oben (GiftMini.astro): erscheint, wenn die große Karte nach oben weggescrollt ist
 *   und das Formular im Bild ist. Zeigt Farbe, Betrag und Namen live.
 * - Karte zur Seite wischen dreht sie um.
 */
import { GIFT_COLORS } from '../../../data/gift-card.js';
import { formatCOP } from '../../utils/format.js';
import { readTexts, valueOf } from './form.js';

const SWIPE = 30; // so viele Pixel zur Seite drehen die Karte um

function setText(root, selector, text) {
  const element = root.querySelector(selector);
  if (element) element.textContent = text;
}

function paintMiniCard(root, color) {
  const card = root.querySelector('[data-gift-mini-card]');
  if (card) Object.assign(card.style, { background: color.background, color: color.ink });
  setText(root, '[data-gift-mini-color]', color.name);
}

/** Vorschau auf den aktuellen Stand bringen (wird bei jedem render() aufgerufen) */
export function paintMobile(gift) {
  const { root, state, form } = gift;
  const texts = readTexts(form);
  const value = valueOf(state);
  paintMiniCard(root, GIFT_COLORS[state.color]);
  setText(root, '[data-gift-mini-amount]', formatCOP(value));
  setText(root, '[data-gift-mini-to]', texts.to);
  setText(root, '[data-gift-mini-from]', texts.from);
}

/* Vorschau zeigen, wenn die Karte weggescrollt und das Formular im Bild ist */
function showMini(mini, seen) {
  mini.classList.toggle('is-shown', seen.cardAbove && seen.form);
}

/* Merkt sich: Ist das Formular im Bild? Ist die Karte nach oben weggescrollt? */
function note(gift, seen, entry) {
  if (entry.target === gift.form) seen.form = entry.isIntersecting;
  else seen.cardAbove = !entry.isIntersecting && entry.boundingClientRect.top < 0;
}

function watch(gift, mini, signal) {
  const seen = { cardAbove: false, form: false };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => note(gift, seen, entry));
    showMini(mini, seen);
  });
  observer.observe(gift.card);
  observer.observe(gift.form);
  signal.addEventListener('abort', () => observer.disconnect());
}

/* Karte zur Seite wischen = umdrehen */
function bindSwipeFlip(gift, render, signal) {
  let startX = null;
  const down = (event) => (startX = event.clientX);
  const up = (event) => {
    if (startX !== null && Math.abs(event.clientX - startX) > SWIPE) {
      gift.state.back = !gift.state.back;
      render(gift);
    }
    startX = null;
  };
  gift.card.addEventListener('pointerdown', down, { signal });
  gift.card.addEventListener('pointerup', up, { signal });
}

export function initGiftMobile(gift, render, signal) {
  const mini = gift.root.querySelector('[data-gift-mini]');
  if (!mini) return;
  const scrollToCard = () => gift.card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  mini.addEventListener('click', scrollToCard, { signal });
  watch(gift, mini, signal);
  bindSwipeFlip(gift, render, signal);
}
