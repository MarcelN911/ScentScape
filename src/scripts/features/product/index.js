/* Produktseite: Bühne, Kauf, Akkordeon, Scroll-Effekte, verwandte Produkte, Chat. */
import { withGsap } from '../../effects/gsap.js';
import { initAccordions } from '../accordion.js';
import { animateAdvice, initAdvice } from '../chat/advice.js';
import { initBuy } from './buy.js';
import { initRelated } from './related.js';
import { animateProductScroll } from './scroll.js';
import { initStage } from './stage.js';

export function initProductPage(signal) {
  const page = document.querySelector('[data-product-page]');
  if (!page) return;
  initStage(signal);
  initBuy(signal);
  initAccordions(signal);
  initRelated(signal);
  initAdvice(signal);
  withGsap(signal, () => {
    animateProductScroll();
    animateAdvice();
  });
  setTimeout(() => page.classList.add('is-in'), 80);
}
