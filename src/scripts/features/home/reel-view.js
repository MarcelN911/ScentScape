/* Zeigt das Video-Karussell: aktive Karte vorne, Nachbarn aufgefächert dahinter. */
import { padNumber } from '../../utils/format.js';

const SHRINK = [0, 0.2, 0.36];
const DIM = [1, 0.55, 0.22];

/** Abstand zur aktiven Karte, im Kreis gerechnet (bei 7 Karten: −3 … 3) */
function offsetOf(index, active, count) {
  let offset = index - active;
  if (offset > count / 2) offset -= count;
  if (offset < -count / 2) offset += count;
  return offset;
}

function placeCard(card, offset) {
  const away = Math.abs(offset);
  card.style.setProperty('--offset', offset);
  card.style.setProperty('--shrink', SHRINK[Math.min(away, 2)]);
  card.style.setProperty('--dim', away > 2 ? 0 : DIM[away]);
  card.style.setProperty('--layer', 10 - away);
  card.classList.toggle('is-active', offset === 0);
  card.classList.toggle('is-far', away > 2);
  card.dataset.cursor = offset === 0 ? 'Play' : 'Ver';
}

export function findReelParts(section) {
  return {
    section,
    stage: section.querySelector('[data-reel-stage]'),
    cards: [...section.querySelectorAll('[data-video-card]')],
    thumbs: [...section.querySelectorAll('[data-video-thumb]')],
    number: section.querySelector('[data-reel-number]'),
    title: section.querySelector('[data-reel-title]'),
  };
}

export function renderReel(parts, active, titles) {
  parts.cards.forEach((card, index) =>
    placeCard(card, offsetOf(index, active, parts.cards.length)),
  );
  parts.thumbs.forEach((thumb, index) => thumb.classList.toggle('is-active', index === active));
  parts.number.textContent = padNumber(active + 1);
  parts.title.textContent = titles[active];
  parts.section.style.setProperty('--reel-progress', 0);
}

export function videoOf(parts, index) {
  return parts.cards[index].querySelector('video');
}
