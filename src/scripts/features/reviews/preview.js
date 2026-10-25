/* Live-Vorschau der Bewertung: Sterne, Text, Fragancia und Person, so wie sie gerade im Formular stehen. */
import { RATING_LABELS } from '../../../data/reviews.js';
import { initialOf } from '../../utils/text.js';

const EMPTY_TEXT = '“Tu reseña aparecerá aquí mientras escribes…”';

function setText(preview, selector, text, empty) {
  const element = preview.querySelector(selector);
  element.textContent = text || empty;
  element.classList.toggle('is-empty', !text);
}

function paintStars(preview, shown) {
  preview.querySelectorAll('[data-preview-star]').forEach((star, index) => {
    star.classList.toggle('is-on', index < shown);
  });
  preview.querySelector('[data-preview-rate]').textContent = shown ? RATING_LABELS[shown] : 'SC';
  preview.style.setProperty('--tilt', `${shown ? (shown - 3) * 0.6 : 0}deg`);
}

function paintProduct(preview, product) {
  const image = preview.querySelector('[data-preview-image]');
  image.hidden = !product;
  if (product) image.src = product.image;
  preview.querySelector('[data-preview-product]').classList.toggle('is-empty', !product);
  preview.querySelector('[data-preview-product-name]').textContent =
    product?.name ?? 'Elige tu fragancia';
}

/** draft: { shown (Sterne inkl. Hover), text, name, city, product } */
export function paintPreview(preview, draft) {
  paintStars(preview, draft.shown);
  setText(preview, '[data-preview-text]', draft.text && `“${draft.text}”`, EMPTY_TEXT);
  setText(preview, '[data-preview-name]', draft.name, 'Tu nombre');
  preview.querySelector('[data-preview-city]').textContent = draft.city || 'Tu ciudad';
  preview.querySelector('[data-preview-ini]').textContent = draft.name
    ? initialOf(draft.name)
    : '?';
  paintProduct(preview, draft.product);
}

/** Kurzes Anheben der Karte bei jeder Änderung */
export function bump(preview) {
  preview.style.setProperty('--bump', '1.015');
  clearTimeout(preview.bumpTimer);
  preview.bumpTimer = setTimeout(() => preview.style.removeProperty('--bump'), 140);
}
