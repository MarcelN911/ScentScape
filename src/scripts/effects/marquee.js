/*
 * Endloses Band (Noten im Shop und im Quiz, Aktionsleiste). Läuft von selbst, unter der Maus fast still,
 * mit der Maus oder dem Finger lässt es sich ziehen. Ein Ziehen löst keinen Klick aus.
 * Nach dem Loslassen läuft es immer weiter, auch wenn der Browser die Geste übernimmt (pointercancel).
 */
import { prefersReducedMotion } from '../utils/motion.js';

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

/*
 * Folgt Maus oder Finger bis zum Loslassen. Alle Listener hängen an einem Signal und verschwinden zusammen.
 * pointercancel: der Browser scrollt stattdessen die Seite, das Ziehen ist dann auch vorbei.
 */
function followPointer(band, start) {
  const drag = new AbortController();
  const options = { signal: drag.signal };
  const stop = () => {
    drag.abort();
    setDragging(band, false);
  };
  addEventListener('pointermove', (moveEvent) => dragTo(band, start, moveEvent), options);
  addEventListener('pointerup', stop, options);
  addEventListener('pointercancel', stop, options);
}

function startDrag(band, event) {
  if (event.button > 0) return;
  band.moved = false;
  setDragging(band, true);
  followPointer(band, { x: event.clientX, time: band.animation.currentTime ?? 0 });
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
  /* Nur eine echte Maus bremst: ein Finger löst beim Tippen kein "Verlassen" aus */
  const pause = (paused) => (event) => {
    if (event.pointerType !== 'mouse') return;
    band.paused = paused;
    refresh(band);
  };
  on('pointerenter', pause(true));
  on('pointerleave', pause(false));
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
