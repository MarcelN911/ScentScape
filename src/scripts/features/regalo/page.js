/* Seite "Regalo": Gift Card aus dem Link lesen, Umschlag öffnen, Karte drehen, Code kopieren. */
import { showToast } from '../../core/events.js';
import { bindTilt, startIdle } from '../gift/card.js';
import { readGift } from './data.js';
import { fillGift, rollAmount } from './fill.js';
import { clearSteps, openGift, paint, resetGift } from './sequence.js';

const isDone = (regalo) => regalo.state.phase >= 5;

function flip(regalo) {
  if (!isDone(regalo)) return;
  regalo.state.back = !regalo.state.back;
  paint(regalo);
}

function copyCode(regalo) {
  navigator.clipboard?.writeText(regalo.gift.code).catch(() => {});
  const button = regalo.root.querySelector('[data-regalo-copy]');
  const label = button.querySelector('[data-regalo-copy-label]');
  button.classList.add('is-copied');
  label.textContent = 'Copiado ✓';
  showToast('Código copiado');
  clearTimeout(regalo.copyTimer);
  regalo.copyTimer = setTimeout(() => {
    button.classList.remove('is-copied');
    label.textContent = 'Copiar';
  }, 2200);
}

function replay(regalo) {
  window.scrollTo(0, 0);
  resetGift(regalo);
}

const CLICKS = [
  ['[data-regalo-open]', openGift],
  ['[data-regalo-flip]', flip],
  ['[data-regalo-card]', flip],
  ['[data-regalo-copy]', copyCode],
  ['[data-regalo-replay]', replay],
];

function handleClick(regalo, event) {
  const match = CLICKS.find(([selector]) => event.target.closest(selector));
  if (match) match[1](regalo);
}

function createRegalo(root) {
  const gift = readGift();
  const regalo = { root, gift, card: root.querySelector('[data-gift-card]'), timers: [] };
  regalo.state = { phase: 0, flap: false, rolled: false, back: false };
  regalo.onRoll = () => rollAmount(root, gift);
  regalo.onReset = () => fillGift(root, gift);
  return regalo;
}

function bindRegalo(regalo, signal) {
  regalo.root.addEventListener('click', (event) => handleClick(regalo, event), { signal });
  bindTilt(regalo.card, signal, () => isDone(regalo));
  const stopIdle = startIdle(regalo.card, regalo.root.querySelector('[data-regalo-float]'));
  signal.addEventListener('abort', () => {
    stopIdle();
    clearSteps(regalo);
    clearTimeout(regalo.copyTimer);
  });
}

export function initRegaloPage(signal) {
  const root = document.querySelector('[data-regalo-page]');
  if (!root) return;
  const regalo = createRegalo(root);
  fillGift(root, regalo.gift);
  bindRegalo(regalo, signal);
  paint(regalo);
  setTimeout(() => root.classList.add('is-in'), 80);
}
