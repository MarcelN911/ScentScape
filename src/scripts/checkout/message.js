/* Baut die komplette WhatsApp-Nachricht mit der Bestellung. */
import { discountLines, itemLine, money, redeemLine, shippingLine } from './message-lines.js';

function customerLines(customer) {
  const optional = [
    customer.email && `*Correo:* ${customer.email}`,
    customer.reference && `*Referencia:* ${customer.reference}`,
    customer.notes && `*Notas:* ${customer.notes}`,
  ];
  return [
    `*Cliente:* ${customer.name}`,
    `*Celular:* ${customer.phone}`,
    `*Dirección:* ${customer.address}, ${customer.district}`,
    `*Ciudad:* ${customer.city} (${customer.department})`,
    ...optional.filter(Boolean),
  ];
}

function summaryLines(summary, rule) {
  const lines = [
    `Subtotal: ${money(summary.subtotal)}`,
    ...discountLines(summary, rule),
    shippingLine(summary),
    redeemLine(summary),
  ];
  return lines.filter(Boolean);
}

function intro(number) {
  const title = number ? `*NUEVO PEDIDO #${number} — ScentScape*` : '*NUEVO PEDIDO — ScentScape*';
  return [title, '', 'Hola, quiero hacer un pedido con la siguiente información:'];
}

/** order = { customer, items, summary, rule, number }. Die Blöcke stehen durch Leerzeilen getrennt. */
export function orderMessage(order) {
  const { customer, items, summary, rule } = order;
  const blocks = [
    intro(order.number),
    customerLines(customer),
    ['*Productos:*', ...items.map(itemLine)],
    ['*Resumen del pedido:*', ...summaryLines(summary, rule)],
    [`*Total a pagar: ${money(summary.total)}*`, 'Pago: por WhatsApp'],
  ];
  return blocks.map((lines) => lines.join('\n')).join('\n\n');
}
