/*
 * Gift Card einlösen: Code bei nexomar prüfen und für diese Sitzung merken.
 * Abgebucht wird erst beim Bestellen — dort rechnet nexomar den Betrag selbst nach.
 */
import { ENDPOINTS, postJson } from '../api/client.js';
import { SHOP_ID } from '../config.js';
import { EVENTS, emit } from '../core/events.js';
import { readJson, removeKey, writeJson } from '../utils/storage.js';

const STORAGE_KEY = 'ss_gift_redeem';
let card =
  typeof sessionStorage === 'undefined' ? null : readJson(sessionStorage, STORAGE_KEY, null);

/** { codigo, saldo } oder null */
export function getGiftCard() {
  return card;
}

function setGiftCard(nextCard) {
  card = nextCard;
  if (card) writeJson(sessionStorage, STORAGE_KEY, card);
  else removeKey(sessionStorage, STORAGE_KEY);
  emit(EVENTS.cartChange);
}

/** Prüft den Code und übernimmt ihn. Gibt eine Fehlermeldung zurück oder null. */
export async function applyGiftCard(code) {
  try {
    const { data } = await postJson(ENDPOINTS.giftCard, { shopId: SHOP_ID, codigo: code });
    if (!data.valid) return data.error || 'Gift card no válida';
    setGiftCard({ codigo: data.codigo, saldo: data.saldo });
    return null;
  } catch {
    return 'No pudimos verificar la gift card';
  }
}

export function removeGiftCard() {
  setGiftCard(null);
}
