/* Einzelne Zeilen der WhatsApp-Bestellnachricht (Format wie auf der alten Seite). */
import { formatNumber } from '../utils/format.js';
import { lineTotal } from '../cart/pricing.js';

export function money(amount) {
  return `$${formatNumber(amount)} COP`;
}

function priceText(item) {
  if (!item.salePrice) return money(lineTotal(item));
  return `*${money(lineTotal(item))}* ¡Oferta! (antes ${money(item.regularPrice)})`;
}

function giftCardLine(item) {
  const details = [item.color, item.recipient && `para ${item.recipient}`].filter(Boolean);
  const message = item.message ? `\n   Mensaje: "${item.message}"` : '';
  return `• Gift card (${details.join(', ')}) — ${money(lineTotal(item))}${message}`;
}

export function itemLine(item) {
  if (item.giftCard) return giftCardLine(item);
  const brand = item.brand ? `${item.brand} - ` : '';
  return `• ${item.quantity} x ${brand}${item.name} (${item.size} ml) — ${priceText(item)}`;
}

export function discountLines(summary, rule) {
  const lines = [];
  if (summary.saleDiscount > 0) lines.push(`Descuento: − ${money(summary.saleDiscount)}`);
  if (summary.code.amount > 0) {
    lines.push(`Código *${rule.codigo}* (${rule.etiqueta}): − ${money(summary.code.amount)}`);
  }
  if (summary.code.freeShipping) lines.push(`Código *${rule.codigo}*: envío gratis`);
  return lines;
}

export function shippingLine(summary) {
  const free = summary.freeShipping || summary.code.freeShipping;
  return free ? 'Envío: *¡GRATIS!*' : 'Envío: A calcular';
}

export function giftLines(preferences) {
  if (!preferences.gift) return [];
  const note = preferences.note ? ` — nota: "${preferences.note}"` : '';
  const date = preferences.date ? [`*Entrega deseada:* ${preferences.date}`] : [];
  return [`*Es un regalo:* paquete sin precio${note}`, ...date];
}
