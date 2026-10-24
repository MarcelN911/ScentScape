/*
 * Test olfativo als Fenster über jeder Seite. Öffnet mit data-action="open-quiz"
 * oder über einen Link auf "#test". Die Parfumliste wird erst beim ersten Öffnen geladen.
 */
import { registerAction } from '../../core/actions.js';
import { matchProduct } from './match.js';
import { renderAnswers, renderResult } from './view.js';

const quiz = {
  root: null,
  products: null,
  answers: { who: null, when: null, vibe: null },
  alternative: 0,
};

async function loadProducts() {
  quiz.products ??= await fetch('/data/quiz.json').then((response) => response.json());
}

function render() {
  renderAnswers(quiz.root, quiz.answers);
  if (!quiz.products?.length) return;
  renderResult(
    quiz.root,
    matchProduct(quiz.products, quiz.answers, quiz.alternative),
    quiz.answers,
  );
}

async function openQuiz() {
  quiz.root.hidden = false;
  document.documentElement.classList.add('is-locked');
  quiz.root.querySelector('.quiz__close').focus();
  await loadProducts();
  render();
}

function closeQuiz() {
  quiz.root.hidden = true;
  document.documentElement.classList.remove('is-locked');
}

function choose(option) {
  const { quizKey: key, quizValue: value } = option.dataset;
  quiz.answers[key] = quiz.answers[key] === value ? null : value;
  quiz.alternative = 0;
  render();
}

function handleClick(event) {
  const option = event.target.closest('[data-quiz-key]');
  if (option) return choose(option);
  if (event.target.closest('[data-quiz-next]')) {
    quiz.alternative += 1;
    return render();
  }
  if (event.target.closest('[data-quiz-close], [data-quiz-link]')) closeQuiz();
  return undefined;
}

export function initQuiz() {
  quiz.root = document.querySelector('[data-quiz]');
  if (!quiz.root) return;
  quiz.root.addEventListener('click', handleClick);
  document.addEventListener('keydown', (event) => event.key === 'Escape' && closeQuiz());
  registerAction('open-quiz', openQuiz);
  if (location.hash === '#test') openQuiz();
}
