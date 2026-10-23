/*
 * Vorhang mit Logo: beim ersten Laden und bei jedem Seitenwechsel.
 * Beim Wechsel fährt er zuerst zu, dann lädt Astro die neue Seite, dann fährt er nach oben weg.
 */
import { prefersReducedMotion, wait } from '../utils/motion.js';

const EASE = 'cubic-bezier(0.2, 0.7, 0.2, 1)';
const EASE_CURTAIN = 'cubic-bezier(0.7, 0, 0.3, 1)';

const LOGO_FRAMES = [
  { opacity: 0, transform: 'translateY(16px) scale(.94)', filter: 'blur(8px)' },
  { opacity: 1, transform: 'none', filter: 'blur(0)' },
];
const BAR_FRAMES = [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }];

function animateMark(curtain, delay, duration) {
  const options = { duration, delay, easing: EASE, fill: 'both' };
  curtain.querySelector('[data-curtain-logo]').animate(LOGO_FRAMES, options);
  curtain
    .querySelector('[data-curtain-bar]')
    .animate(BAR_FRAMES, { ...options, duration: duration + 200 });
}

function slide(curtain, from, to, duration) {
  const frames = [{ transform: `translateY(${from})` }, { transform: `translateY(${to})` }];
  return curtain.animate(frames, { duration, easing: EASE_CURTAIN, fill: 'forwards' }).finished;
}

async function cover(curtain) {
  animateMark(curtain, 250, 650);
  await slide(curtain, '100%', '0%', 550);
}

function coverBeforeLoading(curtain, event) {
  const loadPage = event.loader;
  event.loader = async () => {
    await cover(curtain);
    await loadPage();
  };
}

async function reveal(curtain) {
  await wait(120);
  await slide(curtain, '0%', '-100%', 550);
}

async function playIntro(curtain) {
  animateMark(curtain, 100, 900);
  await wait(1400);
  await slide(curtain, '0%', '-100%', 900);
}

export function initCurtain() {
  const curtain = document.querySelector('[data-curtain]');
  if (!curtain) return;
  if (prefersReducedMotion()) return curtain.remove();
  playIntro(curtain);
  document.addEventListener('astro:before-preparation', (event) =>
    coverBeforeLoading(curtain, event),
  );
  document.addEventListener('astro:after-swap', () => reveal(curtain));
}
