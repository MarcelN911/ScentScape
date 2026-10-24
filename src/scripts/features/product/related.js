/* "También te puede gustar": Zähler und Balken folgen dem seitlichen Scrollen, Pfeile scrollen 360px. */
import { padNumber } from '../../utils/format.js';

function update(section, track) {
  const max = track.scrollWidth - track.clientWidth;
  const progress = max > 0 ? track.scrollLeft / max : 0;
  const count = track.querySelectorAll('[data-rel-card]').length;
  const number = Math.min(count, Math.round(progress * Math.max(0, count - 1)) + 1);
  section.querySelector('[data-related-num]').textContent = padNumber(number);
  const bar = count ? 100 / count + progress * (100 - 100 / count) : 0;
  section.style.setProperty('--bar', `${bar.toFixed(1)}%`);
}

export function initRelated(signal) {
  const section = document.querySelector('[data-related]');
  const track = section?.querySelector('[data-related-track]');
  if (!track) return;
  track.addEventListener('scroll', () => update(section, track), { passive: true, signal });
  section.querySelectorAll('[data-related-step]').forEach((button) => {
    const left = Number(button.dataset.relatedStep) * 360;
    button.addEventListener('click', () => track.scrollBy({ left }), { signal });
  });
  update(section, track);
}
