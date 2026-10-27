/* Zeigt das Ergebnis: Reihenfolge, Nummern, "Ver más", leerer Zustand. */
import { padNumber } from '../../utils/format.js';
import { isLeaving, leave, settle, slide } from './motion.js';
import { delayFor, restartReveal } from './reveal.js';

function columns(state) {
  if (innerWidth < 640) return 2;
  if (innerWidth < 1080 || state.density === 1) return 3;
  return state.density;
}

const ITEM = ':scope > [data-shop-card], :scope > [data-index-row]';
const idOf = (element) => element.dataset.shopCard ?? element.dataset.indexRow;

/** Zeigt, versteckt oder (bei der Suche) blendet ein Element weich aus. */
function updateVisibility(element, show, before) {
  const old = before?.rects.get(idOf(element));
  if (show) {
    if (isLeaving(element)) settle(element);
    element.hidden = false;
  } else if (old && element.classList.contains('is-visible')) {
    leave(element, old, before.box);
  } else if (!isLeaving(element)) {
    element.hidden = true;
  }
}

/** Zeigt nur die gefundenen Elemente. Gibt alle Elemente nach id zurück. */
function hideOthers(container, items, before) {
  const ids = new Set(items.map((entry) => entry.id));
  const byId = new Map();
  container.querySelectorAll(ITEM).forEach((element) => {
    byId.set(idOf(element), element);
    updateVisibility(element, ids.has(idOf(element)), before);
  });
  return byId;
}

function placeItems(container, items, { state, isRow, before }) {
  const cols = columns(state);
  const byId = hideOthers(container, items, before);
  return items.map((entry, index) => {
    const element = byId.get(entry.id);
    element.style.setProperty('--delay', `${delayFor(index, cols, isRow)}ms`);
    element.querySelector('[data-card-number], [data-row-number]').textContent = padNumber(
      index + 1,
    );
    container.append(element);
    return element;
  });
}

/** Merkt sich vor dem Umbau, wo das Raster und jede sichtbare Karte steht. */
function measure(container) {
  const rects = new Map();
  container.querySelectorAll(ITEM).forEach((element) => {
    if (!element.hidden && !isLeaving(element)) {
      rects.set(idOf(element), element.getBoundingClientRect());
    }
  });
  return { box: container.getBoundingClientRect(), rects };
}

function renderMore(root, list, state) {
  const shown = Math.min(state.shown, list.length);
  root.querySelector('[data-more]').hidden = list.length <= state.shown;
  root.querySelector('[data-more-text]').textContent = `${shown} de ${list.length}`;
  root.querySelector('[data-more-bar]').style.width =
    `${(shown / Math.max(1, list.length)) * 100}%`;
}

/**
 * keepCards = true (Suche, "Ver más", Fenstergröße): Karten, die schon da waren, bleiben stehen
 * und gleiten höchstens an ihren neuen Platz; nur neu dazugekommene rutschen von unten herein.
 * keepCards = false (andere Filter): alle Karten blenden von vorn ein.
 */
export function renderResults(root, result, state, { indexMode, keepCards }) {
  const results = root.querySelector('[data-results]');
  const mode = indexMode ? 'index' : 'grid';
  const modeChanged = results.dataset.mode !== mode;
  results.dataset.mode = mode;
  results.dataset.density = state.density;
  root.querySelector('[data-shop-empty]').hidden = result.list.length > 0;
  const container = root.querySelector(indexMode ? '[data-rows]' : '[data-cards]');
  const before = keepCards && !modeChanged ? measure(container) : null;
  const items = result.list.slice(0, state.shown);
  const elements = placeItems(container, items, { state, isRow: indexMode, before });
  revealItems(elements, before);
  renderMore(root, result.list, state);
}

/** Ohne "before": alle blenden neu ein. Mit: nur neue, die anderen gleiten an ihren Platz. */
function revealItems(elements, before) {
  if (!before) return restartReveal(elements);
  elements.forEach((element) => {
    const old = before.rects.get(idOf(element));
    if (!old) restartReveal([element]);
    else if (element.classList.contains('is-visible')) slide(element, old);
  });
}
