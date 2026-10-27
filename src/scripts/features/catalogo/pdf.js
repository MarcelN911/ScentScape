/*
 * PDF-Seite des Catálogo Digital: Auswahl aus dem Link lesen, Fragancias nach Abschnitten
 * (z. B. Dama, Caballero/Unisex) auf Seiten verteilen, drucken.
 */
import { CATALOG_COLLECTIONS, CATALOG_PER_PAGE } from '../../../data/catalog.js';
import { sectionsOf } from './state.js';

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

/* Erste Seite eines Abschnitts mit schwarzer Kopfleiste, alle weiteren ohne */
function buildSheet(template, items, title, opening) {
  const page = template.content.firstElementChild.cloneNode(true);
  page.querySelector('[data-sheet-title]').textContent = title;
  page.querySelector('[data-sheet]').classList.toggle('sheet--opening', opening);
  page.querySelector('[data-sheet-grid]').replaceChildren(...items);
  return page;
}

function buildPages(root, choice) {
  const all = [...root.querySelectorAll('[data-pdf-pool] [data-sheet-item]')];
  const sections = sectionsOf(choice.collection, all, (item) => item.dataset.gender);
  const template = root.querySelector('[data-pdf-sheet]');
  const sheets = sections.flatMap((section) =>
    chunk(section.items, CATALOG_PER_PAGE).map((group, index) =>
      buildSheet(template, group, section.title, index === 0),
    ),
  );
  root.querySelector('[data-pdf-pages]').append(...sheets);
  return sections.flatMap((section) => section.items);
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
