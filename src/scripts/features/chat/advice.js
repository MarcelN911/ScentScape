/*
 * Bereich "Te asesoramos" (Produktseite, Servicios): Werte beim Hereinscrollen.
 * p = Fortschritt von "taucht unten auf" bis "verschwindet oben". Formeln aus der Vorlage (contactFx).
 */
import { easeOut as ease, onScrollProgress, VISIBLE_RANGE } from '../../effects/scroll.js';
import { clamp } from '../../utils/motion.js';
import { initChat } from './questions.js';

function headVars(p) {
  const t = ease(clamp((p - 0.05) / 0.2));
  const buttons = ease(clamp((p - 0.32) / 0.12));
  return {
    line: Math.round(10 + t * 30),
    'bg-y': Math.round((p - 0.5) * -240),
    t1: (110 * (1 - t)).toFixed(1),
    t2: (110 * (1 - ease(clamp((p - 0.09) / 0.2)))).toFixed(1),
    to: ease(clamp((p - 0.12) / 0.15)).toFixed(2),
    bo: buttons.toFixed(2),
    by: Math.round((1 - buttons) * 24),
  };
}

function phoneVars(p) {
  const c = ease(clamp((p - 0.08) / 0.3));
  return {
    'phone-o': clamp(c * 1.6).toFixed(2),
    'phone-y': Math.round((1 - c) * 260 + (p - 0.5) * -60),
    'phone-rx': ((1 - c) * 58).toFixed(2),
    'phone-ry': ((1 - c) * -18).toFixed(2),
    'phone-rz': ((1 - c) * 8).toFixed(2),
    glow: (0.6 + c * 0.5).toFixed(3),
  };
}

function paint(section, p) {
  const vars = { ...headVars(p), ...phoneVars(p) };
  Object.entries(vars).forEach(([name, value]) => section.style.setProperty(`--${name}`, value));
  section.querySelectorAll('[data-chat-question]').forEach((button, i) => {
    const r = ease(clamp((p - 0.14 - i * 0.03) / 0.18));
    button.style.setProperty('--qo', r.toFixed(2));
    button.style.setProperty('--qx', Math.round((1 - r) * -40));
  });
}

/** Läuft innerhalb von withGsap(). */
export function animateAdvice() {
  const section = document.querySelector('[data-advice]');
  if (section) onScrollProgress(section, VISIBLE_RANGE, (p) => paint(section, p));
}

export function initAdvice(signal) {
  const section = document.querySelector('[data-advice]');
  if (!section) return;
  const questions = JSON.parse(section.querySelector('[data-chat-data]').textContent);
  initChat(section, questions, signal);
}
