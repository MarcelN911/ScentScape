/* Baut die komplette WhatsApp-Nachricht mit der Bestellung. */
import { discountLines, giftLines, itemLine, money, shippingLine } from './message-lines.js';

const PAY_LABELS = {
  wa: 'WhatsApp (Nequi, Daviplata, transferencia o contraentrega)',
  card: 'Tarjeta o PSE — por favor envíenme el enlace de pago Wompi',
  addi: 'Addi a cuotas — por favor envíenme el enlace de Addi',
};

function customerLines(customer) {
  const reference = customer.reference ? [`*Referencia:* ${customer.reference}`] : [];
  return [
    `*Cliente:* ${customer.name}`,
    `*Celular:* ${customer.phone}`,
    `*Dirección:* ${customer.address}`,
    `*Ciudad/Barrio:* ${customer.city} / ${customer.district}`,
    ...reference,
  ];
}

function summaryLines(summary, rule) {
  return [
    `Subtotal: ${money(summary.subtotal)}`,
    ...discountLines(summary, rule),
    shippingLine(summary),
  ];
}

const INTRO = [
  '*NUEVO PEDIDO — ScentScape*',
  '',
  'Hola, quiero hacer un pedido con la siguiente información:',
];

function totalLines(summary, payMode) {
  return [
    `*Pago:* ${PAY_LABELS[payMode] ?? PAY_LABELS.wa}`,
    `*Total a pagar: ${money(summary.total)}*`,
  ];
}

/** order = { customer, items, summary, rule, preferences }. Die Blöcke stehen durch Leerzeilen getrennt. */
export function orderMessage(order) {
  const { customer, items, summary, rule, preferences } = order;
  const blocks = [
    INTRO,
    [...customerLines(customer), ...giftLines(preferences)],
    ['*Productos:*', ...items.map(itemLine)],
    ['*Resumen del pedido:*', ...summaryLines(summary, rule)],
    totalLines(summary, preferences.payMode),
  ];
  return blocks.map((lines) => lines.join('\n')).join('\n\n');
}
