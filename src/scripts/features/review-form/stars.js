/* Sterne-Auswahl: Hover zeigt eine Vorschau, Klick setzt die Bewertung. */
import { RATING_LABELS } from '../../../data/reviews.js';

function paint(picker, value) {
  picker.querySelectorAll('[data-star]').forEach((star) => {
    star.classList.toggle('is-lit', Number(star.dataset.star) <= value);
  });
  picker.querySelector('[data-star-text]').textContent = RATING_LABELS[value];
}

function chosenValue(picker) {
  return Number(picker.querySelector('input[name="rating"]').value);
}

function choose(picker, value) {
  picker.querySelector('input[name="rating"]').value = String(value);
  picker.querySelectorAll('[data-star]').forEach((star) => {
    star.setAttribute('aria-checked', String(Number(star.dataset.star) === value));
  });
  paint(picker, value);
}

export function resetStars(picker) {
  choose(picker, 0);
}

export function bindStars(picker, signal) {
  picker.querySelectorAll('[data-star]').forEach((star) => {
    const value = Number(star.dataset.star);
    star.addEventListener('click', () => choose(picker, value), { signal });
    star.addEventListener('pointerenter', () => paint(picker, value), { signal });
  });
  picker.addEventListener('pointerleave', () => paint(picker, chosenValue(picker)), { signal });
}
