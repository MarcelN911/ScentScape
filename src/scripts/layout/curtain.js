/*
 * Vorhang beim Laden einer Seite, er öffnet und schließt wie das Menü:
 * Beim Seitenwechsel wächst ein Kreis vom Burger aus über den Bildschirm, dann lädt Astro die neue Seite.
 * Auf der neuen Seite leuchtet der Rand des Kreises auf und schrumpft mit ihm zurück in den Burger.
 * Jede Seite legt an <body> fest, ob der Rand leuchtet (data-curtain-mode: line oder none).
 * Führt der Link zur Startseite, bleibt der Vorhang leer (data-target="home"): dort übernimmt das Intro.
 */
import { burgerCircle, circleClip, EASE_CIRCLE } from '../utils/burger-circle.js';
import { prefersReducedMotion } from '../utils/motion.js';

/* Gleiche Zeiten wie das Menü (MobileMenu.astro): öffnen 0,9 s, schließen 0,75 s */
const COVER_MS = 900;
const REVEAL_MS = 750;
/* So lange bleibt der Bildschirm ganz zu, bevor der Kreis schrumpft */
const HOLD_MS = 300;

/* Radien von groß nach klein (schrumpfen) oder von klein nach groß (wachsen) */
function radii(circle, grow) {
  return grow ? [0, circle.r] : [circle.r, 0];
}

function clipFrames(circle, grow) {
  return radii(circle, grow).map((radius) => ({ clipPath: circleClip(circle, radius) }));
}

/*
 * Der Rand sitzt auf der Kante der Blende und schrumpft genau mit ihr.
 * Er leuchtet erst während des Schrumpfens auf: in der Pause davor sähe er aus wie ein Vorhang,
 * der noch nicht ganz ausgefahren ist.
 */
function shrinkRim(curtain, circle, timing) {
  const rim = curtain.querySelector('[data-curtain-rim]');
  rim.style.left = `${circle.x}px`;
  rim.style.top = `${circle.y}px`;
  const [from, to] = radii(circle, false).map((radius) => `${radius * 2}px`);
  const frames = [
    { width: from, opacity: 0 },
    { opacity: 1, offset: 0.3 },
    { width: to, opacity: 1 },
  ];
  rim.animate(frames, timing);
}

async function reveal(curtain) {
  curtain.dataset.mode = document.body.dataset.curtainMode ?? 'line';
  const circle = burgerCircle();
  const timing = { duration: REVEAL_MS, delay: HOLD_MS, easing: EASE_CIRCLE, fill: 'both' };
  if (curtain.dataset.mode !== 'none') shrinkRim(curtain, circle, timing);
  await curtain.animate(clipFrames(circle, false), timing).finished;
}

/* Die Startseite hat ein eigenes Intro, dort ist der Vorhang beim ersten Laden sofort weg. */
function revealFirstPage(curtain) {
  if (document.body.dataset.curtainMode !== 'none') return reveal(curtain);
  curtain.animate(clipFrames(burgerCircle(), false), { duration: 1, fill: 'forwards' });
}

/* Alte Animationen weg: sonst leuchtet beim Zuziehen noch der Rand der letzten Seite. */
function reset(curtain) {
  const rim = curtain.querySelector('[data-curtain-rim]');
  [curtain, rim].forEach((element) => element.getAnimations().forEach((a) => a.cancel()));
}

/* Beim Seitenwechsel wächst eine leere Fläche; der Rand leuchtet erst auf der neuen Seite. */
function coverBeforeLoading(curtain, event) {
  const loadPage = event.loader;
  event.loader = async () => {
    reset(curtain);
    curtain.dataset.target = event.to.pathname === '/' ? 'home' : 'page';
    const timing = { duration: COVER_MS, easing: EASE_CIRCLE, fill: 'forwards' };
    const cover = curtain.animate(clipFrames(burgerCircle(), true), timing).finished;
    await Promise.all([cover, loadPage()]);
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
