/* Seite "Regalo": Gift Card aus dem Link lesen, Umschlag öffnen, Karte drehen (Knopf, Antippen, Wischen), Code kopieren. */
import { showToast } from '../../core/events.js';
import { bindTilt, startIdle } from '../gift/card.js';
import { readGift } from './data.js';
import { fillGift, rollAmount } from './fill.js';
import { clearSteps, openGift, paint, resetGift } from './sequence.js';
import { startVideoMode } from './video.js';

const isDone = (regalo) => regalo.state.phase >= 5;

function flip(regalo) {
  if (!isDone(regalo)) return;
  regalo.state.back = !regalo.state.back;
  paint(regalo);
}

/* Ersatz für ältere Handys ohne moderne Zwischenablage: Text kurz in ein Feld, markieren, kopieren */
function copyFallback(text) {
  const field = Object.assign(document.createElement('textarea'), { value: text, readOnly: true });
  field.style.cssText = 'position:fixed;opacity:0';
  document.body.append(field);
  field.select();
  document.execCommand('copy');
  field.remove();
}

function writeClipboard(text) {
  if (!navigator.clipboard) return copyFallback(text);
  return navigator.clipboard.writeText(text).catch(() => copyFallback(text));
}

function copyCode(regalo) {
  writeClipboard(regalo.gift.code);
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
  ['[data-regalo-copy-code]', copyCode],
  ['[data-regalo-replay]', replay],
];

function handleClick(regalo, event) {
  /* Nach einem Wischer kommt noch ein Klick an, der darf die Karte nicht zurückdrehen */
  if (regalo.swiped) {
    regalo.swiped = false;
    return;
  }
  const match = CLICKS.find(([selector]) => event.target.closest(selector));
  if (match) match[1](regalo);
}

const SWIPE = 30; // so viele Pixel zur Seite drehen die Karte um

/* Nach einem Wischer: drehen und kurz merken, damit der folgende Klick nicht zurückdreht.
   Nur kurz, weil Touch-Geräte nach dem Wischen oft gar keinen Klick schicken. */
function flipBySwipe(regalo) {
  regalo.swiped = true;
  setTimeout(() => (regalo.swiped = false), 400);
  flip(regalo);
}

/* Karte zur Seite wischen = umdrehen (wenn sie ganz ausgepackt ist) */
function bindSwipe(regalo, signal) {
  const card = regalo.root.querySelector('[data-regalo-card]');
  let startX = null;
  const down = (event) => (startX = event.clientX);
  const up = (event) => {
    const swiped = startX !== null && Math.abs(event.clientX - startX) > SWIPE;
    if (swiped && isDone(regalo)) flipBySwipe(regalo);
    startX = null;
  };
  card.addEventListener('pointerdown', down, { signal });
  card.addEventListener('pointerup', up, { signal });
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
  bindSwipe(regalo, signal);
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
  startVideoMode(regalo, openGift, signal);
  setTimeout(() => root.classList.add('is-in'), 80);
}
