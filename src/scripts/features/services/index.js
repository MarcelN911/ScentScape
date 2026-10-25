/* Seite "Servicios": Bewertungs-Karussell und Beratung mit Handy-Chat. */
import { withGsap } from '../../effects/gsap.js';
import { animateAdvice, initAdvice } from '../chat/advice.js';
import { initPanel } from './panel.js';

export function initServicesPage(signal) {
  const root = document.querySelector('[data-services-page]');
  if (!root) return;
  initPanel(signal);
  initAdvice(signal);
  withGsap(signal, animateAdvice);
  setTimeout(() => root.classList.add('is-in'), 80);
}
