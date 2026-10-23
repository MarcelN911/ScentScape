/*
 * Bewertungen: Überschriftzeilen gleiten von links und rechts herein,
 * die Karten fliegen schräg von unten ein, die Durchschnittsnote zählt hoch.
 */
import { easeOut, onScrollProgress } from '../../effects/scroll.js';
import { clamp } from '../../utils/motion.js';

const ENTER_RANGE = { start: 'top bottom', end: () => `+=${innerHeight * 0.9}` };

function paintHeading(section, progress) {
  section.querySelectorAll('[data-review-drift]').forEach((line) => {
    const direction = Number(line.dataset.reviewDrift);
    line.style.transform = `translateX(${((1 - progress) * direction * 9).toFixed(2)}vw)`;
  });
  const score = section.querySelector('[data-review-score]');
  const value = clamp(progress * 1.2) * Number(score.dataset.reviewScore);
  score.textContent = value.toFixed(1);
}

function flyIn(card, progress) {
  const eased = easeOut(progress);
  const direction = Number(card.dataset.reviewFly);
  const inner = card.firstElementChild;
  inner.style.opacity = Math.min(1, progress * 1.6).toFixed(3);
  inner.style.transform = `translate(${((1 - eased) * direction * 60).toFixed(1)}px, ${((1 - eased) * 140).toFixed(1)}px) rotate(${((1 - eased) * direction * 10).toFixed(2)}deg)`;
}

export function animateReviews() {
  const section = document.querySelector('[data-home-reviews]');
  if (!section) return;
  onScrollProgress(section, ENTER_RANGE, (progress) => paintHeading(section, progress));
  section.querySelectorAll('[data-review-fly]').forEach((card) => {
    const range = { start: 'top bottom', end: () => `+=${innerHeight * 0.55}` };
    onScrollProgress(card, range, (progress) => flyIn(card, progress));
  });
}
