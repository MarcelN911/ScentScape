/*
 * Karussell anfassen und wischen (Finger oder Maus): Die Karten folgen der Bewegung,
 * beim Loslassen dreht es mit dem Schwung des Wischens in diese Richtung weiter.
 * Senkrecht wischen scrollt weiter die Seite (touch-action: pan-y im CSS).
 */
import { CAROUSEL } from '../../../data/reviews.js';

const CLICK_SLOP = 6; // ab so vielen Pixeln gilt es als Wischen, nicht als Klick
const STILL_MS = 120; // so lange nicht bewegt vor dem Loslassen = kein Schwung

function start(spin, event) {
  if (event.button > 0) return;
  spin.drag = {
    id: event.pointerId,
    startX: event.clientX,
    startPos: spin.pos,
    x: event.clientX,
    time: event.timeStamp,
    velocity: 0,
    moved: false,
  };
}

/** Geschwindigkeit in Karten pro Sekunde, leicht geglättet */
function trackVelocity(drag, event, spacing) {
  const seconds = Math.max(0.001, (event.timeStamp - drag.time) / 1000);
  const cardsMoved = -(event.clientX - drag.x) / spacing;
  drag.velocity = drag.velocity * 0.5 + (cardsMoved / seconds) * 0.5;
  drag.x = event.clientX;
  drag.time = event.timeStamp;
}

function move(spin, event) {
  const { drag } = spin;
  if (!drag || event.pointerId !== drag.id) return;
  const spacing = spin.spacing || 200;
  trackVelocity(drag, event, spacing);
  if (!drag.moved && Math.abs(event.clientX - drag.startX) > CLICK_SLOP) {
    drag.moved = true;
    spin.region.setPointerCapture(drag.id);
    spin.region.classList.add('is-dragging');
  }
  if (drag.moved) spin.pos = drag.startPos - (event.clientX - drag.startX) / spacing;
}

function end(spin, event) {
  const { drag } = spin;
  if (!drag || event.pointerId !== drag.id) return;
  spin.drag = null;
  spin.region.classList.remove('is-dragging');
  if (!drag.moved) return;
  spin.suppressClick = true;
  const fresh = event.timeStamp - drag.time < STILL_MS;
  const speed = fresh ? Math.abs(drag.velocity) : 0;
  if (speed > 0.05) spin.dir = Math.sign(drag.velocity);
  spin.boost = Math.min(CAROUSEL.maxBoost, speed);
}

/* Nach dem Wischen keinen Klick auf eine Karte auslösen */
function blockClick(spin, event) {
  if (!spin.suppressClick) return;
  spin.suppressClick = false;
  event.preventDefault();
  event.stopPropagation();
}

export function bindDrag(spin, signal) {
  const { region } = spin;
  const options = { signal };
  region.addEventListener('pointerdown', (event) => start(spin, event), options);
  region.addEventListener('pointermove', (event) => move(spin, event), options);
  region.addEventListener('pointerup', (event) => end(spin, event), options);
  region.addEventListener('pointercancel', (event) => end(spin, event), options);
  region.addEventListener('click', (event) => blockClick(spin, event), { signal, capture: true });
  // Bilder und Links nicht vom Browser "mitziehen" lassen
  region.addEventListener('dragstart', (event) => event.preventDefault(), options);
}
