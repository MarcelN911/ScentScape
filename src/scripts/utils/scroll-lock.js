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
