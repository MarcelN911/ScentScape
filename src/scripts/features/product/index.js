/* Startet alles, was die Produktseite braucht. */
import { initTilt } from '../../effects/tilt.js';
import { initAccordions } from '../accordion.js';
import { initDragScroll } from '../drag-scroll.js';
import { initBuy } from './buy.js';
import { initGallery } from './gallery.js';
import { initPyramid } from './pyramid.js';
import { initStickyBuy } from './sticky-buy.js';

export function initProductPage(signal) {
  initGallery(signal);
  initBuy(signal);
  initAccordions(signal);
  initPyramid(signal);
  initTilt(signal);
  initDragScroll(signal);
  return initStickyBuy();
}
