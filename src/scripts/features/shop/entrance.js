/*
 * Karten im Raster kippen beim Scrollen von unten herein (wie in v7).
 * ScrollTrigger liefert nur den Fortschritt, das CSS rechnet daraus die Bewegung (--enter: 0 → 1).
 */
import { ScrollTrigger, withGsap } from '../../effects/gsap.js';
import { prefersReducedMotion } from '../../utils/motion.js';

function columnOf(cell) {
  return Math.round(cell.offsetLeft / Math.max(1, cell.offsetWidth));
}

function paint(cell, progress) {
  const eased = 1 - (1 - progress) ** 3;
  cell.style.setProperty('--enter', eased.toFixed(4));
  cell.style.setProperty('--enter-opacity', Math.min(1, progress * 1.8).toFixed(3));
}

function createTrigger(cell) {
  ScrollTrigger.create({
    trigger: cell,
    start: () => `top bottom-=${columnOf(cell) * 70}`,
    end: () => `+=${innerHeight * 0.42}`,
    onUpdate: (self) => paint(cell, self.progress),
    onRefresh: (self) => paint(cell, self.progress),
  });
}

export function initEntrance(root, signal) {
  if (prefersReducedMotion()) return;
  root.classList.add('has-entrance');
  withGsap(signal, () =>
    root.querySelectorAll('.shop-grid [data-shop-item]').forEach(createTrigger),
  );
}

export function refreshEntrance() {
  ScrollTrigger.refresh();
}
