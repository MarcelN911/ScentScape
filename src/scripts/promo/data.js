/*
 * Aktion aus nexomar: welche Aktion hervorgehoben ist und was in der Leiste steht.
 * Dazu: wer sich schon mit Name und WhatsApp eingetragen hat, bekommt den Code ohne Formular.
 */
import { ENDPOINTS, getJson, postJson } from '../api/client.js';
import { SHOP_ID } from '../config.js';
import { readJson, writeJson } from '../utils/storage.js';

/* Gleicher Schlüssel wie auf der alten Seite: wer sich dort eingetragen hat, wird wiedererkannt */
const REGISTERED_KEY = `nxdw_registrado_${SHOP_ID}`;

/**
 * { offer, bar }: offer = hervorgehobene Aktion oder null, bar = Einträge für die Leiste.
 * Klappt die Anfrage nicht, kommt `fallback`. nexomar erlaubt Anfragen aus dem Browser nur von
 * scentscape.com.co; lokal und in Vorschauen gilt deshalb der Stand vom Build (PromoBar.astro).
 */
export async function loadPromo(fallback = { offer: null, bar: [] }) {
  try {
    const data = await getJson(ENDPOINTS.discount);
    return { offer: data.destacado ?? null, bar: data.barra ?? [] };
  } catch {
    return fallback;
  }
}

let buildPromise;

/** Für den Build: fragt nexomar nur einmal, auch wenn die Leiste in jeder Seite steckt */
export function loadPromoOnce() {
  buildPromise ??= loadPromo();
  return buildPromise;
}

/** Eintrag { code, nombre }, wenn sich der Besucher für genau diese Aktion schon eingetragen hat */
export function registrationFor(offer) {
  const saved = readJson(localStorage, REGISTERED_KEY, null);
  return saved && saved.code === offer.codigo ? saved : null;
}

/** Trägt den Besucher bei nexomar ein. Wirft einen Fehler mit Meldung für den Kunden. */
export async function register(name, phone, offer) {
  const body = { shopId: SHOP_ID, nombre: name, telefono: phone, codigoDescuento: offer.codigo };
  const { ok, data } = await postJson(ENDPOINTS.register, body);
  if (!ok) throw new Error(data.error || 'Ocurrió un error. Intenta de nuevo.');
  const saved = { code: data.codigoDescuento || offer.codigo, nombre: data.nombre || name };
  writeJson(localStorage, REGISTERED_KEY, saved);
  return saved;
}
