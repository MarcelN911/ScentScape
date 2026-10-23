/* Bewertung schreiben: Formular prüfen und an nexomar schicken. */
import { REVIEW_ERRORS } from '../../../data/reviews.js';
import { ENDPOINTS, postJson } from '../../api/client.js';
import { SHOP_ID } from '../../config.js';
import { toPlain } from '../../utils/text.js';
import { bindStars, resetStars } from './stars.js';

/** Gibt den genauen Produktnamen aus der Liste zurück (oder null, wenn er nicht passt). */
function knownProduct(form, typed) {
  const options = [...form.querySelectorAll('#review-products option')];
  return options.find((option) => toPlain(option.value) === toPlain(typed))?.value ?? null;
}

function readReview(form) {
  const value = (name) => form.elements[name].value.trim();
  return {
    shopId: SHOP_ID,
    nombre: value('name'),
    telefono: value('phone'),
    calificacion: Number(value('rating')),
    producto: knownProduct(form, value('product')),
    texto: value('text'),
  };
}

function problemWith(review) {
  if (!review.calificacion) return REVIEW_ERRORS.rating;
  if (!review.texto) return REVIEW_ERRORS.text;
  if (!review.nombre) return REVIEW_ERRORS.name;
  if (!review.telefono) return REVIEW_ERRORS.phone;
  return null;
}

function showError(box, message) {
  const error = box.querySelector('[data-review-error]');
  error.hidden = !message;
  error.textContent = message ?? '';
}

function showThanks(box, name, done) {
  box.querySelector('[data-review-form]').hidden = done;
  box.querySelector('[data-review-thanks]').hidden = !done;
  box.querySelector('[data-review-thanks-name]').textContent = name;
}

async function send(box, review) {
  const button = box.querySelector('[data-review-submit]');
  button.disabled = true;
  const result = await postJson(ENDPOINTS.review, review).catch(() => ({ ok: false, data: {} }));
  button.disabled = false;
  if (!result.ok) return showError(box, result.data.error || REVIEW_ERRORS.send);
  const form = box.querySelector('[data-review-form]');
  form.reset();
  resetStars(box.querySelector('[data-star-picker]'));
  return showThanks(box, review.nombre, true);
}

function onSubmit(box, event) {
  event.preventDefault();
  const review = readReview(event.target);
  const problem = problemWith(review);
  showError(box, problem);
  if (!problem) send(box, review);
}

function preselectProduct(form) {
  const wanted = new URLSearchParams(location.search).get('producto');
  if (wanted) form.elements.product.value = knownProduct(form, wanted) ?? '';
}

function bindCounter(form, box, signal) {
  const count = box.querySelector('[data-review-count]');
  const update = () => (count.textContent = form.elements.text.value.length);
  form.elements.text.addEventListener('input', update, { signal });
}

export function initReviewForm(signal) {
  const box = document.querySelector('[data-review-box]');
  if (!box) return;
  const form = box.querySelector('[data-review-form]');
  bindStars(box.querySelector('[data-star-picker]'), signal);
  bindCounter(form, box, signal);
  form.addEventListener('submit', (event) => onSubmit(box, event), { signal });
  const again = () => showThanks(box, '', false);
  box.querySelector('[data-review-again]').addEventListener('click', again, { signal });
  preselectProduct(form);
}
