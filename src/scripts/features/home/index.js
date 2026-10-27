/* Startet alles, was die Startseite braucht. */
import { withGsap } from '../../effects/gsap.js';
import { prefersReducedMotion } from '../../utils/motion.js';
import { animateBestsellers } from './bestsellers.js';
import { initCardFlip } from './card-flip.js';
import { animateFamilies } from './families.js';
import { animateHero } from './hero.js';
import { watchHeroVideo } from './hero-video.js';
import { initIntro } from './intro.js';
import { animateReelFan, initReel } from './reel.js';
import { animateStories, initStoryColors } from './story.js';

/* Gift Card: Farbwahl und Umdrehen */
function initGiftCard(signal) {
  initStoryColors(signal);
  initCardFlip(signal);
}

/* Scroll-Effekte; Hero und Fächer der Videos nur ohne "weniger Bewegung" */
function animateSections(signal) {
  animateBestsellers();
  animateFamilies(signal);
  animateStories(signal);
  if (prefersReducedMotion()) return;
  animateHero();
  animateReelFan();
}

export function initHome(signal) {
  if (!document.querySelector('[data-home]')) return undefined;
  initIntro(signal);
  watchHeroVideo(signal);
  withGsap(signal, () => animateSections(signal));
  initGiftCard(signal);
  return initReel(signal);
}
