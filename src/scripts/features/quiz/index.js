/* Seite "Test Olfativo": Antworten sammeln, Pyramide füllen, Empfehlung zeigen. */
import { MAX_FAMILIES } from '../../../data/quiz.js';
import { initMarquee } from '../../effects/marquee.js';
import { recommend } from './match.js';
import { hideResult, showResult } from './result.js';
import { renderQuiz } from './view.js';

function toggleFamily(families, family) {
  if (families.includes(family)) return families.filter((item) => item !== family);
  const kept = families.length >= MAX_FAMILIES ? families.slice(1) : families;
  return [...kept, family];
}

/* Klickziele und welche Antwort sie setzen */
const CHOICES = [
  ['[data-quiz-gender]', (state, el) => (state.gender = el.dataset.quizGender)],
  [
    '[data-quiz-family]',
    (state, el) => (state.families = toggleFamily(state.families, el.dataset.quizFamily)),
  ],
  ['[data-quiz-moment]', (state, el) => (state.moment = Number(el.dataset.quizMoment))],
  ['[data-quiz-intensity]', (state, el) => (state.intensity = Number(el.dataset.quizIntensity))],
];

function choose(quiz, event) {
  for (const [selector, apply] of CHOICES) {
    const element = event.target.closest(selector);
    if (element) {
      apply(quiz.state, element);
      return renderQuiz(quiz.root, quiz.state);
    }
  }
  return undefined;
}

function submit(quiz, event) {
  event.preventDefault();
  quiz.state.busy = true;
  renderQuiz(quiz.root, quiz.state);
  setTimeout(() => {
    quiz.state.busy = false;
    renderQuiz(quiz.root, quiz.state);
    showResult(quiz.root, quiz.state, recommend(quiz.products, quiz.state));
    scrollTo({ top: 0, behavior: 'smooth' });
  }, 500);
}

function reset(quiz) {
  hideResult(quiz.root);
  scrollTo({ top: 0, behavior: 'smooth' });
}

function createQuiz(root) {
  const products = JSON.parse(root.querySelector('[data-quiz-data]').textContent);
  const state = { gender: null, families: [], moment: null, intensity: null, busy: false };
  return { root, products, state };
}

function bindQuiz(quiz, signal) {
  const form = quiz.root.querySelector('[data-quiz-form]');
  form.addEventListener('click', (event) => choose(quiz, event), { signal });
  form.addEventListener('submit', (event) => submit(quiz, event), { signal });
  quiz.root
    .querySelector('[data-quiz-reset]')
    .addEventListener('click', () => reset(quiz), { signal });
}

export function initQuizPage(signal) {
  const root = document.querySelector('[data-quiz-page]');
  if (!root) return;
  const quiz = createQuiz(root);
  bindQuiz(quiz, signal);
  initMarquee(root, signal);
  renderQuiz(root, quiz.state);
  setTimeout(() => root.classList.add('is-in'), 80);
}
