/*
 * Schreibt die Mausposition als CSS-Variablen --mx und --my (-0.5 bis 0.5) an <html>.
 * Damit bewegen sich Parallax-Elemente rein per CSS.
 */
let frame = 0;
let pointer = { x: 0, y: 0 };

function write() {
  frame = 0;
  document.documentElement.style.setProperty('--mx', pointer.x.toFixed(3));
  document.documentElement.style.setProperty('--my', pointer.y.toFixed(3));
}

function onMove(event) {
  pointer = { x: event.clientX / innerWidth - 0.5, y: event.clientY / innerHeight - 0.5 };
  frame ||= requestAnimationFrame(write);
}

export function initPointerVars() {
  if (!matchMedia('(hover: hover)').matches) return;
  addEventListener('mousemove', onMove, { passive: true });
}
