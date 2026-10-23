/* Einstellungen für den Bestellabschluss: Geschenk, Notiz, Lieferdatum, Zahlungsart. */
import { EVENTS, emit } from '../core/events.js';
import { readJson, writeJson } from '../utils/storage.js';

const STORAGE_KEY = 'ss_checkout_prefs';
const DEFAULTS = { gift: false, note: '', date: '', payMode: 'wa' };
let preferences =
  typeof sessionStorage === 'undefined'
    ? DEFAULTS
    : { ...DEFAULTS, ...readJson(sessionStorage, STORAGE_KEY, {}) };

export function getPreferences() {
  return preferences;
}

export function updatePreferences(changes) {
  preferences = { ...preferences, ...changes };
  writeJson(sessionStorage, STORAGE_KEY, preferences);
  emit(EVENTS.cartChange);
}
