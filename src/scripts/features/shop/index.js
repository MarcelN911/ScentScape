/* Seite "Productos": Rad, Noten, Filter, Raster oder Index mit Vorschau. */
import { SCENT_FAMILIES } from '../../../data/scent.js';
import { renderActiveFilters } from './active-filters.js';
import { bindControls } from './controls.js';
import { filterEntries } from './filter.js';
import { initMarquee } from './marquee.js';
import { bindPreview, renderPreview } from './preview-control.js';
import { renderProfile } from './profile-view.js';
import { renderResults } from './results-view.js';
import { stopReveal } from './reveal.js';
import { createState, isIndexMode, resetPaging } from './state.js';
import { renderWheel } from './wheel.js';

function render(shop) {
  const { root, state } = shop;
  const result = filterEntries(shop.entries, state);
  const indexMode = isIndexMode(state);
  renderWheel(root, state, result.base);
  renderProfile(root, state, result);
  renderActiveFilters(root, state, shop.update);
  renderResults(root, result, state, indexMode);
  shop.visible = result.list.slice(0, state.shown);
  if (indexMode) renderPreview(shop, shop.visible);
}

/* "removeNote" ist eine Abkürzung der Filter-Chips: diese eine Note aus der Auswahl nehmen */
function applyChanges(state, changes) {
  const { removeNote, ...rest } = changes;
  if (removeNote) rest.notes = new Set([...state.notes].filter((note) => note !== removeNote));
  Object.assign(state, rest);
}

function createShop(root) {
  const data = JSON.parse(root.querySelector('[data-shop-data]').textContent);
  const shop = { root, state: createState(), entries: data.entries, images: data.images };
  shop.familyIndex = (name) => SCENT_FAMILIES.findIndex((family) => family.name === name);
  shop.visibleEntries = () => shop.visible ?? [];
  shop.update = (changes, { keepPage = false } = {}) => {
    applyChanges(shop.state, changes);
    if (!keepPage) resetPaging(shop.state);
    render(shop);
  };
  return shop;
}

export function initShop(signal) {
  const root = document.querySelector('[data-shop]');
  if (!root) return;
  const shop = createShop(root);
  bindControls(shop, signal);
  bindPreview(shop, signal);
  initMarquee(root, signal);
  addEventListener('resize', () => render(shop), { signal });
  render(shop);
  setTimeout(() => root.classList.add('is-in'), 80);
  signal.addEventListener('abort', stopReveal);
}
