/*
 * "Los más pedidos": der Bereich bleibt stehen, die Karten fahren beim Scrollen seitwärts.
 * Flaschen drehen sich leicht, je weiter sie von der Mitte entfernt sind.
 */
import { onScrollProgress, PINNED_RANGE } from '../../effects/scroll.js';
import { padNumber } from '../../utils/format.js';

function tiltBottle(card, focusX) {
  const box = card.getBoundingClientRect();
  const distance = (box.left + box.width / 2 - focusX) / innerWidth;
  const bottle = card.querySelector('[data-stage-bottle]');
  if (!bottle) return;
  bottle.style.rotate = `${(distance * 18).toFixed(2)}deg`;
  bottle.style.translate = `0 ${(Math.abs(distance) * 30).toFixed(1)}px`;
  bottle.style.scale = (1.06 - Math.abs(distance) * 0.12).toFixed(3);
}

function slidePhoto(card, focusX) {
  const photo = card.querySelector('[data-best-photo]');
  if (!photo) return;
  const box = card.getBoundingClientRect();
  const distance = (box.left + box.width / 2 - focusX) / innerWidth;
  const away = Math.min(1, Math.abs(distance));
  photo.style.transform = `translateX(${(-distance * 11).toFixed(2)}%) scale(${(1.12 - away * 0.1).toFixed(3)})`;
  photo.style.filter = `brightness(${(1 - away * 0.35).toFixed(3)})`;
}

function paintCards(cards) {
  const first = cards[0];
  const focusX = Math.min(innerWidth / 2, first.offsetLeft + first.offsetWidth / 2);
  cards.forEach((card) => {
    tiltBottle(card, focusX);
    slidePhoto(card, focusX);
  });
}

function paint(section, progress) {
  const track = section.querySelector('[data-best-track]');
  const cards = [...track.querySelectorAll('[data-best-card]')];
  const distance = Math.max(0, track.scrollWidth - innerWidth);
  track.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
  section.style.setProperty('--best-progress', progress.toFixed(4));
  const number = Math.min(cards.length, Math.floor(progress * (cards.length - 0.001)) + 1);
  section.querySelector('[data-best-count]').textContent = padNumber(number);
  paintCards(cards);
}

export function animateBestsellers() {
  const section = document.querySelector('[data-bestsellers]');
  if (!section) return;
  onScrollProgress(section, PINNED_RANGE, (progress) => paint(section, progress));
}
