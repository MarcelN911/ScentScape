/* Alle Bedienelemente der Seite "Productos" → Änderungen am Zustand. */
import { turnTo } from './wheel.js';
import { bindSort, closeSort } from './sort.js';

/** Familie wählen; noch einmal tippen nimmt sie wieder weg. */
export function pickFamily(shop, family, index) {
  if (shop.state.family === family) return shop.update({ family: null, notes: new Set() });
  shop.update({ family, notes: new Set(), wheel: turnTo(shop.state.wheel, index) });
}

function toggleNote(shop, note) {
  const notes = new Set(shop.state.notes);
  if (notes.has(note)) notes.delete(note);
  else notes.add(note);
  shop.update({ notes });
}

/* Klickziele und was sie tun. Reihenfolge zählt: das erste passende gewinnt. */
const CLICKS = [
  [
    '[data-wheel-family]',
    (shop, el) => pickFamily(shop, el.dataset.wheelFamily, Number(el.dataset.wheelIndex)),
  ],
  [
    '[data-pick-note]',
    (shop, el) => {
      const family = el.dataset.pickFamily;
      if (shop.state.family !== family) pickFamily(shop, family, shop.familyIndex(family));
      shop.update({ notes: new Set([el.dataset.pickNote]) });
    },
  ],
  ['[data-toggle-note]', (shop, el) => toggleNote(shop, el.dataset.toggleNote)],
  ['[data-notes-all]', (shop) => shop.update({ notes: new Set() })],
  ['[data-shop-clear-family]', (shop) => shop.update({ family: null, notes: new Set() })],
  [
    '[data-sort-option]',
    (shop, el) => {
      closeSort(shop.root);
      shop.update({ sort: el.dataset.sortOption });
    },
  ],
  ['[data-gender-tab]', (shop, el) => shop.update({ gender: el.dataset.genderTab })],
  [
    // Nur Buttons: auch das Ergebnis-Raster trägt data-density (für das CSS).
    'button[data-density]',
    (shop, el) => shop.update({ density: Number(el.dataset.density), letter: null }),
  ],
  ['[data-letter]', (shop, el) => shop.update({ letter: el.dataset.letter || null })],
  [
    '[data-shop-clear]',
    (shop) => shop.update({ gender: 'Todos', family: null, notes: new Set(), query: '' }),
  ],
  [
    '[data-more-button]',
    (shop) => shop.update({ shown: shop.state.shown + 24 }, { keepPage: true }),
  ],
];

function handleClick(shop, event) {
  for (const [selector, action] of CLICKS) {
    const element = event.target.closest(selector);
    if (element) return action(shop, element);
  }
  return undefined;
}

/* Suchfeld gibt es zweimal (Filterbereich und Handy-Leiste): beide zeigen denselben Text */
function bindSearch(shop, signal) {
  const fields = [...shop.root.querySelectorAll('[data-shop-search]')];
  fields.forEach((field) => {
    field.value = shop.state.query;
    const onInput = () => {
      fields.forEach((other) => other !== field && (other.value = field.value));
      shop.update({ query: field.value });
    };
    field.addEventListener('input', onInput, { signal });
  });
}

export function bindControls(shop, signal) {
  const { root } = shop;
  root.addEventListener('click', (event) => handleClick(shop, event), { signal });
  bindSearch(shop, signal);
  bindSort(root, signal);
}
