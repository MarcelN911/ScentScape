/* Karten mit [data-tilt] neigen sich zur Maus hin (nur mit Maus, nicht auf Touch). */
import { hasFinePointer, prefersReducedMotion } from '../utils/motion.js';

const MAX_TILT = { x: 8, y: 10 };

function tiltTowards(card, event) {
  const rect = card.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  card.style.setProperty('--tilt-x', `${(-y * MAX_TILT.x).toFixed(2)}deg`);
  card.style.setProperty('--tilt-y', `${(x * MAX_TILT.y).toFixed(2)}deg`);
  card.style.setProperty('--tilt-lift', '-6px');
}

function resetTilt(card) {
  ['--tilt-x', '--tilt-y', '--tilt-lift'].forEach((name) => card.style.removeProperty(name));
}

export function initTilt(signal) {
  if (!hasFinePointer() || prefersReducedMotion()) return;
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (event) => tiltTowards(card, event), { signal });
    card.addEventListener('pointerleave', () => resetTilt(card), { signal });
  });
}
