/*
 * Ablauf der Öffnung: Lasche auf, Karte heraus, Umschlag weg, Betrag rollt,
 * Rückseite mit Nachricht, dann rückt alles zur Seite. Jeder Schritt setzt Klassen am Seitenwurzel.
 */
import { REGALO_STEPS } from '../../../data/regalo.js';
import { setFlipped } from '../gift/card.js';

const PHASES = [1, 2, 3, 4, 5];

/** Zeigt den Zustand am Seitenwurzel: .is-p1 … .is-p5, .is-flap, .is-back */
export function paint(regalo) {
  const { root, card, state } = regalo;
  PHASES.forEach((phase) => root.classList.toggle(`is-p${phase}`, state.phase >= phase));
  root.classList.toggle('is-flap', state.flap);
  root.classList.toggle('is-back', state.back);
  setFlipped(card, state.back);
  const done = state.phase >= 5;
  root.querySelector('[data-regalo-info]').setAttribute('aria-hidden', String(!done));
  root.querySelector('[data-regalo-flip]').tabIndex = done ? 0 : -1;
  root.querySelector('[data-regalo-flip-label]').textContent = state.back
    ? 'Ver frente'
    : 'Ver reverso';
}

function applyStep(regalo, patch) {
  Object.assign(regalo.state, patch);
  if (patch.phase === 4) regalo.state.back = true;
  if (patch.rolled) regalo.onRoll();
  paint(regalo);
}

export function clearSteps(regalo) {
  regalo.timers.forEach(clearTimeout);
  regalo.timers = [];
}

export function openGift(regalo) {
  if (regalo.state.phase) return;
  clearSteps(regalo);
  regalo.timers = REGALO_STEPS.map(([ms, patch]) => setTimeout(() => applyStep(regalo, patch), ms));
}

/** Zurück zum geschlossenen Umschlag */
export function resetGift(regalo) {
  clearSteps(regalo);
  Object.assign(regalo.state, { phase: 0, flap: false, rolled: false, back: false });
  regalo.onReset();
  paint(regalo);
}
