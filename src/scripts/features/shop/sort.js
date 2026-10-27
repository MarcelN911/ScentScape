/*
 * Dropdown "Orden" auf der Seite "Productos".
 * Öffnen, Schließen bei Klick daneben und Escape erledigt der Browser (Attribut "popover").
 * Hier: die Liste unter den Knopf legen, beim Scrollen schließen und die Auswahl anzeigen.
 */
import { SORT_OPTIONS } from '../../../data/shop.js';

const GAP = 8;
const PANEL_HEIGHT = 250; // ungefähr, reicht für die Entscheidung "oben oder unten"

/* Liste rechtsbündig unter den Knopf legen. Ist unten kein Platz, kommt sie darüber. */
function placePanel(toggle, panel) {
  const box = toggle.getBoundingClientRect();
  const roomBelow = innerHeight - box.bottom;
  panel.style.right = `${innerWidth - box.right}px`;
  if (roomBelow > PANEL_HEIGHT) {
    panel.style.top = `${box.bottom + GAP}px`;
    panel.style.bottom = 'auto';
  } else {
    panel.style.top = 'auto';
    panel.style.bottom = `${innerHeight - box.top + GAP}px`;
  }
}

/* Kurz bevor die Liste auf- oder zugeht: Lage setzen und den Pfeil am Knopf drehen */
function onBeforeToggle(event, toggle, panel) {
  const open = event.newState === 'open';
  if (open) placePanel(toggle, panel);
  toggle.classList.toggle('is-open', open);
}

export function bindSort(root, signal) {
  const toggle = root.querySelector('[data-sort-toggle]');
  const panel = root.querySelector('#shop-sort-menu');
  if (!toggle || !panel) return;
  panel.addEventListener('beforetoggle', (event) => onBeforeToggle(event, toggle, panel), {
    signal,
  });

  /* Die Liste steht fest am Bildschirm: beim Scrollen würde sie vom Knopf wegrutschen */
  const close = () => panel.matches(':popover-open') && panel.hidePopover();
  addEventListener('scroll', close, { capture: true, passive: true, signal });
  addEventListener('resize', close, { signal });
}

/** Nach einer Auswahl: Liste schließen. */
export function closeSort(root) {
  const panel = root.querySelector('#shop-sort-menu');
  if (panel?.matches(':popover-open')) panel.hidePopover();
}

/** Zeigt die aktuelle Sortierung im Knopf und markiert sie in der Liste. */
export function renderSort(root, sort) {
  const current = SORT_OPTIONS.find((option) => option.value === sort) ?? SORT_OPTIONS[0];
  root.querySelector('[data-sort-value]').textContent = current.label;
  root.querySelectorAll('[data-sort-option]').forEach((option) => {
    option.setAttribute('aria-selected', String(option.dataset.sortOption === current.value));
  });
}
