/* Schreibt die Angaben aus dem Link in Umschlag, Karte und rechte Spalte. */
import { formatCOP } from '../../utils/format.js';
import { setColor } from '../gift/card.js';
import { setOdometer } from '../gift/odometer.js';
import { drawQr } from './qr.js';

function setAll(root, selector, text) {
  root.querySelectorAll(selector).forEach((element) => (element.textContent = text));
}

/* Jedes Wort in eine Maske, damit es von unten hereinrutschen kann */
function wordMask(word, index) {
  const mask = document.createElement('span');
  const inner = document.createElement('span');
  mask.className = 'word';
  mask.setAttribute('aria-hidden', 'true');
  inner.style.setProperty('--d', `${250 + index * 70}ms`);
  inner.textContent = word;
  mask.append(inner);
  return mask;
}

function renderWords(heading, message) {
  heading.setAttribute('aria-label', message);
  heading.replaceChildren(...message.split(' ').map(wordMask));
}

function fillColor(root, gift) {
  const card = root.querySelector('[data-gift-card]');
  const color = setColor(card, gift.color, gift.color);
  root.style.setProperty('--gift-bg', color.background);
  root.style.setProperty('--glow', color.glow);
  setOdometer(card.querySelector('[data-odometer]'), formatCOP(gift.amount).replace(/\d/g, '9'), 0);
}

function fillTexts(root, gift) {
  setAll(root, '[data-gift-to], [data-regalo-to]', gift.to);
  setAll(root, '[data-gift-from], [data-regalo-from]', gift.from);
  setAll(root, '[data-gift-message]', `“${gift.message}”`);
  setAll(root, '[data-gift-code]', gift.code || 'SC-····-····');
  setAll(
    root,
    '[data-gift-valid]',
    gift.until ? `Válida hasta ${gift.until.short}` : 'Válida 12 meses',
  );
  root
    .querySelector('[data-regalo-open]')
    .setAttribute('aria-label', `Abrir el regalo de ${gift.from}`);
}

function fillLinks(root, gift) {
  const thanks = `¡Gracias, ${gift.from}! Me encantó mi tarjeta regalo de ScentScape.`;
  root.querySelector('[data-regalo-wa]').href = `https://wa.me/?text=${encodeURIComponent(thanks)}`;
  root.querySelector('[data-regalo-wa-label]').textContent =
    `Agradecer a ${gift.from} por WhatsApp`;
}

/* Echter Link: Code, QR, Datum und Dank zeigen. Beispiel: stattdessen zur Gift Card einladen. */
function showParts(root, gift) {
  const real = !gift.example;
  root.querySelector('[data-regalo-code-panel]').hidden = !real;
  root.querySelector('[data-regalo-row="until"]').hidden = !gift.until;
  root.querySelector('[data-regalo-wa]').hidden = !real;
  root.querySelector('[data-regalo-give]').hidden = real;
  root.querySelector('[data-regalo-eyebrow]').textContent = real
    ? 'Un regalo para ti'
    : 'Así llega tu regalo';
}

function fillCode(root, gift) {
  showParts(root, gift);
  if (gift.example) return;
  root.querySelector('[data-regalo-code]').textContent = gift.code;
  drawQr(root.querySelector('[data-regalo-qr]'), gift.code);
  if (gift.until) root.querySelector('[data-regalo-value="until"]').textContent = gift.until.long;
  fillLinks(root, gift);
}

export function fillGift(root, gift) {
  fillColor(root, gift);
  fillTexts(root, gift);
  renderWords(root.querySelector('[data-regalo-message]'), gift.message);
  root.querySelector('[data-regalo-value="balance"]').textContent = `${formatCOP(gift.amount)} COP`;
  fillCode(root, gift);
}

/** Betrag rollt von 9 auf die richtigen Ziffern */
export function rollAmount(root, gift) {
  setOdometer(root.querySelector('[data-gift-card] [data-odometer]'), formatCOP(gift.amount), 90);
}
