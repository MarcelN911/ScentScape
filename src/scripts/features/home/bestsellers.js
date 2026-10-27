/*
 * "Los más pedidos": der Bereich bleibt stehen, die Karten fahren beim Scrollen seitwärts.
 * Fotos verschieben sich leicht und werden dunkler, je weiter sie von der Mitte entfernt sind.
 * Im Karussell (Hochformat) und auf Touch-Geräten zeigt nur die Karte in der Mitte ihre Notas und "Descubrir".
 */
import { onScrollProgress, PINNED_RANGE } from '../../effects/scroll.js';
import { padNumber } from '../../utils/format.js';

const isTouch = () => matchMedia('(hover: none)').matches;
/* Hochformat: Karussell mit der aktiven Karte in der Mitte */
const isCentered = () => matchMedia('(max-width: 1079px) and (orientation: portrait)').matches;

/** Gibt den Abstand der Karte zur Mitte zurück (in Bildschirmbreiten) */
function slidePhoto(card, focusX) {
  const photo = card.querySelector('[data-best-photo]');
  const box = card.getBoundingClientRect();
  const distance = (box.left + box.width / 2 - focusX) / innerWidth;
  const away = Math.min(1, Math.abs(distance));
  if (photo) {
    photo.style.transform = `translateX(${(-distance * 11).toFixed(2)}%) scale(${(1.12 - away * 0.1).toFixed(3)})`;
    photo.style.filter = `brightness(${(1 - away * 0.35).toFixed(3)}) saturate(${(1 - away * 0.3).toFixed(3)})`;
  }
  return away;
}

function paintCards(cards) {
  const first = cards[0];
  const focusX = Math.min(innerWidth / 2, first.offsetLeft + first.offsetWidth / 2);
  const distances = cards.map((card) => slidePhoto(card, focusX));
  const nearest = distances.indexOf(Math.min(...distances));
  const marks = isTouch() || isCentered();
  cards.forEach((card, index) => card.classList.toggle('is-focus', marks && index === nearest));
  return nearest;
}

function paint(section, progress) {
  const track = section.querySelector('[data-best-track]');
  const cards = [...track.querySelectorAll('[data-best-card]')];
  const distance = Math.max(0, track.scrollWidth - innerWidth);
  track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
  section.style.setProperty('--best-progress', progress.toFixed(4));
  const nearest = paintCards(cards);
  const number = isCentered()
    ? nearest + 1
    : Math.min(cards.length, Math.floor(progress * (cards.length - 0.001)) + 1);
  section.querySelector('[data-best-count]').textContent = padNumber(number);
}

export function animateBestsellers() {
  const section = document.querySelector('[data-bestsellers]');
  if (!section) return;
  onScrollProgress(section, PINNED_RANGE, (progress) => paint(section, progress));
}
