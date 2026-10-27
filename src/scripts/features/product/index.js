/* Produktseite: Bühne, Kauf, Akkordeon, Scroll-Effekte, verwandte Produkte, Chat. */
import { withGsap } from '../../effects/gsap.js';
import { initAccordions } from '../accordion.js';
import { animateAdvice, initAdvice } from '../chat/advice.js';
import { initProductBar } from './bar.js';
import { initBuy } from './buy.js';
import { initReadMore } from './more.js';
import { initRelated } from './related.js';
import { animateProductScroll } from './scroll.js';
import { initStage } from './stage.js';

/* Kaufbereich und (Handy) feste Kaufleiste unten */
function initBuying(signal) {
  initBuy(signal);
  initProductBar(signal);
}

/* Akkordeon (Descripción, Envíos …) und "Leer más" der Beschreibung */
function initDetails(signal) {
  initAccordions(signal);
  initReadMore(signal);
}

export function initProductPage(signal) {
  const page = document.querySelector('[data-product-page]');
  if (!page) return;
  initStage(signal);
  initBuying(signal);
  initDetails(signal);
  initRelated(signal);
  initAdvice(signal);
  withGsap(signal, () => {
    animateProductScroll();
    animateAdvice();
  });
  setTimeout(() => page.classList.add('is-in'), 80);
}
