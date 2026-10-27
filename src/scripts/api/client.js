import { API_BASE, SHOP_ID } from '../config.js';

export const ENDPOINTS = {
  products: `${API_BASE}/api/products/public?userId=${SHOP_ID}`,
  reviews: `${API_BASE}/api/shop-reviews/public?userId=${SHOP_ID}`,
  validateCode: `${API_BASE}/api/public/validate-code`,
  order: `${API_BASE}/api/public/order`,
  review: `${API_BASE}/api/public/resena`,
  checkoutConfig: `${API_BASE}/api/public/checkout/config?shopId=${SHOP_ID}`,
  giftCard: `${API_BASE}/api/public/checkout/gift-card`,
  orderStatus: (id, token) =>
    `${API_BASE}/api/public/checkout/pedido/${id}?shopId=${SHOP_ID}&t=${encodeURIComponent(token)}`,
  retryBold: (id) => `${API_BASE}/api/public/checkout/pedido/${id}/bold`,
  heart: (productId) => `${API_BASE}/api/products/${productId}/heart`,
  discount: `${API_BASE}/api/public/discount?shopId=${SHOP_ID}`,
  register: `${API_BASE}/api/public/register`,
};

export async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`GET ${url} → ${response.status}`);
  return response.json();
}

/** Schickt JSON und gibt `{ ok, status, data }` zurück, auch bei Fehlerstatus. */
export async function postJson(url, body = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}
