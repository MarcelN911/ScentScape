/* Rechte Seite des Panels: Titel, Hinweis, Noten der Familie, Reiter, Ansicht, aktive Filter. */
import { scentColor } from '../../../data/scent.js';
import { countWith } from './filter.js';
import { renderSort } from './sort.js';

const HINT_ALL = 'Gira la rueda y elige una familia olfativa. Después puedes afinar con sus notas.';
const hintFor = (family) =>
  `Afina con las notas de ${family} o explora la familia completa. Toca de nuevo la familia para quitarla.`;

function renderTitle(root, state) {
  const title = root.querySelector('[data-profile-title]');
  title.textContent = state.family ?? 'Todas las familias';
  title.parentElement.classList.toggle('is-family', Boolean(state.family));
  root.querySelector('[data-profile-hint]').textContent = state.family
    ? hintFor(state.family)
    : HINT_ALL;
  const glow = state.family ? `${scentColor(state.family)}30` : 'rgb(83 16 25 / .35)';
  root.style.setProperty('--shop-glow', glow);
}

function paintNoteChip(chip, state, familyBase) {
  const note = chip.dataset.toggleNote;
  const count = countWith(familyBase, (entry) => entry.ingredients.includes(note));
  chip.hidden = chip.dataset.noteFamily !== state.family;
  chip.setAttribute('aria-pressed', String(state.notes.has(note)));
  chip.classList.toggle('is-empty', count === 0);
  chip.querySelector('[data-chip-sub]').textContent =
    `${count} ${count === 1 ? 'perfume' : 'perfumes'}`;
}

function renderNotes(root, state, familyBase) {
  const area = root.querySelector('[data-notes-area]');
  area.classList.toggle('has-family', Boolean(state.family));
  area.querySelector('[data-family-name]').textContent = state.family ?? '';
  area.querySelector('[data-notes-all]').setAttribute('aria-pressed', String(!state.notes.size));
  area
    .querySelectorAll('[data-toggle-note]')
    .forEach((chip) => paintNoteChip(chip, state, familyBase));
}

function renderToggles(root, state) {
  /* Für-wen-Reiter gibt es zweimal (Filterbereich und Handy-Leiste), Position je Gruppe zählen */
  root.querySelectorAll('[data-gender-tab]').forEach((tab) => {
    const on = tab.dataset.genderTab === state.gender;
    tab.setAttribute('aria-checked', String(on));
    const index = [...tab.parentElement.querySelectorAll('[data-gender-tab]')].indexOf(tab);
    if (on) tab.parentElement.style.setProperty('--tab', index);
  });
  root.querySelectorAll('button[data-density]').forEach((button) => {
    button.setAttribute('aria-pressed', String(Number(button.dataset.density) === state.density));
  });
  renderSort(root, state.sort);
}

function renderLetters(root, result) {
  root.querySelectorAll('[data-letter]').forEach((button) => {
    const letter = button.dataset.letter || null;
    button.disabled = Boolean(letter) && !result.letters.has(letter);
    button.setAttribute('aria-pressed', String(letter === result.letter));
  });
}

export function renderProfile(root, state, result) {
  renderTitle(root, state);
  renderNotes(root, state, result.familyBase);
  renderToggles(root, state);
  renderLetters(root, result);
}
