/*
 * Gift Card der Startseite: Wischen zur Seite löst eine feste Drehanimation aus.
 * Die Karte folgt dem Finger nicht, sie dreht sich in Wischrichtung einmal ganz um,
 * sobald weit genug gewischt wurde. Antippen, Klicken oder Enter dreht sie ebenfalls.
 * Während eine Drehung läuft, wird keine neue ausgelöst.
 * Die Drehung zählt weiter (0°, 180°, 360° …), so dreht sie immer in Wischrichtung.
 *
 * Ablauf der Drehung: sanft anlaufen, in der Mitte hebt sich die Karte leicht an und kippt
 * minimal nach hinten, dann setzt sie weich ab. Licht und Schatten dazu macht das CSS
 * (aus --flip und --lift, Lichtstreif mit der Klasse is-turning, siehe StoryCard.astro).
 */
import { prefersReducedMotion } from '../../utils/motion.js';

const SWIPE = 30; // so viele Pixel zur Seite lösen die Drehung aus
const TAP = 6; // weniger Bewegung gilt als Antippen
const DURATION = 1150;
const EASE = 'cubic-bezier(0.65, 0, 0.18, 1)';

/** Animiert --flip (Winkel) und --lift (0 … 1 … 0, wie weit die Karte angehoben ist) */
function framesOf(from, to) {
  return [
    { '--flip': `${from}deg`, '--lift': 0 },
    { '--lift': 1, offset: 0.5 },
    { '--flip': `${to}deg`, '--lift': 0 },
  ];
}

const isTurning = (parts) => parts.motion?.playState === 'running';

/** Eine halbe Umdrehung in Richtung direction (1 oder -1) und den Hinweis ausblenden */
function turn(parts, state, direction) {
  if (isTurning(parts)) return;
  const from = state.turn;
  state.turn += direction * 180;
  parts.flip.style.setProperty('--flip', `${state.turn}deg`);
  parts.root.classList.add('is-flipped');
  if (prefersReducedMotion()) return;
  parts.card.classList.add('is-turning');
  const options = { duration: DURATION, easing: EASE };
  parts.motion = parts.flip.animate(framesOf(from, state.turn), options);
  parts.motion.finished.then(() => parts.card.classList.remove('is-turning')).catch(() => {});
}

function onDown(parts, state, event) {
  Object.assign(state, { startX: event.clientX, done: false });
  parts.card.setPointerCapture(event.pointerId);
}

/* Sobald weit genug gewischt ist, startet die Drehung, noch bevor der Finger loslässt */
function onMove(parts, state, event) {
  if (state.startX === null || state.done) return;
  const distance = event.clientX - state.startX;
  if (Math.abs(distance) < SWIPE) return;
  state.done = true;
  turn(parts, state, Math.sign(distance));
}

function onUp(parts, state, event) {
  if (state.startX === null) return;
  const tapped = !state.done && Math.abs(event.clientX - state.startX) <= TAP;
  state.startX = null;
  if (tapped) turn(parts, state, 1);
}

function onKey(parts, state, event) {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  turn(parts, state, 1);
}

function findParts(card) {
  return {
    card,
    flip: card.querySelector('[data-story-flip]'),
    root: card.closest('[data-story-gift]'),
    motion: null,
  };
}

export function initCardFlip(signal) {
  const card = document.querySelector('[data-story-card]');
  if (!card) return;
  const parts = findParts(card);
  const state = { turn: 0, startX: null, done: false };
  const on = (type, handler) => card.addEventListener(type, handler, { signal });
  on('pointerdown', (event) => onDown(parts, state, event));
  on('pointermove', (event) => onMove(parts, state, event));
  on('pointerup', (event) => onUp(parts, state, event));
  on('pointercancel', () => (state.startX = null));
  on('keydown', (event) => onKey(parts, state, event));
}
