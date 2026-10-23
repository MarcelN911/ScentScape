/* Verbindet Tabs, Suche, Sortierung, Ansicht und Noten-Band mit dem Filterzustand. */
import { toPlain } from '../../utils/text.js';
import { DEFAULT_FILTERS } from './state.js';

function markActive(root, selector, attribute, value) {
  root.querySelectorAll(selector).forEach((element) => {
    element.classList.toggle('is-active', element.getAttribute(attribute) === value);
  });
}

export function renderControls(root, state) {
  markActive(root, '[data-filter-family]', 'data-filter-family', state.family);
  markActive(root, '[data-filter-gender]', 'data-filter-gender', state.gender);
  markActive(root, '[data-shop-view]', 'data-shop-view', state.view);
  root.querySelectorAll('[data-ribbon-note]').forEach((note) => {
    note.classList.toggle('is-active', toPlain(note.dataset.ribbonNote) === toPlain(state.query));
  });
  root.querySelector('[data-shop-search]').value = state.query;
  root.querySelector('[data-shop-search-clear]').hidden = !state.query;
  root.querySelector('[data-shop-sort]').value = state.sort;
}

function onEach(root, selector, handler, signal) {
  root.querySelectorAll(selector).forEach((element) => {
    element.addEventListener('click', () => handler(element), { signal });
  });
}

const BUTTON_FILTERS = [
  ['[data-filter-family]', (tab) => ({ family: tab.dataset.filterFamily })],
  ['[data-filter-gender]', (tab) => ({ gender: tab.dataset.filterGender })],
  ['[data-shop-view]', (button) => ({ view: button.dataset.shopView })],
  ['[data-shop-clear]', () => ({ ...DEFAULT_FILTERS })],
];

function bindButtons(root, update, signal) {
  BUTTON_FILTERS.forEach(([selector, changesFor]) => {
    onEach(root, selector, (element) => update(changesFor(element)), signal);
  });
}

function ribbonQuery(note, state) {
  const isActive = toPlain(note.dataset.ribbonNote) === toPlain(state.query);
  return isActive ? '' : note.dataset.ribbonNote;
}

function bindRibbon(root, state, update, signal) {
  onEach(root, '[data-ribbon-note]', (note) => update({ query: ribbonQuery(note, state) }), signal);
}

function bindFields(root, update, signal) {
  const search = root.querySelector('[data-shop-search]');
  search.addEventListener('input', () => update({ query: search.value }), { signal });
  root
    .querySelector('[data-shop-search-clear]')
    .addEventListener('click', () => update({ query: '' }), { signal });
  const sort = root.querySelector('[data-shop-sort]');
  sort.addEventListener('change', () => update({ sort: sort.value }), { signal });
}

export function bindControls(root, state, update, signal) {
  bindButtons(root, update, signal);
  bindRibbon(root, state, update, signal);
  bindFields(root, update, signal);
}
