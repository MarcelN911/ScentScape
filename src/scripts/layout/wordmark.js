/*
 * Schriftzug SCENTSCAPE im Footer.
 * Normal: fährt einmal hoch, sobald er sichtbar wird.
 * Startseite (body[data-wordmark="scroll"]): jeder Buchstabe folgt dem Scroll, leicht versetzt.
 */
import { clamp } from '../utils/motion.js';

function revealOnce(mark, signal) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return;
      mark.classList.add('is-revealed');
      observer.disconnect();
    },
    { threshold: 0.2 },
  );
  observer.observe(mark);
  signal.addEventListener('abort', () => observer.disconnect());
}

function paintLetters(footer, letters) {
  const box = footer.getBoundingClientRect();
  const progress = clamp((innerHeight - box.top) / footer.offsetHeight);
  letters.forEach((letter, index) => {
    const y = Math.round((1 - clamp((progress - 0.4) * 2.6 - index * 0.04)) * 105);
    letter.style.setProperty('--y', y);
  });
}

function followScroll(mark, signal) {
  const footer = mark.closest('footer');
  const letters = [...mark.children];
  const paint = () => paintLetters(footer, letters);
  mark.classList.add('is-scroll');
  addEventListener('scroll', paint, { passive: true, signal });
  signal.addEventListener('abort', () => mark.classList.remove('is-scroll'));
  paint();
}

export function initWordmark(signal) {
  const mark = document.querySelector('[data-footer-mark]');
  if (!mark) return;
  if (document.body.dataset.wordmark === 'scroll') followScroll(mark, signal);
  else revealOnce(mark, signal);
}
