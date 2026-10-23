/*
 * "Familias olfativas": der Bereich bleibt stehen, beim Scrollen wechselt die Familie.
 * Ein Klick auf einen Namen scrollt zu der Stelle, an der diese Familie aktiv ist.
 */
import { onScrollProgress, PINNED_RANGE } from '../../effects/scroll.js';
import { padNumber } from '../../utils/format.js';

function findParts(section) {
  return {
    stage: section.querySelector('[data-families-stage]'),
    names: [...section.querySelectorAll('[data-family-index]')],
    bottles: [...section.querySelectorAll('[data-family-bottle]')],
    details: [...section.querySelectorAll('[data-family-detail]')],
    number: section.querySelector('[data-families-number]'),
  };
}

function showFamily(parts, active) {
  parts.names.forEach((name, index) => name.classList.toggle('is-active', index === active));
  parts.details.forEach((detail, index) => (detail.hidden = index !== active));
  parts.bottles.forEach((bottle, index) => {
    bottle.classList.toggle('is-active', index === active);
    bottle.classList.toggle('is-after', index > active);
  });
  const name = parts.names[active];
  parts.stage.style.setProperty('--family-glow', name.dataset.familyGlow);
  parts.number.textContent = padNumber(active + 1);
}

function scrollToFamily(section, index, count) {
  const travel = section.offsetHeight - innerHeight;
  const top = section.getBoundingClientRect().top + scrollY;
  window.scrollTo({ top: top + ((index + 0.5) / count) * travel, behavior: 'smooth' });
}

function followScroll(section, parts) {
  let active = 0;
  onScrollProgress(section, PINNED_RANGE, (progress) => {
    parts.stage.style.setProperty('--families-progress', progress.toFixed(4));
    const next = Math.min(parts.names.length - 1, Math.floor(progress * parts.names.length));
    if (next !== active) showFamily(parts, (active = next));
  });
}

function bindNames(section, parts, signal) {
  parts.names.forEach((name, index) => {
    const jump = () => scrollToFamily(section, index, parts.names.length);
    name.addEventListener('click', jump, { signal });
  });
}

export function animateFamilies(signal) {
  const section = document.querySelector('[data-families]');
  if (!section) return;
  const parts = findParts(section);
  followScroll(section, parts);
  bindNames(section, parts, signal);
}
