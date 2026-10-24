/*
 * Vorhang beim Laden einer Seite: eine Lichtlinie wächst, dann zieht sich der Vorhang nach oben zurück.
 * Beim Seitenwechsel fällt er zuerst von oben herab, dann lädt Astro die neue Seite.
 * Jede Seite legt an <body> fest, wo die Linie steht (data-curtain-x) und wie sie aussieht (data-curtain-mode).
 */
import { prefersReducedMotion } from '../utils/motion.js';

const EASE_CURTAIN = 'cubic-bezier(0.7, 0, 0.2, 1)';
const EASE_LINE = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const OPEN = 'inset(0% 0% 0% 0%)';
const GONE = 'inset(0% 0% 100% 0%)';

function applyPageSettings(curtain) {
  const { curtainX = '50%', curtainMode = 'line' } = document.body.dataset;
  const wide = matchMedia('(min-width: 900px)').matches;
  curtain.dataset.mode = curtainMode;
  curtain.style.setProperty('--curtain-x', wide ? curtainX : '50%');
}

function growLine(curtain) {
  const line = curtain.querySelector('[data-curtain-line]');
  const size = curtain.dataset.mode === 'row' ? 'width' : 'height';
  const end = size === 'width' ? '100vw' : '100vh';
  const frames = [{ [size]: '0' }, { [size]: end }];
  line.animate(frames, { duration: 600, easing: EASE_LINE, fill: 'forwards' });
}

function clip(curtain, frames, timing) {
  const keyframes = frames.map((clipPath) => ({ clipPath }));
  const options = { duration: 1100, easing: EASE_CURTAIN, fill: 'forwards', ...timing };
  return curtain.animate(keyframes, options).finished;
}

async function reveal(curtain) {
  applyPageSettings(curtain);
  if (curtain.dataset.mode !== 'none') growLine(curtain);
  await clip(curtain, [OPEN, GONE], { delay: 350 });
}

/* Die Startseite hat ein eigenes Intro, dort ist der Vorhang beim ersten Laden sofort weg. */
function revealFirstPage(curtain) {
  if (document.body.dataset.curtainMode !== 'none') return reveal(curtain);
  clip(curtain, [GONE, GONE], { duration: 1 });
}

function coverBeforeLoading(curtain, event) {
  const loadPage = event.loader;
  event.loader = async () => {
    await Promise.all([clip(curtain, [GONE, OPEN], { duration: 700 }), loadPage()]);
  };
}

export function initCurtain() {
  const curtain = document.querySelector('[data-curtain]');
  if (!curtain) return;
  if (prefersReducedMotion()) return curtain.remove();
  revealFirstPage(curtain);
  document.addEventListener('astro:before-preparation', (event) =>
    coverBeforeLoading(curtain, event),
  );
  document.addEventListener('astro:after-swap', () => reveal(curtain));
}
