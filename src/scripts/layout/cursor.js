/* Eigener Mauszeiger: folgt der Maus mit Verzögerung, wird über Links größer und zeigt Labels (data-cursor). */
import { hasFinePointer } from '../utils/motion.js';

const INTERACTIVE = 'a, button, select, input, textarea, label, [data-cursor]';
const pointer = { x: -100, y: -100, dotX: -100, dotY: -100, label: '', hover: false };

function labelFor(target) {
  const interactive = target.closest?.(INTERACTIVE);
  const labelled = interactive?.closest('[data-cursor]');
  const isInnerButton = interactive?.tagName === 'BUTTON' && interactive !== labelled;
  return {
    hover: Boolean(interactive),
    label: labelled && !isInnerButton ? labelled.dataset.cursor : '',
  };
}

function onMove(event) {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  Object.assign(pointer, labelFor(event.target));
}

function render(dot) {
  pointer.dotX += (pointer.x - pointer.dotX) * 0.22;
  pointer.dotY += (pointer.y - pointer.dotY) * 0.22;
  dot.style.transform = `translate3d(${pointer.dotX}px, ${pointer.dotY}px, 0)`;
  dot.classList.toggle('is-hover', pointer.hover);
  dot.classList.toggle('is-label', Boolean(pointer.label));
  if (dot.textContent !== pointer.label) dot.textContent = pointer.label;
  requestAnimationFrame(() => render(dot));
}

export function initCursor() {
  const dot = document.querySelector('[data-cursor-dot]');
  if (!dot || !hasFinePointer() || innerWidth < 820) return;
  dot.classList.add('is-active');
  addEventListener('mousemove', onMove, { passive: true });
  render(dot);
}
