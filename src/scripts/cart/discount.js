/*
 * Rabattcode: prüfen beim nexomar-Server, merken für diese Sitzung,
 * und kurz vor dem Absenden noch einmal mit der Telefonnummer bestätigen.
 */
import { ENDPOINTS, postJson } from '../api/client.js';
import { SHOP_ID } from '../config.js';
import { EVENTS, emit } from '../core/events.js';
import { readJson, removeKey, writeJson } from '../utils/storage.js';
import { orderItemsOf } from './order-items.js';

const STORAGE_KEY = 'elixir_cart_code';
let rule =
  typeof sessionStorage === 'undefined' ? null : readJson(sessionStorage, STORAGE_KEY, null);

export function getRule() {
  return rule;
}

function setRule(nextRule) {
  rule = nextRule;
  if (rule) writeJson(sessionStorage, STORAGE_KEY, rule);
  else removeKey(sessionStorage, STORAGE_KEY);
  emit(EVENTS.cartChange);
}

const RULE_DEFAULTS = {
  tipo: 'porcentaje',
  porcentaje: 0,
  valor: 0,
  minimo: 0,
  categorias: [],
  marcas: [],
  generos: [],
  productos: [],
};

function ruleFrom(data) {
  const fields = Object.keys(RULE_DEFAULTS).map((key) => [key, data[key] || RULE_DEFAULTS[key]]);
  return {
    ...Object.fromEntries(fields),
    codigo: data.codigo,
    etiqueta: data.etiqueta || `${data.porcentaje}%`,
    sobreSale: data.sobreSale !== false,
  };
}

/** Prüft den Code und übernimmt ihn. Gibt eine Fehlermeldung zurück oder null. */
export async function applyCode(code) {
  try {
    const { data } = await postJson(ENDPOINTS.validateCode, { shopId: SHOP_ID, codigo: code });
    if (!data.valid) return data.error || 'Código no válido';
    setRule(ruleFrom(data));
    return null;
  } catch {
    return 'Error al verificar el código';
  }
}

export function removeCode() {
  setRule(null);
}

async function requestConfirmation(phone, items) {
  const body = {
    shopId: SHOP_ID,
    codigo: rule.codigo,
    telefono: phone,
    items: orderItemsOf(items),
  };
  const { data } = await postJson(ENDPOINTS.validateCode, body);
  return data;
}

function rejectCode(data) {
  const code = rule.codigo;
  removeCode();
  const reason = data.error || 'El código ya no es válido';
  return `${reason}. Quitamos ${code} de tu pedido: revisa el total y envíalo de nuevo.`;
}

/** Letzte Prüfung mit Telefonnummer (Codes können pro Kunde begrenzt sein). Fehlermeldung oder null. */
export async function confirmCode(phone, items) {
  if (!rule) return null;
  try {
    const data = await requestConfirmation(phone, items);
    return data.valid === false ? rejectCode(data) : null;
  } catch {
    return null;
  }
}
