/*
 * Produktseite auf dem Handy: feste Kaufleiste unten (ProductBar.astro).
 * Erscheint, wenn der Kaufbereich nach oben weggescrollt ist, und zeigt Größe und Preis der Auswahl.
 * Solange sie zu sehen ist, rückt der Musik-Player nach oben (Klasse has-bottom-bar an <html>).
 */
function paintBar(buy, bar) {
  const option = buy.querySelector('[data-buy-option][aria-checked="true"]');
  const price = option.querySelector('.buy__size-price')?.textContent ?? '';
  bar.querySelector('[data-product-bar-size]').textContent = `${option.dataset.ml} ml`;
  bar.querySelector('[data-product-bar-price]').textContent = price;
}

function show(bar, visible) {
  bar.classList.toggle('is-shown', visible);
  document.documentElement.classList.toggle('has-bottom-bar', visible);
}

function watchBuy(buy, bar, signal) {
  const observer = new IntersectionObserver(([entry]) => {
    show(bar, !entry.isIntersecting && entry.boundingClientRect.top < 0);
  });
  observer.observe(buy);
  signal.addEventListener('abort', () => {
    observer.disconnect();
    show(bar, false);
  });
}

export function initProductBar(signal) {
  const buy = document.querySelector('[data-buy]');
  const bar = document.querySelector('[data-product-bar]');
  if (!buy || !bar) return;
  const add = () => buy.querySelector('[data-buy-add]').click();
  bar.querySelector('[data-product-bar-add]').addEventListener('click', add, { signal });
  /* Größe gewechselt: Leiste nachziehen (nach dem Klick-Handler von buy.js) */
  buy.addEventListener('click', () => requestAnimationFrame(() => paintBar(buy, bar)), { signal });
  paintBar(buy, bar);
  watchBuy(buy, bar, signal);
}
