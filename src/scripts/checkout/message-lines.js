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
  const details = [item.color, item.recipient && `para ${item.recipient}`, item.delivery].filter(
    Boolean,
  );
  const message = item.message ? `\n   Mensaje: "${item.message}"` : '';
  return `• Gift card (${details.join(', ')}) — ${money(lineTotal(item))}${message}`;
}

export function itemLine(item) {
  if (item.giftCard) return giftCardLine(item);
  const brand = item.brand ? `${item.brand} - ` : '';
  const size = item.size ? ` (${item.size} ml)` : '';
  return `• ${item.quantity} x ${brand}${item.name}${size} — ${priceText(item)}`;
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
  const { shipping } = summary;
  if (!summary.hasProducts) return null;
  if (shipping.free) return 'Envío: *¡GRATIS!*';
  if (shipping.pending) return 'Envío: por acordar';
  return `Envío: ${money(shipping.cost)}`;
}

export function redeemLine(summary) {
  const { giftCard } = summary;
  return giftCard.amount ? `Gift card *${giftCard.code}*: − ${money(giftCard.amount)}` : null;
}
