/*
 * 3D-Karussell der Bewertungen: dreht sich langsam weiter, beim Hovern fast gar nicht.
 * Pfeile (Knöpfe oder Tastatur) geben Schwung oder kehren die Richtung um.
 * Anfassen und Wischen: carousel-drag.js.
 */
import { CAROUSEL } from '../../../data/reviews.js';
import { prefersReducedMotion } from '../../utils/motion.js';
import { bindDrag } from './carousel-drag.js';

/* Karte an Abstand d zur Mitte: seitlich, nach hinten, gedreht, abgedunkelt */
function placeCard(card, d, spacing) {
  const away = Math.abs(d);
  const turn = -Math.max(-2, Math.min(2, d)) * 22;
  card.style.transform = `translate(-50%, -50%) translateX(${(d * spacing).toFixed(1)}px) translateZ(${(-away * 200).toFixed(1)}px) rotateY(${turn.toFixed(2)}deg)`;
  card.style.opacity = away > 2.8 ? 0 : Math.min(1, 2.8 - away).toFixed(3);
  card.style.zIndex = 100 - Math.round(away * 10);
  card.style.pointerEvents = away < 0.5 ? 'auto' : 'none';
  card.style.setProperty('--dim', Math.min(0.65, away * 0.32).toFixed(3));
}

function paintCounter(spin, count) {
  const active = ((Math.round(spin.pos) % count) + count) % count;
  const fraction = ((spin.pos % count) + count) % count;
  spin.now.textContent = String(active + 1).padStart(2, '0');
  spin.bar.style.width = `${(((fraction + 1) / count) * 100).toFixed(2)}%`;
}

/* Abstand zur Mitte, im Kreis gerechnet (die letzte Karte liegt links neben der ersten) */
function offsetOf(index, pos, count) {
  const d = (((index - pos) % count) + count) % count;
  return d > count / 2 ? d - count : d;
}

function paint(spin) {
  const cards = spin.track.children;
  if (!cards.length) return;
  const spacing = cards[0].offsetWidth * (window.innerWidth < 900 ? 0.5 : 0.66);
  spin.spacing = spacing; // für das Wischen: so viele Pixel = eine Karte
  [...cards].forEach((card, index) =>
    placeCard(card, offsetOf(index, spin.pos, cards.length), spacing),
  );
  paintCounter(spin, cards.length);
}

function step(spin, seconds) {
  if (spin.drag) return; // beim Wischen bestimmt der Finger die Lage
  spin.boost *= Math.pow(0.18, seconds);
  spin.hover += ((spin.hovered ? 1 : 0) - spin.hover) * Math.min(1, seconds * 4);
  const speed = spin.still ? spin.boost : CAROUSEL.speed * (1 - spin.hover * 0.85) + spin.boost;
  spin.pos += spin.dir * speed * seconds;
}

function tick(spin, time) {
  const seconds = spin.last ? Math.min(0.05, (time - spin.last) / 1000) : 0;
  spin.last = time;
  step(spin, seconds);
  paint(spin);
  spin.frame = requestAnimationFrame((next) => tick(spin, next));
}

/** Richtung wechseln (kräftiger Schub) oder in gleicher Richtung schneller werden */
export function nudge(spin, dir) {
  if (spin.dir !== dir) {
    spin.dir = dir;
    spin.boost = 2.4;
  } else spin.boost = Math.min(CAROUSEL.maxBoost, spin.boost + 2.2);
}

function onKey(spin, event) {
  const dir = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
  if (!dir || event.target.closest('input, textarea, [contenteditable]')) return;
  const box = spin.region.getBoundingClientRect();
  if (box.bottom < 0 || box.top > window.innerHeight) return;
  event.preventDefault();
  nudge(spin, dir);
}

function bindSpin(spin, root, signal) {
  spin.region.addEventListener('mouseenter', () => (spin.hovered = true), { signal });
  spin.region.addEventListener('mouseleave', () => (spin.hovered = false), { signal });
  document.addEventListener('keydown', (event) => onKey(spin, event), { signal });
  bindDrag(spin, signal);
  root.querySelectorAll('[data-carousel-step]').forEach((button) => {
    const dir = Number(button.dataset.carouselStep);
    button.addEventListener('click', () => nudge(spin, dir), { signal });
  });
  signal.addEventListener('abort', () => cancelAnimationFrame(spin.frame));
}

/* pos: Lage in Karten, dir: Richtung, boost: Schub der Pfeile, hover: 0…1 sanft gebremst */
const START = { pos: 0, dir: 1, boost: 0, hover: 0, hovered: false, last: 0 };

function createSpin(root) {
  return {
    ...START,
    region: root.querySelector('[data-carousel]'),
    track: root.querySelector('[data-carousel-track]'),
    now: root.querySelector('[data-carousel-now]'),
    bar: root.querySelector('[data-carousel-bar]'),
    still: prefersReducedMotion(),
  };
}

export function createCarousel(root, signal) {
  const spin = createSpin(root);
  bindSpin(spin, root, signal);
  spin.frame = requestAnimationFrame((time) => tick(spin, time));
  return spin;
}
