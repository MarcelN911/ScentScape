/* Reihe "aktive Filter" mit ✕ zum Entfernen und "Limpiar". */
import { familyOfIngredient, scentColor } from '../../../data/scent.js';

function chipsFor(state) {
  const chips = [];
  if (state.gender !== 'Todos')
    chips.push({ label: state.gender, color: '#FFFCF2', remove: { gender: 'Todos' } });
  if (state.family)
    chips.push({ label: state.family, color: scentColor(state.family), remove: { family: null } });
  state.notes.forEach((note) => {
    chips.push({ label: note, color: scentColor(familyOfIngredient(note)), removeNote: note });
  });
  if (state.query)
    chips.push({ label: `“${state.query}”`, color: '#F0BE91', remove: { query: '' } });
  return chips;
}

function chipElement(chip, update) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'active__chip';
  button.innerHTML = `<span class="active__dot"></span><span></span> <span class="active__x">✕</span>`;
  button.style.setProperty('--dot', chip.color);
  button.children[1].textContent = chip.label;
  button.addEventListener('click', () => update(chip.remove ?? { removeNote: chip.removeNote }));
  return button;
}

export function renderActiveFilters(root, state, update) {
  const chips = chipsFor(state);
  root
    .querySelector('[data-active-list]')
    .replaceChildren(...chips.map((chip) => chipElement(chip, update)));
  root.querySelector('[data-active-none]').hidden = chips.length > 0;
  root.querySelectorAll('[data-shop-clear]').forEach((button) => {
    if (button.closest('[data-active-filters]')) button.hidden = chips.length === 0;
  });
}
