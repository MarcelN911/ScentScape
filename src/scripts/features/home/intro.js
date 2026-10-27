/*
 * Intro der Startseite. Das Logo steht 3 s, dann schließt sich das Intro wie das Menü:
 * ein Kreis schrumpft in den Burger-Knopf, dahinter wird das Hero-Video sichtbar.
 * Klick oder Taste überspringt die Pause. Während des Intros ist das Scrollen gesperrt.
 * Kommt man von einer anderen Seite, liegt der leere Vorhang darunter (curtain.js),
 * dann blendet das Intro weich darüber ein, damit es wie ein einziger Ladescreen wirkt.
 */
import { burgerCircle, circleClip, EASE_CIRCLE } from '../../utils/burger-circle.js';
import { prefersReducedMotion } from '../../utils/motion.js';
import { lockScroll } from '../../utils/scroll-lock.js';

const HOLD = 3000;
/* Gleiche Zeit wie beim Schließen des Menüs */
const CLOSE = 750;
const VIDEO_ZOOM = 'scale(1.1)';
const FADE_IN = 400;

function cameFromOtherPage() {
  return document.querySelector('[data-curtain]')?.dataset.target === 'home';
}

function finish(parts, state) {
  clearTimeout(state.timer);
  lockScroll('intro', false);
  parts.video?.style.removeProperty('transform');
  parts.intro.classList.add('is-done');
  parts.hero?.classList.add('is-in');
}

/* Kreis schrumpft in den Burger, das Video zoomt dabei leicht heraus */
function close(parts, state) {
  if (state.closing) return;
  state.closing = true;
  clearTimeout(state.timer);
  const circle = burgerCircle();
  const timing = { duration: CLOSE, easing: EASE_CIRCLE, fill: 'forwards' };
  const shrink = [circle.r, 0].map((radius) => ({ clipPath: circleClip(circle, radius) }));
  parts.video?.animate([{ transform: VIDEO_ZOOM }, { transform: 'none' }], timing);
  state.timer = setTimeout(() => parts.hero?.classList.add('is-in'), CLOSE / 2);
  parts.intro.animate(shrink, timing).finished.then(() => finish(parts, state));
}

/* Logo und Claim leuchten auf; nach einem Seitenwechsel blendet das ganze Intro weich ein */
function lightUp(intro) {
  if (cameFromOtherPage()) intro.animate([{ opacity: 0 }, { opacity: 1 }], FADE_IN);
  requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add('is-lit')));
}

function findParts(intro) {
  return {
    intro,
    video: document.querySelector('[data-hero-video]'),
    hero: document.querySelector('[data-hero]'),
  };
}

export function initIntro(signal) {
  const intro = document.querySelector('[data-intro]');
  if (!intro) return;
  const parts = findParts(intro);
  const state = { closing: false, timer: 0 };
  if (prefersReducedMotion()) return finish(parts, state);
  lockScroll('intro', true);
  parts.video?.style.setProperty('transform', VIDEO_ZOOM);
  lightUp(intro);
  state.timer = setTimeout(() => close(parts, state), HOLD);
  intro.addEventListener('click', () => close(parts, state), { signal });
  addEventListener('keydown', () => close(parts, state), { signal });
  signal.addEventListener('abort', () => finish(parts, state));
}
