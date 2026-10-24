/* Alle Bedienelemente der Seite "Productos" → Änderungen am Zustand. */
import { turnTo } from './wheel.js';

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
  ['[data-gender-tab]', (shop, el) => shop.update({ gender: el.dataset.genderTab })],
  [
    '[data-density]',
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

export function bindControls(shop, signal) {
  const { root } = shop;
  root.addEventListener('click', (event) => handleClick(shop, event), { signal });
  const search = root.querySelector('[data-shop-search]');
  search.value = shop.state.query;
  search.addEventListener('input', () => shop.update({ query: search.value }), { signal });
  root
    .querySelector('[data-shop-sort]')
    .addEventListener('change', (event) => shop.update({ sort: event.target.value }), { signal });
}
