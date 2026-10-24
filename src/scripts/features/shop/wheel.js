/*
 * Rad der Duftfamilien: Drehung, gewählte Familie, abgeschwächte Familien ohne Treffer,
 * Etiketten, die bei jeder Drehung außen am Kreis bleiben.
 */
import { scentColor } from '../../../data/scent.js';
import { countWith } from './filter.js';

/** Dreht so wenig wie möglich, bis die gewählte Familie oben steht. */
export function turnTo(current, index) {
  let target = -index * 45;
  while (target - current > 180) target -= 360;
  while (target - current < -180) target += 360;
  return target;
}

function labelOffset(bubble, index, rotation) {
  const size = bubble.offsetWidth;
  const angle = ((index * 45 - 90 + rotation) * Math.PI) / 180;
  const distance = size / 2 + 26;
  bubble.style.setProperty('--lx', `${Math.round(Math.cos(angle) * (distance + 12))}px`);
  bubble.style.setProperty('--ly', `${Math.round(Math.sin(angle) * distance)}px`);
}

function paintBubble(bubble, state, count) {
  const selected = bubble.dataset.wheelFamily === state.family;
  const dimmed = Boolean(state.family) && !selected;
  bubble.setAttribute('aria-checked', String(selected));
  bubble.style.setProperty('--o', count ? (dimmed ? 0.6 : 1) : 0.35);
  bubble.style.setProperty('--sat', dimmed ? 0.35 : 1);
  bubble.style.setProperty('--br', dimmed ? 0.65 : 1);
}

function paintCenter(wheel, state) {
  wheel.querySelector('[data-wheel-eye]').textContent = state.family ? 'Familia' : 'Elige';
  wheel.querySelector('[data-wheel-name]').textContent = state.family ?? 'Todas';
  wheel.querySelector('[data-shop-clear-family]').hidden = !state.family;
  const tint = state.family ? `${scentColor(state.family)}55` : 'rgb(83 16 25 / .5)';
  wheel.style.setProperty('--center-tint', tint);
}

export function renderWheel(root, state, base) {
  const wheel = root.querySelector('[data-wheel]');
  wheel.style.setProperty('--wr', `${state.wheel}deg`);
  wheel.querySelectorAll('[data-wheel-family]').forEach((bubble, index) => {
    const count = countWith(base, (entry) => entry.families.includes(bubble.dataset.wheelFamily));
    paintBubble(bubble, state, count);
    labelOffset(bubble, index, state.wheel);
  });
  paintCenter(wheel, state);
}
