/*
 * Bewegung bei der Suche: Karten, die bleiben, gleiten an ihren neuen Platz.
 * Karten, die nicht mehr passen, lösen sich weich auf (durchsichtig, kleiner, unscharf).
 */
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const LEAVE_STYLES = ['position', 'left', 'top', 'width', 'zIndex', 'pointerEvents'];

/** Ist die Karte gerade beim Ausblenden? */
export const isLeaving = (element) => 'leaving' in element.dataset;

/** Bricht das Ausblenden ab und setzt die Karte wieder normal ins Raster. */
export function settle(element) {
  element.leaveAnimation?.cancel();
  element.leaveAnimation = null;
  delete element.dataset.leaving;
  LEAVE_STYLES.forEach((key) => (element.style[key] = ''));
}

const LEAVE_FRAMES = [
  { opacity: 1, transform: 'none', filter: 'blur(0px)' },
  { opacity: 0, transform: 'scale(0.92)', filter: 'blur(6px)' },
];

/** Hält die Karte absolut an ihrem alten Platz fest: sie belegt keinen Platz mehr im Raster. */
function pinInPlace(element, rect, box) {
  Object.assign(element.style, {
    position: 'absolute',
    left: `${rect.left - box.left}px`,
    top: `${rect.top - box.top}px`,
    width: `${rect.width}px`,
    zIndex: '-1',
    pointerEvents: 'none',
  });
}

/**
 * Karte blendet an ihrem alten Platz aus und wird danach versteckt.
 * Die anderen Karten rücken währenddessen schon nach und gleiten über sie hinweg (z-index -1).
 * rect = alter Platz der Karte, box = Platz des Rasters (beides vor dem Umbau gemessen).
 */
export function leave(element, rect, box) {
  element.dataset.leaving = '';
  pinInPlace(element, rect, box);
  const animation = element.animate(LEAVE_FRAMES, {
    duration: 450,
    easing: EASE,
    fill: 'forwards',
  });
  animation.onfinish = () => {
    element.hidden = true;
    settle(element);
  };
  element.leaveAnimation = animation;
}

/** Karten, die nur den Platz wechseln, gleiten vom alten an den neuen Platz. */
export function slide(element, old) {
  const now = element.getBoundingClientRect();
  const dx = old.left - now.left;
  const dy = old.top - now.top;
  if (!dx && !dy) return;
  element.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], {
    duration: 650,
    delay: 60,
    easing: EASE,
    fill: 'backwards',
  });
}
