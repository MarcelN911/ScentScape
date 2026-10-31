/*
 * Zurück aus einem Produkt: wieder bei derselben Karte landen.
 * Beim Klick auf ein Produkt merken wir uns Filter, Sortierung, "Ver más" und die Karte.
 * Kommt man mit "Zurück" auf "Productos", wird das wiederhergestellt und zur Karte gescrollt.
 * (Die Karten entstehen erst per JavaScript, deshalb kann der Browser das nicht allein.)
 */
import { readJson, removeKey, writeJson } from '../../utils/storage.js';

const KEY = 'shop-return';
const LINK = 'a[href^="/producto/"]';
const ITEM = '[data-shop-card], [data-index-row]';

/* Wurde die Seite mit Zurück/Vor erreicht? Erst beim normalen Laden, dann bei jedem Wechsel. */
let cameBack = performance.getEntriesByType('navigation')[0]?.type === 'back_forward';
document.addEventListener('astro:before-preparation', (event) => {
  cameBack = event.navigationType === 'traverse';
});

function remember(shop, link) {
  const item = link.closest(ITEM);
  writeJson(sessionStorage, KEY, {
    url: location.pathname + location.search,
    state: { ...shop.state, notes: [...shop.state.notes] },
    id: item ? (item.dataset.shopCard ?? item.dataset.indexRow) : null,
    scrollY,
  });
}

/** Beim Klick auf ein Produkt: Zustand und Karte merken. */
export function bindReturn(shop, signal) {
  const onClick = (event) => {
    const link = event.target.closest(LINK);
    if (link) remember(shop, link);
  };
  shop.root.addEventListener('click', onClick, { signal });
}

/**
 * Nur nach "Zurück": gemerkten Zustand in `state` zurückschreiben.
 * Gibt zurück, wohin danach gescrollt werden soll (oder null).
 */
export function restoreState(state) {
  const saved = readJson(sessionStorage, KEY, null);
  removeKey(sessionStorage, KEY);
  if (!cameBack || !saved || saved.url !== location.pathname + location.search) return null;
  Object.assign(state, saved.state, { notes: new Set(saved.state.notes) });
  return { id: saved.id, scrollY: saved.scrollY };
}

/** Nach dem Zeichnen: die angeklickte Karte in die Bildschirmmitte holen. */
export function scrollBack(root, target) {
  const id = target.id && CSS.escape(target.id);
  const item = id && root.querySelector(`[data-shop-card="${id}"], [data-index-row="${id}"]`);
  if (item && !item.hidden) item.scrollIntoView({ block: 'center', behavior: 'instant' });
  else scrollTo({ top: target.scrollY, behavior: 'instant' });
}
