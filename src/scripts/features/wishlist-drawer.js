/*
 * Seitenleiste "Favoritos" (WishlistDrawer.astro): zeigt die Produkte mit Herz.
 * Gespeichert sind nur die IDs (wishlist.js). Name, Bild und Preis kommen aus /favoritos.json,
 * die Datei wird erst beim ersten Öffnen geladen.
 */
import { EVENTS, listen } from '../core/events.js';
import { initDrawer } from '../layout/drawer.js';
import { heartIds } from './wishlist.js';

let productsPromise;

/** Alle Produkte als Map: ID → Eintrag. Schlägt das Laden fehl, wird es beim nächsten Mal neu versucht. */
function loadProducts() {
  productsPromise ??= fetch('/favoritos.json')
    .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
    .then((list) => new Map(list.map((product) => [product.id, product])))
    .catch((error) => {
      productsPromise = null;
      throw error;
    });
  return productsPromise;
}

function itemFor(template, product) {
  const item = template.content.firstElementChild.cloneNode(true);
  const field = (name) => item.querySelector(`[data-wish-${name}]`);
  field('link').href = product.href;
  field('image').src = product.image;
  field('label').textContent = product.label;
  field('name').textContent = product.name;
  field('price').textContent = product.price;
  item.querySelector('[data-action="toggle-wish"]').dataset.wishId = product.id;
  return item;
}

function showList(root, products) {
  const template = root.querySelector('[data-wish-item]');
  const items = heartIds()
    .map((id) => products.get(id))
    .filter(Boolean);
  root.querySelector('[data-wish-list]').replaceChildren(...items.map((p) => itemFor(template, p)));
  root.querySelector('[data-wish-message]').textContent = 'Aún no tienes favoritos';
  root.querySelector('[data-wish-empty]').hidden = items.length > 0;
}

function showError(root) {
  root.querySelector('[data-wish-list]').replaceChildren();
  root.querySelector('[data-wish-message]').textContent = 'No pudimos cargar tus favoritos';
  root.querySelector('[data-wish-empty]').hidden = false;
}

async function render(root) {
  try {
    showList(root, await loadProducts());
  } catch {
    showError(root);
  }
}

/* Herz in der Leiste angeklickt: nur diesen Eintrag entfernen, die anderen bleiben stehen */
function removeUnhearted(root) {
  const ids = new Set(heartIds());
  const list = root.querySelector('[data-wish-list]');
  list.querySelectorAll('[data-wish-id]').forEach((button) => {
    if (!ids.has(button.dataset.wishId)) button.closest('li').remove();
  });
  root.querySelector('[data-wish-empty]').hidden = list.children.length > 0;
}

export function initWishlistDrawer() {
  initDrawer('wishlist', render);
  const root = document.querySelector('[data-drawer="wishlist"]');
  listen(EVENTS.wishChange, () => root?.hasAttribute('data-open') && removeUnhearted(root));
}
