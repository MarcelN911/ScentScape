/* Formular "Escribe tu reseña": Eingaben lesen, Vorschau zeigen, an nexomar schicken. */
import { RATING_LABELS, REVIEW_LIMITS, REVIEW_MISSING } from '../../../data/reviews.js';
import { ENDPOINTS, postJson } from '../../api/client.js';
import { SHOP_ID } from '../../config.js';
import { showToast } from '../../core/events.js';
import { toPlain } from '../../utils/text.js';
import { createCombo, showPicked } from './combo.js';
import { bump, paintPreview } from './preview.js';

function readDraft(form) {
  const value = (name) => form.form.elements[name].value.trim();
  return {
    name: value('name'),
    city: value('city'),
    phone: value('phone'),
    text: value('text'),
    rating: form.rating,
    product: form.product,
  };
}

function missingOf(draft) {
  if (!draft.rating) return REVIEW_MISSING.rating;
  if (!draft.name) return REVIEW_MISSING.name;
  if (!draft.phone) return REVIEW_MISSING.phone;
  return draft.text.length < REVIEW_LIMITS.minText ? REVIEW_MISSING.text : null;
}

function paintStars(form) {
  const shown = form.hover || form.rating;
  form.root.querySelectorAll('[data-star]').forEach((star) => {
    const value = Number(star.dataset.star);
    star.classList.toggle('is-on', value <= shown);
    star.classList.toggle('is-top', value === shown);
    star.setAttribute('aria-checked', String(value === form.rating));
  });
  form.root.querySelector('[data-star-label]').textContent = RATING_LABELS[shown];
}

function render(form) {
  const draft = readDraft(form);
  const missing = missingOf(draft);
  paintStars(form);
  paintPreview(form.preview, { ...draft, shown: form.hover || form.rating });
  const count = form.root.querySelector('[data-review-count]');
  count.textContent = `${draft.text.length} / ${REVIEW_LIMITS.text}`;
  count.classList.toggle('is-near', draft.text.length > REVIEW_LIMITS.text - 20);
  form.root.querySelector('[data-review-submit]').disabled = Boolean(missing) || form.sending;
  form.root.querySelector('[data-review-hint]').textContent = missing ?? REVIEW_MISSING.ready;
}

function payload(draft) {
  return {
    shopId: SHOP_ID,
    nombre: draft.name,
    ciudad: draft.city,
    telefono: draft.phone,
    calificacion: draft.rating,
    producto: draft.product?.name ?? null,
    texto: draft.text,
  };
}

function setSending(form, sending) {
  form.sending = sending;
  form.root.querySelector('[data-review-submit-label]').textContent = sending
    ? 'Enviando…'
    : 'Publicar reseña';
  render(form);
}

function showSent(form, name) {
  form.form.hidden = true;
  form.root.querySelector('[data-review-thanks]').hidden = false;
  form.root.querySelector('[data-review-thanks-name]').textContent = name.split(' ')[0];
  form.root.classList.add('is-sent');
  form.root.querySelector('[data-preview-label]').textContent = 'Reseña enviada';
  showToast('Reseña enviada · gracias');
}

function postReview(draft) {
  return postJson(ENDPOINTS.review, payload(draft)).catch(() => ({ ok: false, data: {} }));
}

async function send(form, event) {
  event.preventDefault();
  const draft = readDraft(form);
  if (missingOf(draft) || form.sending) return;
  setSending(form, true);
  const result = await postReview(draft);
  setSending(form, false);
  if (result.ok) showSent(form, draft.name);
  else
    form.root.querySelector('[data-review-hint]').textContent =
      result.data.error || REVIEW_MISSING.send;
}

function writeAgain(form) {
  form.form.reset();
  Object.assign(form, { rating: 0, hover: 0, product: null });
  showPicked(form.combo, '');
  form.form.hidden = false;
  form.root.querySelector('[data-review-thanks]').hidden = true;
  form.root.classList.remove('is-sent');
  form.root.querySelector('[data-preview-label]').textContent = 'Vista previa en vivo';
  render(form);
}

function searchProducts(products, text) {
  if (!text) return [];
  const query = toPlain(text);
  return products
    .filter((product) => toPlain(`${product.name} ${product.brand}`).includes(query))
    .slice(0, 6)
    .map((product) => ({
      title: product.name,
      meta: product.brand,
      image: product.image,
      value: product,
    }));
}

function bindProduct(form, products, signal) {
  const setProduct = (product) => {
    form.product = product;
    render(form);
  };
  const handlers = {
    search: (text) => searchProducts(products, text),
    pick: (option) => setProduct(option.value),
    change: () => setProduct(null),
  };
  const root = form.root.querySelector('[data-combo="review-product"]');
  form.combo = createCombo(root, handlers, signal, true);
}

function onStar(form, event, hover) {
  const star = event.target.closest('[data-star]');
  if (hover) form.hover = star ? Number(star.dataset.star) : 0;
  else if (star) {
    form.rating = Number(star.dataset.star);
    bump(form.preview);
  }
  paintStars(form);
  paintPreview(form.preview, { ...readDraft(form), shown: form.hover || form.rating });
}

function bindStars(form, signal) {
  const picker = form.root.querySelector('[data-star-picker]');
  picker.addEventListener('click', (event) => onStar(form, event, false), { signal });
  picker.addEventListener('mouseover', (event) => onStar(form, event, true), { signal });
  picker.addEventListener('mouseleave', (event) => onStar(form, event, true), { signal });
}

function onInput(form, event) {
  if (event.target.closest('[data-combo]')) return;
  bump(form.preview);
  render(form);
}

function bindFields(form, signal) {
  form.form.addEventListener('input', (event) => onInput(form, event), { signal });
  form.form.addEventListener('submit', (event) => send(form, event), { signal });
  form.root
    .querySelector('[data-review-again]')
    .addEventListener('click', () => writeAgain(form), { signal });
}

/** Vorausgewählte Fragancia aus dem Link (?id=… von der Produktseite) */
function preselect(form, products) {
  const id = new URLSearchParams(window.location.search).get('id');
  const product = products.find((item) => item.id === id);
  if (!product) return;
  form.product = product;
  showPicked(form.combo, product.name);
}

export function initReviewForm(root, products, signal) {
  const form = { root, rating: 0, hover: 0, product: null, sending: false };
  form.form = root.querySelector('[data-review-form]');
  form.preview = root.querySelector('[data-preview]');
  bindStars(form, signal);
  bindProduct(form, products, signal);
  bindFields(form, signal);
  preselect(form, products);
  render(form);
}
