/*
 * Seite sperren, solange ein Fenster offen ist (Menü, Bolsa, Favoritos, Filter, Videos, Rabatt, Intro).
 * Jedes Fenster meldet sich mit seinem Namen an und ab. Gesperrt ist, solange noch eines offen ist:
 * so gibt ein Fenster beim Schließen die Seite nicht frei, während ein anderes noch offen ist.
 * Die Sperre selbst ist die Klasse is-locked an <html> (base.css).
 */
const owners = new Set();

function apply() {
  document.documentElement.classList.toggle('is-locked', owners.size > 0);
}

/** lockScroll('menu', true) sperrt, lockScroll('menu', false) gibt für das Menü wieder frei */
export function lockScroll(owner, locked) {
  if (locked) owners.add(owner);
  else owners.delete(owner);
  apply();
}

/* Der Seitenwechsel ersetzt die Klassen an <html>: Sperre danach wieder setzen, falls nötig */
if (typeof document !== 'undefined') document.addEventListener('astro:after-swap', apply);

/*
 * Harte Sperre für Ladescreens (Intro der Startseite, Vorhang beim Seitenwechsel).
 * overflow: hidden allein reicht auf dem Handy nicht: Safari scrollt unter dem Finger trotzdem.
 * Deshalb werden zusätzlich Wischen, Mausrad und Scroll-Tasten abgefangen.
 * Für Menü oder Bolsa nicht geeignet: dort muss man im Fenster selbst noch scrollen können.
 */
const blockers = new Set();
const SCROLL_KEYS = new Set([' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown']);
const stop = (event) => event.cancelable && event.preventDefault();
const stopKey = (event) => SCROLL_KEYS.has(event.key) && stop(event);
const OPTIONS = { passive: false, capture: true };

function listen(on) {
  const method = on ? addEventListener : removeEventListener;
  method('wheel', stop, OPTIONS);
  method('touchmove', stop, OPTIONS);
  method('keydown', stopKey, OPTIONS);
}

/** blockScroll('intro', true) sperrt hart, blockScroll('intro', false) gibt frei */
export function blockScroll(owner, blocked) {
  const before = blockers.size;
  if (blocked) blockers.add(owner);
  else blockers.delete(owner);
  lockScroll(`block:${owner}`, blocked);
  if (!before && blockers.size) listen(true);
  if (before && !blockers.size) listen(false);
}
