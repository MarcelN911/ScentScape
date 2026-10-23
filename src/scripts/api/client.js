import { API_BASE, SHOP_ID } from '../config.js';

export const ENDPOINTS = {
  products: `${API_BASE}/api/products/public?userId=${SHOP_ID}`,
  reviews: `${API_BASE}/api/shop-reviews/public?userId=${SHOP_ID}`,
  validateCode: `${API_BASE}/api/public/validate-code`,
  order: `${API_BASE}/api/public/order`,
  review: `${API_BASE}/api/public/resena`,
  heart: (productId) => `${API_BASE}/api/products/${productId}/heart`,
};

export async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`GET ${url} → ${response.status}`);
  return response.json();
}

/** Schickt JSON und gibt `{ ok, data }` zurück, auch bei Fehlerstatus. */
export async function postJson(url, body = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, data };
}
