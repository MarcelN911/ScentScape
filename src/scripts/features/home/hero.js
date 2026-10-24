/* Hero-Text gleitet beim Scrollen nach oben und blendet aus. Läuft innerhalb von withGsap(). */
import { onScrollProgress } from '../../effects/scroll.js';

export function animateHero() {
  const hero = document.querySelector('[data-hero]');
  const text = hero?.querySelector('[data-hero-text]');
  if (!text) return;
  onScrollProgress(hero, { start: 'top top', end: 'bottom top' }, (progress) => {
    text.style.transform = `translateY(${(progress * 90).toFixed(1)}px)`;
    text.style.opacity = (1 - progress * 1.3).toFixed(3);
  });
}
