/*
 * Waagerechte Leisten mit [data-drag-scroll] lassen sich mit der Maus ziehen.
 * Wer gezogen hat, löst danach keinen Klick auf einen Link aus.
 */
const DRAG_THRESHOLD = 6;

function startDrag(track, event) {
  if (event.pointerType !== 'mouse' || event.button !== 0) return;
  track.dataset.dragStartX = String(event.clientX);
  track.dataset.dragStartScroll = String(track.scrollLeft);
  track.dataset.dragMoved = '';
  track.classList.add('is-dragging');
}

function moveDrag(track, event) {
  if (!track.classList.contains('is-dragging')) return;
  const distance = event.clientX - Number(track.dataset.dragStartX);
  if (Math.abs(distance) > DRAG_THRESHOLD) track.dataset.dragMoved = 'true';
  track.scrollLeft = Number(track.dataset.dragStartScroll) - distance;
}

function blockClickAfterDrag(track, event) {
  if (!track.dataset.dragMoved) return;
  event.preventDefault();
  event.stopPropagation();
}

function bindTrack(track, signal) {
  const options = { signal };
  track.addEventListener('pointerdown', (event) => startDrag(track, event), options);
  window.addEventListener('pointermove', (event) => moveDrag(track, event), options);
  window.addEventListener('pointerup', () => track.classList.remove('is-dragging'), options);
  track.addEventListener('click', (event) => blockClickAfterDrag(track, event), {
    signal,
    capture: true,
  });
}

export function initDragScroll(signal) {
  document.querySelectorAll('[data-drag-scroll]').forEach((track) => bindTrack(track, signal));
}
