/* Das Produktbild fliegt vom Button in einem Bogen zum Warenkorb-Symbol. */
import { prefersReducedMotion } from '../utils/motion.js';

const BUMP = [
  { transform: 'scale(1)' },
  { transform: 'scale(1.18) rotate(-4deg)' },
  { transform: 'scale(.96)' },
  { transform: 'scale(1)' },
];

function centerOf(element) {
  const box = element.getBoundingClientRect();
  return { x: box.left + box.width / 2, y: box.top + box.height / 2 };
}

function createFlyer(image, start) {
  const flyer = document.createElement('img');
  flyer.src = image;
  flyer.className = 'cart-flyer';
  flyer.style.left = `${start.x - 40}px`;
  flyer.style.top = `${start.y - 40}px`;
  document.body.append(flyer);
  return flyer;
}

function flightPath(dx, dy) {
  return [
    { transform: 'translate(0, 0) scale(1) rotate(0)' },
    {
      transform: `translate(${dx * 0.4}px, ${Math.min(dy, 0) - 140}px) scale(1.1) rotate(-20deg)`,
      offset: 0.45,
    },
    { transform: `translate(${dx}px, ${dy}px) scale(.12) rotate(30deg)`, opacity: 0.4 },
  ];
}

function land(flyer, target) {
  flyer.remove();
  target.animate(BUMP, { duration: 500, easing: 'ease-out' });
}

export function flyToCart(source, image) {
  const target = document.querySelector('[data-cart-target]');
  if (!source || !target || !image || prefersReducedMotion()) return;
  const start = centerOf(source);
  const end = centerOf(target);
  const flyer = createFlyer(image, start);
  const path = flightPath(end.x - start.x, end.y - start.y);
  const flight = flyer.animate(path, { duration: 900, easing: 'cubic-bezier(.5, 0, .3, 1)' });
  flight.onfinish = () => land(flyer, target);
}
