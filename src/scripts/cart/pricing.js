/* Preisberechnung des Warenkorbs, übernommen aus der alten cart.js. */
import { FREE_SHIPPING_THRESHOLD } from '../config.js';
import { formatCOP } from '../utils/format.js';
import { eligibleItems, isCodeLimited } from './discount-rules.js';

export function lineTotal(item) {
  return (item.salePrice || item.regularPrice) * item.quantity;
}

export function subtotalOf(items) {
  return items.reduce((sum, item) => sum + item.regularPrice * item.quantity, 0);
}

export function saleDiscountOf(items) {
  return items.reduce(
    (sum, item) =>
      item.salePrice ? sum + (item.regularPrice - item.salePrice) * item.quantity : sum,
    0,
  );
}

function inactive(reason = '') {
  return { active: false, amount: 0, freeShipping: false, partial: false, reason };
}

function notApplicableReason(rule) {
  const onlySale = rule.sobreSale === false && !isCodeLimited(rule);
  return onlySale
    ? 'Este código no aplica a productos en oferta.'
    : 'Este código no aplica a los productos de tu carrito.';
}

function codeAmount(rule, base) {
  if (rule.tipo === 'porcentaje') return Math.round((base * (rule.porcentaje || 0)) / 100);
  if (rule.tipo === 'monto') return Math.min(Math.round(rule.valor || 0), base);
  return 0;
}

function eligibleBase(rule, items) {
  return eligibleItems(rule, items).reduce((sum, item) => sum + lineTotal(item), 0);
}

function minimumReason(rule, net) {
  if (!(rule.minimo > 0 && net < rule.minimo)) return '';
  return `Agrega ${formatCOP(rule.minimo - net)} COP más para usar ${rule.codigo}.`;
}

function activeState(rule, base, net) {
  const amount = codeAmount(rule, base);
  return {
    active: true,
    amount,
    freeShipping: rule.tipo === 'envio',
    partial: base < net,
    reason: '',
  };
}

/** Was der Rabattcode beim aktuellen Warenkorb bewirkt, oder warum er gerade nicht greift. */
export function codeStateOf(rule, items) {
  if (!rule || items.length === 0) return inactive();
  const net = subtotalOf(items) - saleDiscountOf(items);
  const base = eligibleBase(rule, items);
  if (base <= 0) return inactive(notApplicableReason(rule));
  const reason = minimumReason(rule, net);
  return reason ? inactive(reason) : activeState(rule, base, net);
}

function shippingOf(items, code, total) {
  const shortfall = code.freeShipping ? 0 : Math.max(0, FREE_SHIPPING_THRESHOLD - total);
  return { shortfall, freeShipping: items.length > 0 && shortfall === 0 };
}

export function countOf(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/** Alle Summen an einer Stelle. */
export function summaryOf(items, rule) {
  const subtotal = subtotalOf(items);
  const saleDiscount = saleDiscountOf(items);
  const code = codeStateOf(rule, items);
  const total = subtotal - saleDiscount - code.amount;
  return {
    count: countOf(items),
    subtotal,
    saleDiscount,
    code,
    total,
    ...shippingOf(items, code, total),
  };
}
