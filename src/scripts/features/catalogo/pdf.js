/* PDF-Seite des Catálogo Digital: Auswahl aus dem Link lesen, Fragancias auf Seiten verteilen, drucken. */
import { CATALOG_COLLECTIONS, CATALOG_PER_PAGE } from '../../../data/catalog.js';

function readChoice(search) {
  const params = new URLSearchParams(search);
  const found = CATALOG_COLLECTIONS.find((item) => item.key === params.get('coleccion'));
  return {
    collection: found ?? CATALOG_COLLECTIONS[0],
    prices: params.get('precios') !== 'no',
    client: (params.get('para') ?? '').trim().slice(0, 30),
    print: params.has('imprimir'),
  };
}

function chunk(list, size) {
  return Array.from({ length: Math.ceil(list.length / size) }, (_, index) =>
    list.slice(index * size, index * size + size),
  );
}

function buildSheet(template, items, number, short) {
  const page = template.content.firstElementChild.cloneNode(true);
  page.querySelector('[data-sheet-short]').textContent = short;
  page.querySelector('[data-sheet-page]').textContent = String(number).padStart(2, '0');
  page.querySelector('[data-sheet-grid]').replaceChildren(...items);
  return page;
}

function buildPages(root, choice) {
  const { gender, short } = choice.collection;
  const items = [...root.querySelectorAll('[data-pdf-pool] [data-sheet-item]')].filter(
    (item) => !gender || item.dataset.gender === gender,
  );
  const template = root.querySelector('[data-pdf-sheet]');
  const sheets = chunk(items, CATALOG_PER_PAGE).map((group, index) =>
    buildSheet(template, group, index + 2, short),
  );
  root.querySelector('[data-pdf-pages]').append(...sheets);
  return items;
}

function fillCover(root, choice, count) {
  root.querySelector('[data-cover-collection]').textContent = choice.collection.title;
  root.querySelector('[data-cover-count]').textContent = count;
  root.querySelector('[data-cover-client]').textContent = choice.client || 'ti';
  root.classList.toggle('no-prices', !choice.prices);
}

/* Erst drucken, wenn alle Fotos da sind */
async function printWhenReady(root) {
  const images = [...root.querySelectorAll('[data-pdf-pages] img')];
  images.forEach((image) => (image.loading = 'eager'));
  await Promise.all(images.map((image) => image.decode().catch(() => {})));
  window.print();
}

export function initPdfPage(signal) {
  const root = document.querySelector('[data-pdf-page]');
  if (!root) return;
  const choice = readChoice(window.location.search);
  const items = buildPages(root, choice);
  fillCover(root, choice, items.length);
  root
    .querySelector('[data-pdf-print]')
    .addEventListener('click', () => printWhenReady(root), { signal });
  if (choice.print) printWhenReady(root);
}
