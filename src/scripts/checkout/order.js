/*
 * Legt den Pedido in nexomar an. Preise, Rabatt, Versand und Gift-Card-Abzug rechnet der Server
 * selbst nach; die Antwort trägt Nummer, Zugangs-Token, Summe und bei Bold die signierten Zahldaten.
 */
import { ENDPOINTS, postJson } from '../api/client.js';
import { orderItemsOf, purchasesOf } from '../cart/order-items.js';
import { SHOP_ID } from '../config.js';

function customerPart(customer) {
  return {
    nombre: customer.name,
    telefono: customer.phone,
    email: customer.email,
    ciudad: `${customer.city} (${customer.department})`,
    barrio: customer.district,
    direccion: customer.address,
    referencia: customer.reference,
    notas: customer.notes,
  };
}

/** order = { customer, items, rule, giftCard, method } */
export function orderBody(order) {
  return {
    shopId: SHOP_ID,
    ...customerPart(order.customer),
    items: [...orderItemsOf(order.items), ...purchasesOf(order.items)],
    codigoDescuento: order.rule?.codigo ?? '',
    giftCard: order.giftCard?.codigo ?? '',
    metodoPago: order.method,
  };
}

/** { ok, data }; wirft nur, wenn nexomar gar nicht erreichbar ist. */
export function createOrder(order) {
  return postJson(ENDPOINTS.order, orderBody(order));
}

/** Neuer Zahlungsversuch für einen schon angelegten Pedido. */
export function retryPayment(orderId, token) {
  return postJson(ENDPOINTS.retryBold(orderId), { shopId: SHOP_ID, t: token });
}
