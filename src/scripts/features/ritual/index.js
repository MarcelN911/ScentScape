/*
 * Seite "El Ritual": Portada gleitet beim Scrollen weg, Tarjetas kippen mit der Maus,
 * "Descubre el ritual" gleitet zum ersten Moment. Einblenden und Parallax laufen über data-reveal/data-parallax.
 */
import { withGsap } from '../../effects/gsap.js';
import { onScrollProgress } from '../../effects/scroll.js';
import { prefersReducedMotion } from '../../utils/motion.js';
import { SITE_URL } from '../../config.js';
import { drawQr } from '../../utils/qr.js';

const HERO_RANGE = { start: 'top top', end: 'bottom top' };

function animateHero(root) {
  const hero = root.querySelector('[data-ritual-hero]');
  const text = root.querySelector('[data-ritual-text]');
  const image = root.querySelector('[data-ritual-image]');
  onScrollProgress(hero, HERO_RANGE, (progress) => {
    text.style.translate = `0 ${(-progress * 90).toFixed(1)}px`;
    text.style.opacity = (1 - progress * 1.3).toFixed(3);
    image.style.translate = `0 ${(progress * window.innerHeight * 0.28).toFixed(1)}px`;
  });
}

/* Mausposition im Bild: −1 … 1 in beide Richtungen */
function tiltTo(cards, frame, event) {
  const box = frame.getBoundingClientRect();
  cards.style.setProperty('--tx', (((event.clientX - box.left) / box.width - 0.5) * 2).toFixed(2));
  cards.style.setProperty('--ty', (((event.clientY - box.top) / box.height - 0.5) * 2).toFixed(2));
}

function bindTilt(cards, signal) {
  const frame = cards.parentElement;
  const reset = () => ['--tx', '--ty'].forEach((name) => cards.style.removeProperty(name));
  frame.addEventListener('mousemove', (event) => tiltTo(cards, frame, event), { signal });
  frame.addEventListener('mouseleave', reset, { signal });
}

function bindFirstMoment(root, signal) {
  const target = root.querySelector('#momento-01');
  root.querySelectorAll('[data-ritual-first]').forEach((link) => {
    link.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      },
      { signal },
    );
  });
}

export function initRitualPage(signal) {
  const root = document.querySelector('[data-ritual-page]');
  if (!root) return;
  const cards = root.querySelector('[data-ritual-cards]');
  drawQr(root.querySelector('[data-ritual-qr]'), SITE_URL);
  bindTilt(cards, signal);
  bindFirstMoment(root, signal);
  if (!prefersReducedMotion()) withGsap(signal, () => animateHero(root));
  setTimeout(() => root.classList.add('is-in'), 80);
}
