/*
 * Seiten-Lebenszyklus für Astros ClientRouter.
 * Beim Seitenwechsel wird nur der Inhalt ausgetauscht, Skripte laufen nicht neu.
 * Deshalb meldet sich jedes Feature hier an und wird bei jedem Seitenaufruf gestartet.
 */
let controller = new AbortController();
const cleanups = [];

/**
 * Startet `init` bei jedem Seitenaufruf. `init` bekommt ein AbortSignal:
 * Listener mit `{ signal }` werden beim Verlassen der Seite automatisch entfernt.
 * Gibt `init` eine Funktion zurück, wird sie beim Verlassen aufgerufen.
 */
export function onPage(init) {
  document.addEventListener('astro:page-load', () => {
    const cleanup = init(controller.signal);
    if (typeof cleanup === 'function') cleanups.push(cleanup);
  });
}

/** Startet `init` genau einmal, für Elemente, die beim Seitenwechsel stehen bleiben. */
export function onFirstPage(init) {
  document.addEventListener('astro:page-load', () => init(), { once: true });
}

function teardown() {
  controller.abort();
  controller = new AbortController();
  cleanups.splice(0).forEach((cleanup) => cleanup());
}

document.addEventListener('astro:before-swap', teardown);

/* Der ClientRouter ersetzt die Attribute von <html>, die Klasse "js" muss wieder dazu. */
document.addEventListener('astro:after-swap', () => document.documentElement.classList.add('js'));
