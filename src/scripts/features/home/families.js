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
    descs: [...section.querySelectorAll('[data-family-desc]')],
    number: section.querySelector('[data-families-number]'),
    line: section.querySelector('[data-families-line]'),
    title: section.querySelector('[data-families-title]'),
  };
}

function markLayers(elements, active) {
  elements.forEach((element, index) => {
    element.classList.toggle('is-active', index === active);
    element.classList.toggle('is-after', index > active);
  });
}

function showFamily(parts, active) {
  parts.names.forEach((name, index) => name.classList.toggle('is-active', index === active));
  markLayers(parts.bottles, active);
  markLayers(parts.descs, active);
  const { familyGlow, familyLine, familyId } = parts.names[active].dataset;
  parts.stage.style.setProperty('--family-glow', familyGlow);
  parts.number.textContent = padNumber(active + 1);
  parts.line.textContent = familyLine;
  parts.title.textContent = familyId;
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
