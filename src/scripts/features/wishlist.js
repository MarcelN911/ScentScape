/*
 * Herzen (Merkliste). Gespeichert wie auf der alten Seite unter "elixir_hearts".
 * Beim ersten Herz eines Produkts wird nexomar informiert (zählt die Beliebtheit).
 */
import { ENDPOINTS } from '../api/client.js';
import { registerAction } from '../core/actions.js';
import { onPage } from '../core/lifecycle.js';
import { readJson, writeJson } from '../utils/storage.js';

const STORAGE_KEY = 'elixir_hearts';

function savedHearts() {
  return readJson(localStorage, STORAGE_KEY, {});
}

function renderHearts() {
  const saved = savedHearts();
  document.querySelectorAll('[data-wish-id]').forEach((button) => {
    button.setAttribute('aria-pressed', String(Boolean(saved[button.dataset.wishId])));
  });
}

function toggleHeart(button) {
  const id = button.dataset.wishId;
  const saved = savedHearts();
  if (saved[id]) delete saved[id];
  else {
    saved[id] = true;
    fetch(ENDPOINTS.heart(id), { method: 'POST' }).catch(() => {});
  }
  writeJson(localStorage, STORAGE_KEY, saved);
  renderHearts();
}

registerAction('toggle-wish', toggleHeart);
onPage(renderHearts);
