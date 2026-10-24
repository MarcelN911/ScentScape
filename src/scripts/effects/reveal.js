/*
 * Einblenden beim Scrollen:
 *   data-reveal="up"   gleitet von unten herein
 *   data-reveal="mask" gleitet aus einer Maske (.line-mask) nach oben
 * Verzögerung: style="--reveal-delay:120ms" direkt am Element.
 */
function revealTarget(element) {
  return element.dataset.reveal === 'mask' ? element.parentElement : element;
}

function reveal(element) {
  element.classList.add('is-revealed');
}

function createObserver(pending) {
  const observer = new IntersectionObserver(
    (entries) =>
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry) => {
          reveal(pending.get(entry.target));
          observer.unobserve(entry.target);
        }),
    { rootMargin: '0px 0px -4% 0px' },
  );
  return observer;
}

export function initReveal(signal) {
  const pending = new Map();
  const observer = createObserver(pending);
  document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((element) => {
    pending.set(revealTarget(element), element);
    observer.observe(revealTarget(element));
  });
  signal.addEventListener('abort', () => observer.disconnect());
}
