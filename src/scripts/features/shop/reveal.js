/*
 * Karten und Zeilen blenden ein, sobald sie ins Bild kommen.
 * Nach jeder Filteränderung beginnt das Einblenden von vorn (wie in der Vorlage).
 */
const observer =
  typeof IntersectionObserver === 'undefined'
    ? null
    : new IntersectionObserver(
        (entries) =>
          entries
            .filter((entry) => entry.isIntersecting)
            .forEach((entry) => {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }),
        { rootMargin: '0px 0px -6% 0px' },
      );

/** Gitter: Verzögerung nach Spalte, leicht nach Reihe. Index: nach Position. */
export function delayFor(index, cols, isRow) {
  if (isRow) return Math.min(index % 24, 10) * 45;
  return (index % cols) * 100 + Math.min(3, Math.floor(index / cols)) * 40;
}

export function restartReveal(elements) {
  elements.forEach((element) => {
    element.classList.remove('is-visible');
    observer?.observe(element);
  });
}

export function stopReveal() {
  observer?.disconnect();
}
