/*
 * Das Produktbild fliegt in einem Bogen zur Bolsa im Header, danach hüpft die Bolsa kurz.
 * Startfläche ist das nächste Element mit [data-fly-source] (z. B. die ganze Karte), sonst der Button.
 */
import { prefersReducedMotion } from '../utils/motion.js';

export const FLIGHT_MS = 950;
const BUMP = [{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }];

function createFlyer(image, box) {
  const flyer = document.createElement('img');
  flyer.src = image;
  flyer.className = 'cart-flyer';
  Object.assign(flyer.style, {
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
  });
  document.body.append(flyer);
  return flyer;
}

function flightPath(dx, dy) {
  return [
    { transform: 'translate(0,0) scale(1)', opacity: 1 },
    {
      transform: `translate(${dx * 0.4}px,${dy * 0.4 - 120}px) scale(.5) rotate(-8deg)`,
      offset: 0.45,
    },
    { transform: `translate(${dx}px,${dy}px) scale(.06) rotate(12deg)`, opacity: 0.2 },
  ];
}

function offsetBetween(box, target) {
  const end = target.getBoundingClientRect();
  return {
    dx: end.left + end.width / 2 - (box.left + box.width / 2),
    dy: end.top + end.height / 2 - (box.top + box.height / 2),
  };
}

function land(flyer, target) {
  flyer.remove();
  target.animate(BUMP, { duration: 420, easing: 'cubic-bezier(.3,1.6,.5,1)' });
}

export function flyToCart(source, image) {
  const target = document.querySelector('[data-cart-target]');
  if (!source || !target || !image || prefersReducedMotion()) return;
  const box = (source.closest('[data-fly-source]') ?? source).getBoundingClientRect();
  const flyer = createFlyer(image, box);
  const { dx, dy } = offsetBetween(box, target);
  const options = { duration: FLIGHT_MS, easing: 'cubic-bezier(.5,0,.2,1)' };
  flyer.animate(flightPath(dx, dy), options).onfinish = () => land(flyer, target);
}
