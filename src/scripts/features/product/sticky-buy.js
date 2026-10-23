/* Die Kaufleiste unten erscheint, sobald der Kaufbereich nach oben aus dem Bild gescrollt ist. */
function onBuyVisibility([entry]) {
  const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
  document.documentElement.classList.toggle('has-sticky-buy', scrolledPast);
}

export function initStickyBuy() {
  const buyRow = document.querySelector('[data-buy-row]');
  if (!buyRow) return undefined;
  const observer = new IntersectionObserver(onBuyVisibility);
  observer.observe(buyRow);
  return () => {
    observer.disconnect();
    document.documentElement.classList.remove('has-sticky-buy');
  };
}
