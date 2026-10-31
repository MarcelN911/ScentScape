/*
 * Eigenes Dropdown für "Departamento" im Formular "Finalizar compra".
 * Die Liste eines <select> zeichnet der Browser selbst, sie lässt sich kaum gestalten.
 * Deshalb: Knopf + Liste (popover) zum Bedienen, und das echte <select> bleibt unsichtbar
 * im Formular. Es hält den Wert, damit Prüfen, Merken und Autofill weiter funktionieren.
 */
const GAP = 8;
const PANEL_HEIGHT = 320; // gleiche Höhe wie max-height im CSS

/* Liste unter das Feld legen, so breit wie das Feld. Ist unten kein Platz, kommt sie darüber. */
function placePanel(toggle, panel) {
  const box = toggle.getBoundingClientRect();
  panel.style.left = `${box.left}px`;
  panel.style.width = `${box.width}px`;
  const below = innerHeight - box.bottom > PANEL_HEIGHT + GAP;
  panel.style.top = below ? `${box.bottom + GAP}px` : 'auto';
  panel.style.bottom = below ? 'auto' : `${innerHeight - box.top + GAP}px`;
}

/** Zeigt den Wert des <select> im Knopf und markiert ihn in der Liste. */
function showValue(pick) {
  const { select, toggle, panel } = pick;
  toggle.querySelector('[data-pick-value]').textContent =
    select.value || select.options[0].textContent;
  toggle.classList.toggle('is-empty', !select.value);
  panel.querySelectorAll('[data-pick-option]').forEach((option) => {
    option.setAttribute('aria-selected', String(option.dataset.pickOption === select.value));
  });
}

/* Auswahl ins <select> schreiben und "input"/"change" melden, wie bei einer echten Eingabe */
function choose(pick, value) {
  pick.select.value = value;
  pick.select.dispatchEvent(new Event('input', { bubbles: true }));
  pick.select.dispatchEvent(new Event('change', { bubbles: true }));
  pick.panel.hidePopover();
  pick.toggle.focus();
}

/* Beim Öffnen: Lage setzen, Pfeil drehen, gewählten Eintrag zeigen und fokussieren */
function onToggle(pick, event) {
  const open = event.newState === 'open';
  pick.toggle.classList.toggle('is-open', open);
  pick.toggle.setAttribute('aria-expanded', String(open));
  if (!open) return;
  placePanel(pick.toggle, pick.panel);
  const current = pick.panel.querySelector('[aria-selected="true"]');
  const target = current ?? pick.panel.querySelector('[data-pick-option]');
  requestAnimationFrame(() => target.focus());
}

/* Pfeiltasten wandern durch die Liste, ein Buchstabe springt zum ersten passenden Namen */
function onKey(pick, event) {
  const options = [...pick.panel.querySelectorAll('[data-pick-option]')];
  const index = options.indexOf(document.activeElement);
  const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
  if (step) {
    event.preventDefault();
    options[Math.min(options.length - 1, Math.max(0, index + step))].focus();
  } else if (event.key.length === 1) {
    const letter = event.key.toLowerCase();
    options.find((option) => option.textContent.trim().toLowerCase().startsWith(letter))?.focus();
  }
}

/* Die Liste steht fest am Bildschirm: Scrollt die Seite, schließt sie (Scrollen in der Liste nicht) */
function closeOnPageScroll(pick, signal) {
  const close = (event) => {
    if (pick.panel.contains(event.target)) return;
    if (pick.panel.matches(':popover-open')) pick.panel.hidePopover();
  };
  addEventListener('scroll', close, { capture: true, passive: true, signal });
  addEventListener('resize', close, { signal });
}

function bindPanel(pick, signal) {
  const { panel } = pick;
  const onClick = (event) => {
    const option = event.target.closest('[data-pick-option]');
    if (option) choose(pick, option.dataset.pickOption);
  };
  panel.addEventListener('toggle', (event) => onToggle(pick, event), { signal });
  panel.addEventListener('keydown', (event) => onKey(pick, event), { signal });
  panel.addEventListener('click', onClick, { signal });
}

function bindPick(element, signal) {
  const pick = {
    select: element.querySelector('select'),
    toggle: element.querySelector('[data-pick-toggle]'),
    panel: element.querySelector('[data-pick-panel]'),
  };
  bindPanel(pick, signal);
  bindNative(pick, signal);
  closeOnPageScroll(pick, signal);
  showValue(pick);
}

/* Ändert sich das <select> von außen (gemerkte Daten, Autofill), zeigt der Knopf es an.
   Fokus aufs <select> (z. B. bei einer Fehlermeldung) geht an den Knopf weiter. */
function bindNative(pick, signal) {
  pick.select.addEventListener('change', () => showValue(pick), { signal });
  pick.select.addEventListener('focus', () => pick.toggle.focus(), { signal });
}

/** Alle Dropdowns im Formular. Nach fillRemembered aufrufen, damit gemerkte Werte erscheinen. */
export function bindSelects(form, signal) {
  form.querySelectorAll('[data-pick]').forEach((element) => bindPick(element, signal));
}
