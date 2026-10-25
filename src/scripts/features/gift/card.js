/*
 * Bewegung der Gift Card: Schweben, wiederkehrender Glanzstreifen, Kippen mit der Maus,
 * Umdrehen und Farbwechsel mit runder Wischblende.
 */
import { GIFT_COLORS } from '../../../data/gift-card.js';
import { prefersReducedMotion } from '../../utils/motion.js';

const FLOAT = [
  { transform: 'translateY(0) rotateZ(0deg)' },
  { transform: 'translateY(-10px) rotateZ(-.6deg)' },
  { transform: 'translateY(0) rotateZ(0deg)' },
];
const SWEEP_EASE = 'cubic-bezier(.4,0,.2,1)';
const SWEEP = [
  { transform: 'translateX(-160%) skewX(-18deg)' },
  { transform: 'translateX(320%) skewX(-18deg)', offset: 0.32 },
  { transform: 'translateX(320%) skewX(-18deg)' },
];

/** Schweben und Glanz; gibt eine Funktion zum Stoppen zurück */
export function startIdle(card) {
  if (prefersReducedMotion()) return () => {};
  const float = card.querySelector('[data-gift-float]');
  const sweep = card.querySelector('[data-gift-sweep]');
  const animations = [
    float.animate(FLOAT, { duration: 6500, iterations: Infinity, easing: 'ease-in-out' }),
    sweep.animate(SWEEP, { duration: 5600, delay: 2200, iterations: Infinity, easing: SWEEP_EASE }),
  ];
  return () => animations.forEach((animation) => animation.cancel());
}

export function setFlipped(card, back) {
  card.style.setProperty('--turn', back ? '180deg' : '0deg');
}

function tilt(card, event) {
  const box = card.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width - 0.5;
  const y = (event.clientY - box.top) / box.height - 0.5;
  const flipped = card.style.getPropertyValue('--turn') === '180deg';
  card.style.setProperty('--rx', `${(flipped ? y : -y) * 14}deg`);
  card.style.setProperty('--ry', `${x * 18}deg`);
  card.style.setProperty('--gx', `${Math.round((x + 0.5) * 100)}%`);
  card.style.setProperty('--gy', `${Math.round((y + 0.5) * 100)}%`);
  card.style.setProperty('--ga', '0.22');
  card.style.setProperty('--speed', '0.25s');
}

function untilt(card) {
  ['--rx', '--ry'].forEach((name) => card.style.setProperty(name, '0deg'));
  card.style.setProperty('--ga', '0');
  card.style.setProperty('--speed', '1.1s');
}

export function bindTilt(card, signal, enabled = () => true) {
  let frame = 0;
  card.addEventListener(
    'mousemove',
    (event) => {
      if (!enabled()) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => tilt(card, event));
    },
    { signal },
  );
  card.addEventListener('mouseleave', () => untilt(card), { signal });
}

/** Neue Farbe wächst über die alte. Gibt die Farbe zurück (für Lichtschein und Name). */
export function setColor(card, index, previous) {
  const color = GIFT_COLORS[index];
  card.querySelectorAll('[data-color-layer]').forEach((layer) => {
    const at = Number(layer.dataset.colorLayer);
    layer.classList.toggle('is-current', at === index);
    layer.classList.toggle('is-previous', at === previous && at !== index);
  });
  card.style.setProperty('--ink', color.ink);
  card.style.setProperty('--amount', color.amount);
  card.style.setProperty('--line', color.line);
  card.style.setProperty('--logo', color.logo);
  return color;
}
