/* Schwebende Vorschaukarte in der Listenansicht: folgt der Maus mit leichter Verzögerung und Neigung. */
import { noteMarkSvg } from '../../utils/note-mark.js';

const follow = { x: 0, y: 0, cardX: 0, cardY: 0, frame: 0 };

function fillNotes(card, data) {
  const template = card.querySelector('[data-preview-note]');
  const notes = data.notes.map((note) => {
    const chip = template.content.firstElementChild.cloneNode(true);
    chip.firstElementChild.innerHTML = noteMarkSvg(
      note,
      data.accent === '#61031b' ? '#f0be91' : data.accent,
    );
    chip.lastElementChild.textContent = note;
    return chip;
  });
  card.querySelector('[data-preview-notes]').replaceChildren(...notes);
}

function fill(card, data) {
  card.querySelector('[data-preview-image]').src = data.image;
  card.classList.toggle('is-cover', data.cover);
  ['eyebrow', 'meta', 'name', 'description', 'price', 'sizes'].forEach((field) => {
    card.querySelector(`[data-preview-${field}]`).textContent = data[field];
  });
  fillNotes(card, data);
}

function position(card) {
  const dx = follow.x - follow.cardX;
  follow.cardX += dx * 0.14;
  follow.cardY += (follow.y - follow.cardY) * 0.14;
  const width = card.offsetWidth || 320;
  const height = card.offsetHeight || 480;
  const flip = follow.cardX + 40 + width > innerWidth - 16;
  const x = flip ? follow.cardX - width - 40 : follow.cardX + 40;
  const y = Math.max(16, Math.min(innerHeight - height - 16, follow.cardY - height / 2));
  const tilt = Math.max(-6, Math.min(6, dx * 0.04));
  card.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt.toFixed(2)}deg)`;
}

function loop(card) {
  position(card);
  follow.frame = card.classList.contains('is-visible')
    ? requestAnimationFrame(() => loop(card))
    : 0;
}

function show(card, row) {
  fill(card, JSON.parse(row.dataset.listPreview));
  card.classList.add('is-visible');
  follow.frame ||= requestAnimationFrame(() => loop(card));
}

export function initListPreview(root, signal) {
  const card = root.querySelector('[data-list-preview-card]');
  const track = (event) => Object.assign(follow, { x: event.clientX, y: event.clientY });
  addEventListener('mousemove', track, { passive: true, signal });
  root.querySelectorAll('[data-list-preview]').forEach((row) => {
    row.addEventListener('mouseenter', () => show(card, row), { signal });
    row.addEventListener('mouseleave', () => card.classList.remove('is-visible'), { signal });
  });
}
