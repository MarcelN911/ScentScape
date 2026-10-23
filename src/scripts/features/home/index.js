/* Startet alles, was die Startseite braucht. */
import { withGsap } from '../../effects/gsap.js';
import { initTilt } from '../../effects/tilt.js';
import { prefersReducedMotion } from '../../utils/motion.js';
import { initAccordions } from '../accordion.js';
import { animateBestsellers } from './bestsellers.js';
import { animateDiscover } from './discover.js';
import { animateFamilies } from './families.js';
import { initFaq } from './faq.js';
import { animateHero } from './hero.js';
import { animateReelFan, initReel } from './reel.js';
import { animateReviews } from './reviews.js';

/* Reine Zier-Effekte, die bei "Bewegung reduzieren" wegfallen */
function animateDecorations() {
  animateHero();
  animateDiscover();
  animateReviews();
  animateReelFan();
}

export function initHome(signal) {
  if (!document.querySelector('[data-home]')) return undefined;
  withGsap(signal, () => {
    animateBestsellers();
    animateFamilies(signal);
    if (!prefersReducedMotion()) animateDecorations();
  });
  initFaq(signal);
  initAccordions(signal);
  initTilt(signal);
  return initReel(signal);
}
