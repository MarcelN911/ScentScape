/*
 * Scroll-Effekte der Produktseite (Formeln aus der Vorlage). Laufen innerhalb von withGsap().
 * Hintergrundwort der Bühne, Bewertungskarten, Bereich "También te puede gustar".
 */
import { easeOut as ease, onScrollProgress, VISIBLE_RANGE } from '../../effects/scroll.js';
import { clamp } from '../../utils/motion.js';

function driftWord() {
  const top = document.querySelector('.product__top');
  const stage = document.querySelector('[data-stage]');
  if (!top || !stage) return;
  onScrollProgress(top, { start: 'top top', end: 'bottom center' }, (p) => {
    stage.style.setProperty('--word-x', (4 - p * 40).toFixed(2));
  });
}

function revealReviews() {
  const section = document.querySelector('[data-product-reviews]');
  if (!section) return;
  const cards = [...section.querySelectorAll('[data-review-card]')];
  onScrollProgress(section, VISIBLE_RANGE, (p) => {
    const shown = clamp((p - 0.1) / 0.3);
    cards.forEach((card, i) => card.classList.toggle('is-on', shown > i * 0.08));
  });
}

function animateRelated() {
  const section = document.querySelector('[data-related]');
  if (!section) return;
  onScrollProgress(section, VISIBLE_RANGE, (p) => {
    const t = ease(clamp((p - 0.08) / 0.25));
    section.style.setProperty('--line', Math.round(10 + t * 30));
    section.style.setProperty('--word-x', (6 - p * 40).toFixed(2));
    section.style.setProperty('--t1', (110 * (1 - t)).toFixed(1));
    section.style.setProperty('--t2', (110 * (1 - ease(clamp((p - 0.12) / 0.25)))).toFixed(1));
    section.classList.toggle('is-shown', t > 0.3);
  });
}

export function animateProductScroll() {
  driftWord();
  revealReviews();
  animateRelated();
}
