/* Anzeige des Fragebogens und der Pyramide links. */
import { QUIZ_TIERS, TIER_OF_FAMILY } from '../../../data/quiz.js';
import { SCENT_FAMILIES } from '../../../data/scent.js';

const HINTS = Object.fromEntries(SCENT_FAMILIES.map((family) => [family.name, family.hint]));

function mark(root, selector, isOn) {
  root.querySelectorAll(selector).forEach((element) => {
    const attribute = element.hasAttribute('aria-pressed') ? 'aria-pressed' : 'aria-checked';
    element.setAttribute(attribute, String(isOn(element)));
  });
}

function renderChoices(root, state) {
  mark(root, '[data-quiz-gender]', (el) => el.dataset.quizGender === state.gender);
  mark(root, '[data-quiz-family]', (el) => state.families.includes(el.dataset.quizFamily));
  mark(root, '[data-quiz-moment]', (el) => Number(el.dataset.quizMoment) === state.moment);
  mark(root, '[data-quiz-intensity]', (el) => Number(el.dataset.quizIntensity) === state.intensity);
  root.querySelector('[data-quiz-family-count]').textContent = state.families.length;
}

function renderTier(root, state, index) {
  const families = state.families.filter((family) => TIER_OF_FAMILY[family] === index);
  const filled = families.length > 0;
  root.querySelector(`[data-tier-shape="${index}"]`).classList.toggle('is-filled', filled);
  const text = root.querySelector(`[data-tier-notes="${index}"]`);
  text.textContent = filled ? families.map((family) => HINTS[family]).join(' · ') : '—';
  text.classList.toggle('is-filled', filled);
}

function renderPyramid(root, state) {
  QUIZ_TIERS.forEach((tier, index) => renderTier(root, state, index));
  const done = [state.gender, state.families.length || null, state.moment, state.intensity];
  root.querySelector('[data-quiz-done]').textContent = done.filter(
    (value) => value !== null,
  ).length;
}

function renderSubmit(root, state) {
  const ready = state.gender !== null && state.families.length > 0;
  root.querySelector('[data-quiz-submit]').disabled = !ready || state.busy;
  root.querySelector('[data-quiz-submit-text]').textContent = state.busy
    ? 'Buscando tu fragancia…'
    : 'Ver mi fragancia';
  root.querySelector('[data-quiz-hint]').textContent = ready
    ? 'Te mostramos las tres fragancias que mejor encajan.'
    : 'Responde al menos las preguntas 01 y 02.';
}

export function renderQuiz(root, state) {
  renderChoices(root, state);
  renderPyramid(root, state);
  renderSubmit(root, state);
}
