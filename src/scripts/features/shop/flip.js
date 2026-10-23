/*
 * FLIP-Animation: Positionen merken (First), Liste ändern (Last), Unterschied ausgleichen (Invert)
 * und weich an den neuen Platz gleiten lassen (Play). Neue Karten kommen von unten herein.
 */
const EASE = 'cubic-bezier(.2,.7,.2,1)';
const ENTER = [
  { opacity: 0, translate: '0 40px', scale: '.88', rotate: '2deg' },
  { opacity: 1, translate: '0 0', scale: '1', rotate: '0deg' },
];

export function capturePositions(panel) {
  const positions = new Map();
  panel.querySelectorAll('[data-shop-item]:not([hidden])').forEach((item) => {
    positions.set(item.dataset.key, item.getBoundingClientRect());
  });
  return positions;
}

function glide(item, before) {
  const after = item.getBoundingClientRect();
  const dx = before.left - after.left;
  const dy = before.top - after.top;
  if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
  item.animate([{ translate: `${dx}px ${dy}px` }, { translate: '0 0' }], {
    duration: 700,
    easing: EASE,
  });
}

export function playFlip(panel, positions) {
  let entering = 0;
  panel.querySelectorAll('[data-shop-item]:not([hidden])').forEach((item) => {
    const before = positions.get(item.dataset.key);
    if (before) return glide(item, before);
    const delay = (entering += 1) * 45;
    item.animate(ENTER, { duration: 650, delay, easing: EASE, fill: 'backwards' });
  });
}
