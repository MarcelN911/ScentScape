/*
 * Karussell auf "Servicios": dreht langsam, steht beim Hovern still.
 * Pfeil gedrückt halten (Maus, Finger oder Tastatur) dreht schneller, Punkt oder Karte springt dorthin.
 */
import { prefersReducedMotion } from '../../utils/motion.js';

const SPEED = { idle: 0.24, hold: 1.3 };
const ARROW_KEYS = { ArrowLeft: -1, ArrowRight: 1 };

/* pos: Lage in Karten, target: Sprungziel (oder null), dir/hold: Richtung und gedrückter Pfeil */
const START = {
  pos: 0,
  velocity: 0,
  target: null,
  dir: 1,
  hold: false,
  hovered: false,
  active: -1,
  last: 0,
};

function offsetOf(index, pos, count) {
  const d = (((index - pos) % count) + count) % count;
  return d >= count / 2 ? d - count : d;
}

function placeCard(card, d, step) {
  const away = Math.abs(d);
  const opacity = away < 2 ? 1 - away * 0.3 : Math.max(0, 0.4 * (1 - (away - 2) / 0.7));
  const scale = 1 - Math.min(away, 2) * 0.1;
  card.style.transform = `translateY(-50%) translateX(${(d * step).toFixed(1)}px) translateY(${(away * 24).toFixed(1)}px) rotateY(${(-d * 18).toFixed(2)}deg) scale(${scale.toFixed(3)})`;
  card.style.opacity = opacity.toFixed(3);
  card.style.zIndex = String(100 - Math.round(away * 10));
}

function markActive(panel) {
  const count = panel.cards.length;
  const active = ((Math.round(panel.pos) % count) + count) % count;
  if (active === panel.active) return;
  panel.active = active;
  panel.cards.forEach((card, index) => card.classList.toggle('is-active', index === active));
  panel.dots.forEach((dot, index) => dot.classList.toggle('is-active', index === active));
}

function glide(panel, seconds) {
  const gap = panel.target - panel.pos;
  panel.pos += gap * Math.min(1, seconds * 6);
  panel.velocity = 0;
  if (Math.abs(gap) < 0.002) [panel.pos, panel.target] = [panel.target, null];
}

/* Zum Ziel gleiten (Punkt geklickt) oder mit sanft angepasstem Tempo weiterdrehen */
function move(panel, seconds) {
  if (panel.target !== null) return glide(panel, seconds);
  const goal =
    panel.hovered || panel.still ? 0 : panel.dir * (panel.hold ? SPEED.hold : SPEED.idle);
  panel.velocity += (goal - panel.velocity) * Math.min(1, seconds * 3);
  panel.pos += panel.velocity * seconds;
  return undefined;
}

function paint(panel) {
  const step = panel.cards[0].offsetWidth * 0.62;
  panel.cards.forEach((card, index) =>
    placeCard(card, offsetOf(index, panel.pos, panel.cards.length), step),
  );
  markActive(panel);
}

function tick(panel, time) {
  const seconds = panel.last ? Math.min(0.05, (time - panel.last) / 1000) : 0;
  const box = panel.root.getBoundingClientRect();
  panel.last = time;
  panel.visible = box.bottom > 0 && box.top < window.innerHeight;
  if (panel.visible) {
    move(panel, seconds);
    paint(panel);
  }
  panel.frame = requestAnimationFrame((next) => tick(panel, next));
}

function press(panel, dir) {
  Object.assign(panel, { hold: true, target: null, dir });
  panel.arrows.forEach((arrow) =>
    arrow.classList.toggle('is-on', Number(arrow.dataset.panelHold) === dir),
  );
}

function bindArrows(panel, signal) {
  const release = () => (panel.hold = false);
  panel.arrows.forEach((arrow) => {
    arrow.addEventListener('pointerdown', () => press(panel, Number(arrow.dataset.panelHold)), {
      signal,
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach((type) => {
      arrow.addEventListener(type, release, { signal });
    });
  });
}

function onKeyDown(panel, event) {
  const dir = ARROW_KEYS[event.key];
  if (!dir || !panel.visible || event.target.closest('input, textarea')) return;
  event.preventDefault();
  press(panel, dir);
}

function bindKeys(panel, signal) {
  document.addEventListener('keydown', (event) => onKeyDown(panel, event), { signal });
  document.addEventListener(
    'keyup',
    (event) => {
      if (ARROW_KEYS[event.key]) panel.hold = false;
    },
    { signal },
  );
}

/* Kürzester Weg zur angeklickten Karte oder zum Punkt */
function onJump(panel, event) {
  const dot = event.target.closest('[data-panel-dot]');
  const card = event.target.closest('[data-panel-card]');
  const index = dot ? Number(dot.dataset.panelDot) : panel.cards.indexOf(card);
  if (index >= 0) panel.target = panel.pos + offsetOf(index, panel.pos, panel.cards.length);
}

function bindPointer(panel, signal) {
  const box = panel.root.querySelector('[data-panel-cards]');
  panel.root.addEventListener('click', (event) => onJump(panel, event), { signal });
  box.addEventListener('mouseenter', () => (panel.hovered = true), { signal });
  box.addEventListener('mouseleave', () => (panel.hovered = false), { signal });
}

export function initPanel(signal) {
  const root = document.querySelector('[data-panel]');
  if (!root) return;
  const panel = { ...START, root, still: prefersReducedMotion() };
  panel.cards = [...root.querySelectorAll('[data-panel-card]')];
  panel.dots = [...root.querySelectorAll('[data-panel-dot]')];
  panel.arrows = [...root.querySelectorAll('[data-panel-hold]')];
  [bindArrows, bindKeys, bindPointer].forEach((bind) => bind(panel, signal));
  panel.frame = requestAnimationFrame((time) => tick(panel, time));
  signal.addEventListener('abort', () => cancelAnimationFrame(panel.frame));
}
