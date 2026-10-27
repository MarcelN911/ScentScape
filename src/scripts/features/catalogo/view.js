/* Zeigt den Zustand des Catálogo Digital: Auswahl, Vorschau auf der Bühne, Knöpfe und Hinweis. */
import { CATALOG_COLLECTIONS } from '../../../data/catalog.js';
import { hintOf, itemsOf, pagesOf, pdfPath, sectionsOf } from './state.js';

const IDLE_GLOW = 'rgb(83 16 25 / .5)';
const PHASE_GLOW = { ready: 'rgb(240 190 145 / .14)' }; // Pfirsich (--peach)

function setText(root, selector, text) {
  root.querySelectorAll(selector).forEach((element) => (element.textContent = text));
}

function markChoices(root, state) {
  root.querySelectorAll('[data-catalog-collection]').forEach((button) => {
    button.setAttribute(
      'aria-checked',
      String(Number(button.dataset.catalogCollection) === state.collection),
    );
  });
  root.querySelectorAll('[data-catalog-prices]').forEach((button) => {
    button.setAttribute(
      'aria-checked',
      String(Number(button.dataset.catalogPrices) === state.prices),
    );
  });
}

/* Die vier Fragancias auf der Vorschauseite */
function renderSheet(root, items, state) {
  const sheet = root.querySelector('[data-stage-sheet]');
  sheet.querySelectorAll('[data-sheet-item]').forEach((slot, index) => {
    const item = items[index];
    slot.hidden = !item;
    if (!item) return;
    slot.querySelector('[data-sheet-image]').src = item.image;
    slot.querySelector('[data-sheet-name]').textContent = item.name;
    slot.querySelector('[data-sheet-price]').textContent = item.price;
  });
  sheet.classList.toggle('no-prices', state.prices === 1);
}

function renderStage(root, items, state) {
  const collection = CATALOG_COLLECTIONS[state.collection];
  setText(root, '[data-cover-collection]', collection.title);
  setText(root, '[data-cover-count]', items.length);
  const [first] = sectionsOf(collection, items);
  setText(root, '[data-sheet-title]', first?.title ?? collection.title);
  renderSheet(root, first?.items ?? [], state);
}

function statusOf(state, pages) {
  if (state.phase === 'generating') return `Generando PDF · ${Math.round(state.progress * 100)}%`;
  if (state.phase === 'ready') return `PDF listo · ${pages} páginas`;
  return `${pages} páginas · ${CATALOG_COLLECTIONS[state.collection].title}`;
}

function renderSubmit(root, state, items, pages) {
  const submit = root.querySelector('[data-catalog-submit]');
  const label =
    state.phase === 'generating'
      ? `Generando PDF… ${Math.round(state.progress * 100)}%`
      : `Generar catálogo · ${pages} páginas`;
  submit.hidden = state.phase === 'ready';
  submit.disabled = state.phase === 'generating' || !items.length;
  setText(root, '[data-catalog-submit-label]', label);
}

function renderDone(root, state, items) {
  root.querySelector('[data-catalog-done]').hidden = state.phase !== 'ready';
  root.querySelector('[data-catalog-pdf]').href = `${pdfPath(state)}&imprimir`;
  setText(root, '[data-catalog-hint]', hintOf(state, items.length));
}

/* Bühne: Fortschrittsbalken, Lage der Blätter, Farbe des Lichtscheins */
function renderPhase(root, state, pages) {
  setText(root, '[data-stage-pages]', pages);
  setText(root, '[data-catalog-status]', statusOf(state, pages));
  root.style.setProperty('--progress', state.phase === 'idle' ? 0 : state.progress);
  root.classList.toggle('is-generating', state.phase === 'generating');
  root.classList.toggle('is-ready', state.phase === 'ready');
  root.querySelector('.split').style.setProperty('--glow', PHASE_GLOW[state.phase] ?? IDLE_GLOW);
}

export function renderCatalog(root, entries, state) {
  const items = itemsOf(entries, state);
  const pages = pagesOf(CATALOG_COLLECTIONS[state.collection], items);
  markChoices(root, state);
  renderStage(root, items, state);
  renderSubmit(root, state, items, pages);
  renderDone(root, state, items);
  renderPhase(root, state, pages);
}
