/*
 * Bezahlen über Bold: Pedido anlegen (oder den offenen dieser Sitzung weiterverwenden),
 * dann den Checkout von Bold öffnen. Geleert wird die Bolsa erst, wenn die Zahlung
 * bestätigt ist — das macht die Seite "Gracias".
 */
import { navigate } from 'astro:transitions/client';
import { CHECKOUT_ERRORS } from '../../../data/checkout.js';
import { openBold } from '../../checkout/bold.js';
import { retryPayment } from '../../checkout/order.js';
import { fingerprintOf, getPending, savePending } from '../../checkout/pending.js';
import { sendOrder, thanksPath } from './result.js';

const CONFLICT = 409;

/**
 * Derselbe Warenkorb wie beim letzten Versuch: neuer Zahlungsversuch statt neuer Pedido.
 * 409 = schon bezahlt oder storniert: dann zeigt "Gracias" den Stand (pago: null).
 * Ein anderer Fehler (Pedido unbekannt): null, dann entsteht ein neuer Pedido.
 */
async function retryPending(pending) {
  try {
    const { ok, status, data } = await retryPayment(pending.orderId, pending.token);
    if (ok) return { data: { ...pending, pago: data.pago } };
    return status === CONFLICT ? { data: { ...pending, pago: null } } : null;
  } catch {
    return { offline: true };
  }
}

async function orderFor(order, fingerprint) {
  const pending = getPending();
  const reusable = pending?.via === 'bold' && pending.fingerprint === fingerprint;
  const retried = reusable ? await retryPending(pending) : null;
  if (retried) return retried;
  const result = await sendOrder(order);
  if (!result.data) return result;
  const { orderId, token, numero, pago } = result.data;
  return { data: { orderId, token, numero, pago } };
}

function absolute(path) {
  return new URL(path, window.location.origin).href;
}

/** Gibt eine Fehlermeldung zurück oder null. */
export async function payOnline(order) {
  const fingerprint = fingerprintOf(order);
  const result = await orderFor(order, fingerprint);
  if (!result.data) return result.error ?? CHECKOUT_ERRORS.network;
  savePending({ via: 'bold', fingerprint, ...result.data, pago: undefined });
  return startPayment(result.data, order.customer);
}

/** Ohne pago ist nichts mehr zu zahlen (Gift Card deckt alles, oder schon bezahlt). */
function startPayment(data, customer) {
  const path = thanksPath(data, 'bold');
  if (!data.pago) return navigate(path).then(() => null);
  const checkout = { number: data.numero, customer, redirectionUrl: absolute(path) };
  return openBold(data.pago, checkout).then(
    () => null,
    () => CHECKOUT_ERRORS.bold,
  );
}
