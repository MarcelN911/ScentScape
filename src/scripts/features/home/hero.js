/* Text im Hero gleitet beim Herunterscrollen nach unten und blendet aus. */
import { gsap } from '../../effects/gsap.js';

export function animateHero() {
  const hero = document.querySelector('[data-hero]');
  if (!hero) return;
  gsap.to(hero.querySelector('[data-hero-text]'), {
    y: 90,
    opacity: -0.3,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
  });
}
