/* Speichert Kunde und Bestellung in nexomar. Preise, Summe und Rabatt rechnet der Server selbst nach. */
import { ENDPOINTS, postJson } from '../api/client.js';
import { orderItemsOf } from '../cart/order-items.js';
import { SHOP_ID } from '../config.js';

export function saveOrder(customer, items, rule) {
  const body = {
    shopId: SHOP_ID,
    nombre: customer.name,
    telefono: customer.phone,
    ciudad: customer.city,
    barrio: customer.district,
    direccion: [customer.address, customer.reference].filter(Boolean).join(' · '),
    items: orderItemsOf(items),
    codigoDescuento: rule?.codigo ?? '',
  };
  return postJson(ENDPOINTS.order, body).catch(() => null);
}
