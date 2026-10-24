/* Welches Produkt die Vorschau zeigt und welche Größe gewählt ist. */
import { renderHearts } from '../wishlist.js';
import { padNumber } from '../../utils/format.js';
import { fillSizes, showPreview } from './preview.js';

let shownId = null;

function currentOf(shop, visible) {
  const index = Math.max(
    0,
    visible.findIndex((entry) => entry.id === shop.state.active),
  );
  const entry = visible[index];
  const selected = entry ? Math.min(shop.state.sizes[entry.id] ?? 0, entry.sizes.length - 1) : 0;
  return { entry, index, selected };
}

export function renderPreview(shop, visible) {
  const { entry, index, selected } = currentOf(shop, visible);
  if (!entry) return;
  markRow(shop, entry.id);
  if (shownId === entry.id)
    return fillSizes(shop.root.querySelector('[data-preview]'), entry, selected);
  const animate = shownId !== null;
  shownId = entry.id;
  const number = padNumber(index + 1);
  showPreview(shop.root, { entry, number, selected, images: shop.images, animate });
  renderHearts();
}

function markRow(shop, id) {
  shop.root.querySelectorAll('[data-index-row]').forEach((row) => {
    row.classList.toggle('is-active', row.dataset.indexRow === id);
  });
}

function activate(shop, row) {
  const id = row.dataset.indexRow;
  if (shop.state.active === id) return;
  shop.state.active = id;
  renderPreview(shop, shop.visibleEntries());
}

function chooseSize(shop, button) {
  const id = shop.root.querySelector('[data-preview-heart]').dataset.wishId;
  shop.state.sizes[id] = Number(button.dataset.previewSize);
  renderPreview(shop, shop.visibleEntries());
}

function onRow(shop) {
  return (event) => {
    const row = event.target.closest('[data-index-row]');
    if (row) activate(shop, row);
  };
}

function onSize(shop) {
  return (event) => {
    const button = event.target.closest('[data-preview-size]');
    if (button) chooseSize(shop, button);
  };
}

export function bindPreview(shop, signal) {
  const rows = shop.root.querySelector('[data-rows]');
  rows.addEventListener('mouseover', onRow(shop), { signal });
  rows.addEventListener('focusin', onRow(shop), { signal });
  const sizes = shop.root.querySelector('[data-preview-sizes]');
  sizes.addEventListener('click', onSize(shop), { signal });
  signal.addEventListener('abort', () => (shownId = null));
}
