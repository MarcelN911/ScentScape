/* Startet alles, was die Startseite braucht. */
import { withGsap } from '../../effects/gsap.js';
import { prefersReducedMotion } from '../../utils/motion.js';
import { animateBestsellers } from './bestsellers.js';
import { animateFamilies } from './families.js';
import { animateHero } from './hero.js';
import { initIntro } from './intro.js';
import { animateReelFan, initReel } from './reel.js';
import { animateStories, initStoryColors } from './story.js';

export function initHome(signal) {
  if (!document.querySelector('[data-home]')) return undefined;
  initIntro(signal);
  withGsap(signal, () => {
    animateBestsellers();
    animateFamilies(signal);
    animateStories(signal);
    if (prefersReducedMotion()) return;
    animateHero();
    animateReelFan();
  });
  initStoryColors(signal);
  return initReel(signal);
}
