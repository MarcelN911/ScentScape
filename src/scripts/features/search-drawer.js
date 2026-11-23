/*
 * Suche im Header (SearchDrawer.astro): Handy = Vollbild-Fenster, Desktop = Seitenleiste.
 * Die Produkte kommen aus /buscar.json, die Datei wird erst beim ersten Öffnen geladen.
 * Gesucht wird nach Marke + Name: jedes getippte Wort muss vorkommen ("boss night").
 */
import { initDrawer } from '../layout/drawer.js';
import { toPlain } from '../utils/text.js';

const SUGGESTIONS = 6;
const MAX_RESULTS = 30;

let productsPromise;

/** Alle Produkte, die beliebtesten zuerst. Schlägt das Laden fehl, wird es beim nächsten Mal neu versucht. */
function loadProducts() {
  productsPromise ??= fetch('/buscar.json')
    .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
    .catch((error) => {
      productsPromise = null;
      throw error;
    });
  return productsPromise;
}

/** "Boss  Night" → ["boss", "night"] */
function wordsOf(text) {
  return toPlain(text).split(/\s+/).filter(Boolean);
}

function findProducts(products, words) {
  if (!words.length) return products.slice(0, SUGGESTIONS);
  const matches = products.filter((product) =>
    words.every((word) => product.search.includes(word)),
  );
  return matches.slice(0, MAX_RESULTS);
}

function itemFor(template, product) {
  const item = template.content.firstElementChild.cloneNode(true);
  const field = (name) => item.querySelector(`[data-search-${name}]`);
  field('link').href = product.href;
  field('image').src = product.image;
  field('brand').textContent = product.brand || product.label;
  field('name').textContent = product.name;
  field('price').textContent = product.price;
  return item;
}

function headingText(query, count) {
  if (!query) return 'Los más buscados';
  return count === 1 ? '1 resultado' : `${count} resultados`;
}

function showResults(root, products) {
  const field = (name) => root.querySelector(`[data-search-${name}]`);
  const query = field('input').value.trim();
  const found = findProducts(products, wordsOf(query));
  const template = root.querySelector('[data-search-item]');
  field('list').replaceChildren(...found.map((product) => itemFor(template, product)));
  field('heading').textContent = headingText(query, found.length);
  field('empty').hidden = found.length > 0;
  field('query').textContent = query;
  field('all').hidden = !query || found.length === 0;
  field('all').href = `/productos/?q=${encodeURIComponent(query)}`;
}

function showError(root) {
  root.querySelector('[data-search-list]').replaceChildren();
  root.querySelector('[data-search-heading]').textContent = 'No pudimos cargar los perfumes';
}

async function render(root) {
  try {
    showResults(root, await loadProducts());
  } catch {
    showError(root);
  }
}

/* Gleich ins Feld springen, damit die Tastatur auf dem Handy sofort aufgeht */
function onOpen(root) {
  const input = root.querySelector('[data-search-input]');
  input.focus({ preventScroll: true });
  input.select();
  render(root);
}

export function initSearchDrawer() {
  initDrawer('search', onOpen);
  const root = document.querySelector('[data-drawer="search"]');
  root?.querySelector('[data-search-input]').addEventListener('input', () => render(root));
}
