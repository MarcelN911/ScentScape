/*
 * Endloses Band mit den 16 Noten. Läuft von selbst, beim Hovern fast still,
 * mit der Maus oder dem Finger lässt es sich ziehen. Ein Ziehen löst keinen Klick aus.
 */
import { prefersReducedMotion } from '../../utils/motion.js';

function speed(band) {
  if (band.dragging) return 0;
  if (band.paused) return 0.15;
  return prefersReducedMotion() ? 0.35 : 1;
}

function refresh(band) {
  band.animation.playbackRate = speed(band);
}

function startAnimation(track) {
  const frames = [{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }];
  return track.animate(frames, {
    duration: Math.max(20000, track.scrollWidth * 14),
    iterations: Infinity,
  });
}

function dragTo(band, start, event) {
  const duration = band.animation.effect.getTiming().duration;
  const half = band.track.scrollWidth / 2 || 1;
  const dx = event.clientX - start.x;
  if (Math.abs(dx) > 5) band.moved = true;
  band.animation.currentTime =
    (((start.time - (dx / half) * duration) % duration) + duration) % duration;
}

function setDragging(band, dragging) {
  band.dragging = dragging;
  band.viewport.classList.toggle('is-grabbing', dragging);
  refresh(band);
}

function startDrag(band, event) {
  if (event.button > 0) return;
  const start = { x: event.clientX, time: band.animation.currentTime ?? 0 };
  band.moved = false;
  setDragging(band, true);
  const move = (moveEvent) => dragTo(band, start, moveEvent);
  const stop = () => {
    removeEventListener('pointermove', move);
    setDragging(band, false);
  };
  addEventListener('pointermove', move);
  addEventListener('pointerup', stop, { once: true });
}

function swallowClickAfterDrag(band, event) {
  if (!band.moved) return;
  event.preventDefault();
  event.stopPropagation();
  band.moved = false;
}

function bindBand(band, signal) {
  const on = (type, handler, options) =>
    band.viewport.addEventListener(type, handler, { signal, ...options });
  const pause = (paused) => () => {
    band.paused = paused;
    refresh(band);
  };
  on('mouseenter', pause(true));
  on('mouseleave', pause(false));
  on('pointerdown', (event) => startDrag(band, event));
  on('click', (event) => swallowClickAfterDrag(band, event), { capture: true });
  on('dragstart', (event) => event.preventDefault());
}

export function initMarquee(root, signal) {
  const viewport = root.querySelector('[data-marquee]');
  const track = viewport?.querySelector('[data-marquee-track]');
  if (!track?.animate) return;
  const band = {
    viewport,
    track,
    animation: startAnimation(track),
    paused: false,
    dragging: false,
  };
  bindBand(band, signal);
  signal.addEventListener('abort', () => band.animation.cancel());
}
