/* Seite "Catálogo Digital": Auswahl treffen, Fotos vorladen, PDF öffnen. */
import { CATALOG_COLLECTIONS } from '../../../data/catalog.js';
import { showToast } from '../../core/events.js';
import { preloadImages } from './preload.js';
import { createCatalogState, itemsOf, pagesOf } from './state.js';
import { renderCatalog } from './view.js';

const render = (catalog) => renderCatalog(catalog.root, catalog.entries, catalog.state);

/* Jede Änderung macht ein fertiges PDF wieder zum Entwurf */
function change(catalog, patch) {
  if (catalog.state.phase === 'generating') return;
  Object.assign(catalog.state, patch, { phase: 'idle', progress: 0 });
  render(catalog);
}

function finish(catalog) {
  const collection = CATALOG_COLLECTIONS[catalog.state.collection];
  const pages = pagesOf(collection, itemsOf(catalog.entries, catalog.state));
  Object.assign(catalog.state, { phase: 'ready', progress: 1 });
  render(catalog);
  showToast(`Catálogo listo · ${pages} páginas`);
}

async function preload(catalog, items) {
  const onProgress = (progress) => {
    catalog.state.progress = progress;
    render(catalog);
  };
  const aborted = () => catalog.signal.aborted;
  await preloadImages(
    items.map((item) => item.image),
    onProgress,
    aborted,
  );
  if (!aborted()) setTimeout(() => finish(catalog), 250);
}

function generate(catalog, event) {
  event.preventDefault();
  const items = itemsOf(catalog.entries, catalog.state);
  if (!items.length || catalog.state.phase === 'generating') return;
  Object.assign(catalog.state, { phase: 'generating', progress: 0 });
  render(catalog);
  preload(catalog, items);
}

const CLICKS = [
  [
    '[data-catalog-collection]',
    (catalog, el) => change(catalog, { collection: Number(el.dataset.catalogCollection) }),
  ],
  [
    '[data-catalog-prices]',
    (catalog, el) => change(catalog, { prices: Number(el.dataset.catalogPrices) }),
  ],
  ['[data-catalog-edit]', (catalog) => change(catalog, {})],
];

function handleClick(catalog, event) {
  const match = CLICKS.find(([selector]) => event.target.closest(selector));
  if (match) match[1](catalog, event.target.closest(match[0]));
}

export function initCatalogPage(signal) {
  const root = document.querySelector('[data-catalog-page]');
  if (!root) return;
  const entries = JSON.parse(root.querySelector('[data-catalog-data]').textContent);
  const catalog = { root, entries, signal, state: createCatalogState() };
  const form = root.querySelector('[data-catalog-form]');
  root.addEventListener('click', (event) => handleClick(catalog, event), { signal });
  form.addEventListener('submit', (event) => generate(catalog, event), { signal });
  render(catalog);
  setTimeout(() => root.classList.add('is-in'), 80);
}
