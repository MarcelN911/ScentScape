/* Zeigt Antworten und Ergebnis im Test olfativo. */
import { capitalize } from '../../utils/text.js';
import { reasonOf } from './match.js';

export function renderAnswers(root, answers) {
  root.querySelectorAll('[data-quiz-key]').forEach((option) => {
    const chosen = answers[option.dataset.quizKey] === option.dataset.quizValue;
    option.setAttribute('aria-pressed', String(chosen));
  });
  const done = Object.values(answers).filter(Boolean).length;
  root.querySelector('[data-quiz-done]').textContent = String(done);
}

function tierText(notes) {
  return (notes ?? []).slice(0, 3).map(capitalize).join(' · ');
}

function replayPop(card) {
  card.classList.remove('is-changing');
  void card.offsetWidth;
  card.classList.add('is-changing');
}

function renderText(root, product, answers) {
  root.querySelector('[data-quiz-meta]').textContent = [product.genderLabel, product.family]
    .filter(Boolean)
    .join(' · ');
  root.querySelector('[data-quiz-name]').textContent = product.name;
  root.querySelector('[data-quiz-why]').textContent = reasonOf(answers);
  root.querySelector('[data-quiz-pyramid]').hidden = !product.notes;
  root.querySelectorAll('[data-quiz-tier]').forEach((tier, index) => {
    tier.textContent = tierText(product.notes?.[index]);
  });
}

function renderLinks(root, product) {
  root.querySelector('[data-quiz-link]').href = `/producto/${product.slug}/`;
  root.querySelector('[data-quiz-price]').textContent = product.price;
  root.querySelector('[data-quiz-add]').dataset.cartItem = JSON.stringify(product.cartItem);
}

export function renderResult(root, product, answers) {
  const card = root.querySelector('[data-quiz-result]');
  const image = root.querySelector('[data-quiz-image]');
  card.style.setProperty('--quiz-accent', `${product.accent}66`);
  Object.assign(image, { src: product.image, alt: product.name });
  renderText(root, product, answers);
  renderLinks(root, product);
  replayPop(card);
}
