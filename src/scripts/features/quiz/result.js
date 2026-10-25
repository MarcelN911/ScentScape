/* Ergebnis: Karte links (mit Affinitätsring), Profil und drei Empfehlungen rechts. */
import { QUIZ_GENDERS, QUIZ_INTENSITIES, QUIZ_MOMENTS } from '../../../data/quiz.js';
import { scentColor } from '../../../data/scent.js';

const RING = 213.6;

function listText(items) {
  if (items.length < 2) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} y ${items.at(-1)}`;
}

function profileText(state) {
  const parts = [`Notas ${listText(state.families.map((family) => family.toLowerCase()))}`];
  if (state.moment !== null) parts.push(`, pensadas para ${QUIZ_MOMENTS[state.moment].when}`);
  if (state.intensity !== null)
    parts.push(`, con intensidad ${QUIZ_INTENSITIES[state.intensity].toLowerCase()}`);
  const gender = QUIZ_GENDERS.find((item) => item.gender === state.gender);
  if (gender)
    parts.push(
      `. Selección ${gender.gender === 'U' ? 'unisex' : `para ${gender.label.toLowerCase()}`}`,
    );
  return `${parts.join('')}.`;
}

function fillCard(root, top) {
  root.querySelector('[data-quiz-card-img]').src = top.image;
  root.querySelector('[data-quiz-card-name]').textContent = top.name;
  root.querySelector('[data-quiz-card-pct]').textContent = top.pct;
  const chips = top.families.map((family) => {
    const chip = document.createElement('span');
    chip.innerHTML = '<i></i>';
    chip.style.setProperty('--dot', scentColor(family));
    chip.append(family);
    return chip;
  });
  root.querySelector('[data-quiz-card-notes]').replaceChildren(...chips);
}

function recRow(template, rec) {
  const row = template.content.firstElementChild.cloneNode(true);
  row.href = rec.href;
  row.querySelector('img').src = rec.image;
  row.querySelector('.rec__name').textContent = rec.name;
  row.querySelector('.rec__sub').textContent = rec.families.join(' · ') || rec.label;
  row.querySelector('.rec__pct').textContent = `${rec.pct}%`;
  return row;
}

function fillPanel(root, state, recs) {
  const moment = QUIZ_MOMENTS[state.moment];
  root.querySelector('[data-quiz-profile-a]').textContent = state.families[0];
  root.querySelector('[data-quiz-profile-b]').textContent = moment
    ? moment.adjective
    : 'a tu medida';
  root.querySelector('[data-quiz-profile-text]').textContent = profileText(state);
  const template = root.querySelector('[data-quiz-rec]');
  root
    .querySelector('[data-quiz-recs]')
    .replaceChildren(...recs.map((rec) => recRow(template, rec)));
  root.querySelector('[data-quiz-top-link]').href = recs[0].href;
  root.querySelector('[data-quiz-top-name]').textContent = recs[0].name;
}

function setMode(root, showResult) {
  root.querySelector('[data-quiz-pyramid]').hidden = showResult;
  root.querySelector('[data-quiz-form]').hidden = showResult;
  root.querySelector('[data-quiz-card]').hidden = !showResult;
  root.querySelector('[data-quiz-result]').hidden = !showResult;
}

export function showResult(root, state, recs) {
  fillCard(root, recs[0]);
  fillPanel(root, state, recs);
  setMode(root, true);
  const card = root.querySelector('[data-quiz-card]');
  setTimeout(() => {
    card.classList.add('is-revealed');
    root.querySelector('[data-quiz-ring]').style.strokeDashoffset = String(
      RING * (1 - recs[0].pct / 100),
    );
  }, 80);
}

export function hideResult(root) {
  root.querySelector('[data-quiz-card]').classList.remove('is-revealed');
  root.querySelector('[data-quiz-ring]').style.strokeDashoffset = String(RING);
  setMode(root, false);
}
