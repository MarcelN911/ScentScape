/*
 * Bereiche "Test Olfativo" und "Gift Card": Fortschritt beim Scrollen → CSS-Variablen.
 * Die Formeln stammen aus der Vorlage (renderVals → panel()).
 * Die Maus verschiebt die Grafik leicht und kippt die Gift Card.
 */
import {
  easeOut as ease,
  onScrollProgress,
  PINNED_RANGE,
  VISIBLE_RANGE,
} from '../../effects/scroll.js';
import { clamp } from '../../utils/motion.js';

const mouse = { x: 0, y: 0 };

function setVars(element, vars) {
  Object.entries(vars).forEach(([name, value]) => element.style.setProperty(`--${name}`, value));
}

/** Gemeinsame Werte beider Panels: rv = aufgedeckt, t = Inhalt, wordShift = Wanderung des Hintergrundworts */
function panelVars(rv, t, wordShift) {
  return {
    clip: `${((1 - rv) * 100).toFixed(2)}%`,
    wx: (6 - clamp(wordShift, 0, 1.5) * 26).toFixed(2),
    line: Math.round(20 + ease(t) * 40),
    ty1: (110 * (1 - ease(clamp((rv - 0.35) / 0.5)))).toFixed(1),
    ty2: (110 * (1 - ease(clamp((rv - 0.5) / 0.5)))).toFixed(1),
    dop: ease(clamp((rv - 0.7) / 0.3)).toFixed(2),
    dy: Math.round((1 - ease(clamp((rv - 0.6) / 0.4))) * 30),
    vx: Math.round(mouse.x * -14),
    vy: Math.round(mouse.y * -10 + (1 - rv) * 80),
  };
}

/* Die Pyramide baut sich von unten auf: Fondo zuerst, Salida zuletzt */
function paintTiers(section, t) {
  section.querySelectorAll('[data-tier]').forEach((tier, k) => {
    tier.style.setProperty('--e', ease(clamp(t * 2.2 - (2 - k) * 0.4)).toFixed(2));
  });
}

function paintTest(section, progress) {
  const u = ((progress - 0.1) / 0.9) * 1.25 - 0.25;
  const rv = ease(clamp((u + 0.25) / 0.25));
  const t = clamp((u + 0.1) / 0.6);
  const intro = clamp(progress / 0.1);
  setVars(section, {
    ...panelVars(rv, t, u + 0.25),
    'intro-op': (1 - intro * 0.6).toFixed(2),
    'intro-scale': (1 + intro * 0.12).toFixed(3),
    'bar-op': progress > 0.08 && progress < 0.999 ? 1 : 0,
    bar: (clamp((u + 0.25) / 1.25) * 100).toFixed(1),
  });
  paintTiers(section, t);
}

function paintGift(section, q) {
  const rv = ease(clamp((q - 0.06) / 0.22));
  const t = clamp((q - 0.1) / 0.4);
  setVars(section, { ...panelVars(rv, t, (q - 0.1) * 3), clip: '0%' });
  setVars(section.querySelector('[data-story-gift]'), {
    gry: (mouse.x * 22 - (1 - ease(t)) * 50).toFixed(1),
    grx: (-mouse.y * 14 + 6).toFixed(1),
    gy: Math.round((1 - ease(t)) * 40),
    shine: Math.round(100 - (mouse.x + 1) * 50),
  });
}

const STORIES = [
  { kind: 'test', range: PINNED_RANGE, paint: paintTest },
  { kind: 'gift', range: VISIBLE_RANGE, paint: paintGift },
];

function followMouse(section, repaint, signal) {
  const pin = section.querySelector('[data-story-pin]');
  pin.addEventListener(
    'mousemove',
    (event) => {
      mouse.x = (event.clientX / innerWidth) * 2 - 1;
      mouse.y = (event.clientY / innerHeight) * 2 - 1;
      requestAnimationFrame(repaint);
    },
    { signal },
  );
}

/** Läuft innerhalb von withGsap(). */
export function animateStories(signal) {
  STORIES.forEach(({ kind, range, paint }) => {
    const section = document.querySelector(`[data-story="${kind}"]`);
    if (!section) return;
    let last = 0;
    onScrollProgress(section, range, (progress) => paint(section, (last = progress)));
    followMouse(section, () => paint(section, last), signal);
  });
}

function pickColor(root, button) {
  const color = JSON.parse(button.dataset.cardColor);
  setVars(root, {
    'card-bg': color.background,
    'card-ink': color.ink,
    'card-accent': color.accent,
    'card-border': color.border,
    'card-logo': color.logo,
  });
  root
    .querySelectorAll('[data-card-color]')
    .forEach((chip) => chip.classList.toggle('is-active', chip === button));
}

/** Farbwahl der Gift Card */
export function initStoryColors(signal) {
  const root = document.querySelector('[data-story-gift]');
  root?.querySelectorAll('[data-card-color]').forEach((button) => {
    button.addEventListener('click', () => pickColor(root, button), { signal });
  });
}
