/*
 * Intro der Startseite. 3 s Pause, dann 2,4 s Zoom durch das Logo. Klick oder Taste überspringt die Pause.
 * Während des Intros ist das Scrollen gesperrt.
 */
import { clamp, prefersReducedMotion } from '../../utils/motion.js';

const HOLD = 3000;
const ZOOM = 2400;
const [ORIGIN_X, ORIGIN_Y] = [737, 359];

const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (t) => t * t * (3 - 2 * t);

/** Alle Werte eines Frames aus dem Fortschritt 0 … 1 */
function frameOf(progress) {
  const p = progress * 0.7;
  const zoom = clamp(p / 0.44);
  return {
    scale: Math.pow(121, Math.pow(zoom, 1.35)),
    videoScale: 1.25 - smooth(zoom) * 0.25,
    logo: 1 - clamp(p / 0.3),
    svg: 1 - clamp((p - 0.46) / 0.2),
    fine: 1 - clamp(p * 6),
    sheen: p <= 0.01,
  };
}

function paint(parts, frame) {
  const scale = frame.scale.toFixed(3);
  const transform = `translate(${ORIGIN_X} ${ORIGIN_Y}) scale(${scale}) translate(${-ORIGIN_X} ${-ORIGIN_Y})`;
  parts.zooms.forEach((group) => group.setAttribute('transform', transform));
  parts.logos.forEach((group) => group.setAttribute('opacity', frame.logo.toFixed(3)));
  parts.fine.forEach((element) => (element.style.opacity = frame.fine.toFixed(2)));
  parts.svg.style.opacity = frame.svg.toFixed(3);
  parts.sheen.style.display = frame.sheen ? '' : 'none';
  parts.video?.style.setProperty('transform', `scale(${frame.videoScale.toFixed(3)})`);
}

function findParts(intro) {
  return {
    intro,
    svg: intro.querySelector('[data-intro-svg]'),
    zooms: intro.querySelectorAll('[data-intro-zoom]'),
    logos: intro.querySelectorAll('[data-intro-logo]'),
    fine: intro.querySelectorAll('[data-intro-fine]'),
    sheen: intro.querySelector('[data-intro-sheen]'),
    video: document.querySelector('[data-hero-video]'),
    hero: document.querySelector('[data-hero]'),
  };
}

function finish(parts, state) {
  cancelAnimationFrame(state.frame);
  document.documentElement.style.overflow = '';
  paint(parts, frameOf(1));
  parts.intro.classList.add('is-done');
  parts.hero?.classList.add('is-in');
}

function step(parts, state, now) {
  const progress = clamp((now - state.start - HOLD) / ZOOM);
  const eased = easeInOut(progress);
  paint(parts, frameOf(eased));
  if (eased > 0.82) parts.hero?.classList.add('is-in');
  if (progress >= 1) return finish(parts, state);
  state.frame = requestAnimationFrame((time) => step(parts, state, time));
}

function skipPause(state) {
  const elapsed = performance.now() - state.start;
  if (elapsed < HOLD) state.start = performance.now() - HOLD;
}

export function initIntro(signal) {
  const intro = document.querySelector('[data-intro]');
  if (!intro) return;
  const parts = findParts(intro);
  const state = { start: performance.now(), frame: 0 };
  if (prefersReducedMotion()) return finish(parts, state);
  document.documentElement.style.overflow = 'hidden';
  requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add('is-lit')));
  state.frame = requestAnimationFrame((time) => step(parts, state, time));
  intro.addEventListener('click', () => skipPause(state), { signal });
  addEventListener('keydown', () => skipPause(state), { signal });
  signal.addEventListener('abort', () => finish(parts, state));
}
