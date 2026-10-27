/*
 * Handy: Filter-Panel öffnen und schließen ("Filtros" in der Leiste, ✕, "Ver fragancias",
 * Tippen auf den dunklen Hintergrund oder Escape). Klasse is-filters-open an <html>.
 */
const OPEN_CLASS = 'is-filters-open';

function setOpen(open) {
  document.documentElement.classList.toggle(OPEN_CLASS, open);
  document.documentElement.classList.toggle('is-locked', open);
}

export function bindMobileFilters(root, signal) {
  root.addEventListener(
    'click',
    (event) => {
      if (event.target.closest('[data-filters-open]')) setOpen(true);
      else if (event.target.closest('[data-filters-close]')) setOpen(false);
    },
    { signal },
  );
  document.addEventListener('keydown', (event) => event.key === 'Escape' && setOpen(false), {
    signal,
  });
  signal.addEventListener('abort', () => setOpen(false));
}
