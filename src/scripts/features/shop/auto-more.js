/*
 * "Ver más" von selbst: Kommt man beim Scrollen in die Nähe des Knopfs
 * (etwa eineinhalb Bildschirme vorher), werden die nächsten Produkte schon geladen.
 * So muss man nicht klicken und sieht nie das Ende der Liste.
 * Der Knopf bleibt als Rückfall (z. B. ohne IntersectionObserver).
 */
import { PAGE_SIZE } from '../../../data/shop.js';

/* So weit unterhalb des Bildschirms fängt das Nachladen an */
const AHEAD = '0px 0px 150% 0px';

export function loadMore(shop) {
  shop.update({ shown: shop.state.shown + PAGE_SIZE }, { keepPage: true });
}

/* Liegt der "Ver más"-Bereich noch im Vorlade-Bereich? (großer Bildschirm, wenige Karten) */
function stillNear(more) {
  if (more.hidden) return false;
  return more.getBoundingClientRect().top < innerHeight * 2.5;
}

export function bindAutoMore(shop, signal) {
  const more = shop.root.querySelector('[data-more]');
  if (!more || !('IntersectionObserver' in window)) return;
  const grow = () => {
    loadMore(shop);
    /* Der Beobachter meldet sich nur bei Änderungen: ist der Bereich noch nah, gleich weiter */
    requestAnimationFrame(() => stillNear(more) && grow());
  };
  const observer = new IntersectionObserver(
    ([entry]) => entry.isIntersecting && !more.hidden && grow(),
    { rootMargin: AHEAD },
  );
  observer.observe(more);
  signal.addEventListener('abort', () => observer.disconnect());
}
