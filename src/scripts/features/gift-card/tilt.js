/* Die Karte folgt der Maus (leichtes Kippen und Lichtreflex). */
function follow(card, stage, event) {
  const box = stage.getBoundingClientRect();
  const x = (event.clientX - box.left) / box.width;
  const y = (event.clientY - box.top) / box.height;
  card.classList.add('is-tracking');
  card.style.setProperty('--rx', `${((x - 0.5) * 18).toFixed(2)}deg`);
  card.style.setProperty('--ry', `${((0.5 - y) * 14).toFixed(2)}deg`);
  card.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
  card.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
}

function release(card) {
  card.classList.remove('is-tracking');
  card.style.setProperty('--rx', '0deg');
  card.style.setProperty('--ry', '0deg');
}

export function bindCardTilt(root, signal) {
  const stage = root.querySelector('[data-gift-stage]');
  const card = root.querySelector('[data-gift-card]');
  stage.addEventListener('pointermove', (event) => follow(card, stage, event), { signal });
  stage.addEventListener('pointerleave', () => release(card), { signal });
}
