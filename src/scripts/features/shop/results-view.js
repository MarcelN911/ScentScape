/* Zeigt das Ergebnis: Reihenfolge, Nummern, "Ver más", leerer Zustand. */
import { padNumber } from '../../utils/format.js';
import { delayFor, restartReveal } from './reveal.js';

function columns(state) {
  if (innerWidth < 640) return 2;
  if (innerWidth < 1080 || state.density === 1) return 3;
  return state.density;
}

const ITEM = ':scope > [data-shop-card], :scope > [data-index-row]';
const idOf = (element) => element.dataset.shopCard ?? element.dataset.indexRow;

/** Blendet alle aus, die nicht angezeigt werden. Gibt die Elemente nach id zurück. */
function hideOthers(container, items) {
  const ids = new Set(items.map((entry) => entry.id));
  const byId = new Map();
  container.querySelectorAll(ITEM).forEach((element) => {
    element.hidden = !ids.has(idOf(element));
    byId.set(idOf(element), element);
  });
  return byId;
}

function placeItems(container, items, state, isRow) {
  const cols = columns(state);
  const byId = hideOthers(container, items);
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

function renderMore(root, list, state) {
  const shown = Math.min(state.shown, list.length);
  root.querySelector('[data-more]').hidden = list.length <= state.shown;
  root.querySelector('[data-more-text]').textContent = `${shown} de ${list.length}`;
  root.querySelector('[data-more-bar]').style.width =
    `${(shown / Math.max(1, list.length)) * 100}%`;
}

export function renderResults(root, result, state, indexMode) {
  const visible = result.list.slice(0, state.shown);
  const results = root.querySelector('[data-results]');
  results.dataset.mode = indexMode ? 'index' : 'grid';
  results.dataset.density = state.density;
  root.querySelector('[data-shop-empty]').hidden = result.list.length > 0;
  const container = root.querySelector(indexMode ? '[data-rows]' : '[data-cards]');
  restartReveal(placeItems(container, visible, state, indexMode));
  renderMore(root, result.list, state);
}
