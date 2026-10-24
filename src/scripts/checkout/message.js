/* Baut die komplette WhatsApp-Nachricht mit der Bestellung. */
import { discountLines, itemLine, money, shippingLine } from './message-lines.js';

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

/** order = { customer, items, summary, rule }. Die Blöcke stehen durch Leerzeilen getrennt. */
export function orderMessage(order) {
  const { customer, items, summary, rule } = order;
  const blocks = [
    INTRO,
    customerLines(customer),
    ['*Productos:*', ...items.map(itemLine)],
    ['*Resumen del pedido:*', ...summaryLines(summary, rule)],
    [`*Total a pagar: ${money(summary.total)}*`],
  ];
  return blocks.map((lines) => lines.join('\n')).join('\n\n');
}
