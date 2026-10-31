/* Seite "Productos": Rad, Noten, Filter, Raster oder Index mit Vorschau. */
import { SCENT_FAMILIES } from '../../../data/scent.js';
import { renderActiveFilters } from './active-filters.js';
import { bindControls } from './controls.js';
import { filterEntries } from './filter.js';
import { initMarquee } from '../../effects/marquee.js';
import { bindMobileFilters } from './mobile-filters.js';
import { bindPreview, renderPreview } from './preview-control.js';
import { renderProfile } from './profile-view.js';
import { renderResults } from './results-view.js';
import { stopReveal } from './reveal.js';
import { bindReturn, restoreState, scrollBack } from './return.js';
import { createState, isIndexMode, resetPaging } from './state.js';
import { renderWheel } from './wheel.js';

function render(shop, keepCards = false) {
  const { root, state } = shop;
  const result = filterEntries(shop.entries, state);
  const indexMode = isIndexMode(state);
  renderWheel(root, state, result.base);
  renderProfile(root, state, result);
  renderActiveFilters(root, state, shop.update);
  renderResults(root, result, state, { indexMode, keepCards });
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
    // Beim Tippen in der Suche und bei "Ver más" bleiben die Karten stehen (kein neues Einblenden).
    const onlyQuery = Object.keys(changes).every((key) => key === 'query');
    render(shop, keepPage || onlyQuery);
  };
  return shop;
}

function bindAll(shop, signal) {
  bindControls(shop, signal);
  bindReturn(shop, signal);
  bindPreview(shop, signal);
  bindMobileFilters(shop.root, signal);
  initMarquee(shop.root, signal);
}

export function initShop(signal) {
  const root = document.querySelector('[data-shop]');
  if (!root) return;
  const shop = createShop(root);
  const returnTo = restoreState(shop.state);
  bindAll(shop, signal);
  // Auf dem Handy feuert "resize" auch beim Scrollen (Adressleiste): Karten dabei stehen lassen.
  addEventListener('resize', () => render(shop, true), { signal });
  render(shop);
  if (returnTo) requestAnimationFrame(() => scrollBack(root, returnTo));
  setTimeout(() => root.classList.add('is-in'), 80);
  signal.addEventListener('abort', stopReveal);
}
