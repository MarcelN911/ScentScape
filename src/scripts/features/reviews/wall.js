/* Bewertungswand: Karten fürs Karussell bauen, nach Sternen oder Fragancia filtern. */
import { CAROUSEL, REVIEW_CARD_COLORS } from '../../../data/reviews.js';
import { formatMonth, formatRating } from '../../utils/format.js';
import { initialOf } from '../../utils/text.js';
import { createCarousel } from './carousel.js';
import { createCombo } from './combo.js';
import { averageOf, filterReviews, plural, productsWithReviews } from './data.js';

function fillSlide(slide, review, product) {
  const stars = Math.max(0, Math.min(5, Math.round(review.rating)));
  slide.querySelector('[data-slide-on]').textContent = '★'.repeat(stars);
  slide.querySelector('[data-slide-off]').textContent = '★'.repeat(5 - stars);
  slide.querySelector('[data-slide-date]').textContent = formatMonth(review.date);
  slide.querySelector('[data-slide-text]').textContent = `“${review.text}”`;
  slide.querySelector('[data-slide-ini]').textContent = initialOf(review.name);
  slide.querySelector('[data-slide-name]').textContent = review.name || 'Cliente';
  slide.querySelector('[data-slide-city]').textContent = review.city;
  const link = slide.querySelector('[data-slide-product]');
  link.hidden = !review.product;
  link.textContent = `${review.product} →`;
  if (product) link.href = product.href;
}

function buildSlide(wall, review, index) {
  const slide = wall.template.content.firstElementChild.cloneNode(true);
  slide.style.setProperty('--bg', REVIEW_CARD_COLORS[index % REVIEW_CARD_COLORS.length]);
  fillSlide(slide, review, wall.findProduct(review.product));
  return slide;
}

function resultText(wall, count) {
  const { stars, product, query } = wall.filter;
  return stars || product || query ? plural(count, 'resultado', 'resultados') : '';
}

function renderStatus(wall, shown, cards) {
  const { root, filter } = wall;
  root.querySelector('[data-carousel-total]').textContent = String(cards).padStart(2, '0');
  root.querySelector('[data-carousel-controls]').hidden = !cards;
  root.querySelector('[data-review-empty]').hidden = cards > 0;
  root.querySelector('[data-review-result]').textContent = resultText(wall, shown);
  root.querySelectorAll('[data-review-stars]').forEach((row) => {
    row.setAttribute('aria-pressed', String(Number(row.dataset.reviewStars) === filter.stars));
  });
}

function render(wall) {
  const shown = filterReviews(wall.reviews, wall.filter);
  const cards = shown.slice(0, CAROUSEL.maxCards);
  wall.track.replaceChildren(...cards.map((review, index) => buildSlide(wall, review, index)));
  wall.spin.pos = 0;
  renderStatus(wall, shown.length, cards.length);
}

function setFilter(wall, patch) {
  Object.assign(wall.filter, patch);
  render(wall);
}

function searchOptions(wall, text) {
  return productsWithReviews(wall.reviews, text).map(([name, count]) => {
    const average = averageOf(wall.reviews.filter((review) => review.product === name));
    const image = wall.findProduct(name)?.image ?? '/assets/img/scentscape-logo.png';
    return {
      title: name,
      meta: `★ ${formatRating(average)} · ${plural(count, 'reseña', 'reseñas')}`,
      image,
      value: name,
    };
  });
}

function bindSearch(wall, signal) {
  const handlers = {
    search: (text) => searchOptions(wall, text),
    pick: (option) =>
      Object.assign(wall.filter, { product: option.value, query: '' }) && render(wall),
    change: (text) => Object.assign(wall.filter, { product: '', query: text }) && render(wall),
  };
  createCombo(wall.root.querySelector('[data-combo="review-search"]'), handlers, signal);
}

function toggleStars(wall, event) {
  const row = event.target.closest('[data-review-stars]');
  if (!row) return;
  const stars = Number(row.dataset.reviewStars);
  setFilter(wall, { stars: wall.filter.stars === stars ? 0 : stars });
}

/** data: { reviews, findProduct(name) } */
export function initWall(root, data, signal) {
  const wall = { root, ...data, filter: { stars: 0, product: '', query: '' } };
  wall.track = root.querySelector('[data-carousel-track]');
  wall.template = root.querySelector('[data-review-slide]');
  wall.spin = createCarousel(root, signal);
  bindSearch(wall, signal);
  root.addEventListener('click', (event) => toggleStars(wall, event), { signal });
  render(wall);
}
