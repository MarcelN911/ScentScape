/*
 * Allgemeine Scroll-Effekte für Unterseiten:
 *   data-parallax="-60"  verschiebt senkrecht, je nach Abstand zur Bildschirmmitte (px)
 *   data-drift="-24"     wandert waagerecht, während der Bereich durchs Bild läuft (vw)
 * Gemessen wird am Elternelement, bewegt wird das Element selbst.
 */
import { withGsap } from './gsap.js';
import { centerOffset, onScrollProgress, VISIBLE_RANGE } from './scroll.js';
import { prefersReducedMotion } from '../utils/motion.js';

function parallax(element) {
  const strength = Number(element.dataset.parallax);
  onScrollProgress(element.parentElement, VISIBLE_RANGE, () => {
    element.style.translate = `0 ${(centerOffset(element.parentElement) * strength).toFixed(1)}px`;
  });
}

function drift(element) {
  const strength = Number(element.dataset.drift);
  onScrollProgress(element.parentElement, VISIBLE_RANGE, (progress) => {
    element.style.translate = `${((progress - 0.5) * strength).toFixed(2)}vw 0`;
  });
}

export function initParallax(signal) {
  if (prefersReducedMotion()) return;
  withGsap(signal, () => {
    document.querySelectorAll('[data-parallax]').forEach(parallax);
    document.querySelectorAll('[data-drift]').forEach(drift);
  });
}
