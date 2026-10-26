/*
 * Bestellen per WhatsApp: Pedido in nexomar anlegen, Nachricht mit der Nummer öffnen,
 * Bolsa leeren, weiter zu "Gracias". Ist nexomar nicht erreichbar, geht die Nachricht
 * trotzdem raus (ohne Nummer) — so geht keine Bestellung verloren.
 */
import { navigate } from 'astro:transitions/client';
import { currentSummary } from '../../cart/summary.js';
import { orderMessage } from '../../checkout/message.js';
import { savePending } from '../../checkout/pending.js';
import { whatsappUrl } from '../../utils/whatsapp.js';
import { clearOrderState, sendOrder, thanksPath } from './result.js';

function openChat(tab, url) {
  if (tab) tab.location.href = url;
  else window.open(url, '_blank', 'noopener');
}

/** Gibt eine Fehlermeldung zurück oder null. Das Fenster öffnet direkt beim Klick (Pop-up-Sperre). */
export async function orderByWhatsApp(order) {
  const tab = window.open('', '_blank');
  const result = await sendOrder(order);
  if (result.error) {
    tab?.close();
    return result.error;
  }
  finish(tab, order, result.data);
  return null;
}

function finish(tab, order, data) {
  const number = data?.numero;
  const url = whatsappUrl(orderMessage({ ...order, summary: currentSummary(), number }));
  openChat(tab, url);
  savePending({ via: 'whatsapp', number, whatsapp: url });
  clearOrderState();
  navigate(thanksPath(data, 'whatsapp'));
}
