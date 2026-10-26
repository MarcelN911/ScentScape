/*
 * Einstellungen des Checkouts aus nexomar: Versandpreis, Gratis-Schwelle, ob Bold an ist,
 * Grenzen der Gift Cards. Bis die Antwort da ist (oder wenn nexomar nicht antwortet),
 * gilt FALLBACK: Versand "a calcular", kein Pago en línea.
 */
import { ENDPOINTS, getJson } from '../api/client.js';
import { FREE_SHIPPING_THRESHOLD } from '../config.js';
import { EVENTS, emit } from '../core/events.js';
import { readJson, writeJson } from '../utils/storage.js';

const STORAGE_KEY = 'ss_checkout_settings';
const FALLBACK = {
  bold: { activo: false },
  envio: { costo: null, gratisDesde: FREE_SHIPPING_THRESHOLD },
  giftCards: { activas: false },
};

let settings =
  typeof sessionStorage === 'undefined'
    ? FALLBACK
    : readJson(sessionStorage, STORAGE_KEY, FALLBACK);

export function getSettings() {
  return settings;
}

const isValid = (data) => Boolean(data?.bold && data.envio && data.giftCards);

/** Lädt die Einstellungen einmal pro Sitzung neu; der Warenkorb rechnet danach neu. */
export async function loadSettings() {
  try {
    const data = await getJson(ENDPOINTS.checkoutConfig);
    if (!isValid(data)) return settings;
    settings = data;
    writeJson(sessionStorage, STORAGE_KEY, settings);
    emit(EVENTS.cartChange);
  } catch {
    // nexomar nicht erreichbar: es bleibt beim letzten Stand.
  }
  return settings;
}
