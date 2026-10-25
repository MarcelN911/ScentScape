/* Seite "Reseñas": Bewertungswand oben, Formular mit Live-Vorschau unten. */
import { toPlain } from '../../utils/text.js';
import { initReviewForm } from './form.js';
import { initWall } from './wall.js';

function readData(root) {
  const { reviews, products } = JSON.parse(root.querySelector('[data-reviews-data]').textContent);
  const byName = new Map(products.map((product) => [toPlain(product.name), product]));
  return {
    reviews,
    products,
    findProduct: (name) => (name ? byName.get(toPlain(name)) : undefined),
  };
}

/* "Escribir reseña" gleitet zum Formular */
function bindWriteLink(root, signal) {
  const link = root.querySelector('[data-review-write]');
  const target = root.querySelector('#escribir');
  const go = (event) => {
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  };
  link.addEventListener('click', go, { signal });
}

export function initReviewsPage(signal) {
  const root = document.querySelector('[data-reviews-page]');
  if (!root) return;
  const data = readData(root);
  initWall(root, data, signal);
  initReviewForm(root, data.products, signal);
  bindWriteLink(root, signal);
  setTimeout(() => root.classList.add('is-in'), 80);
}
