/* Texte zum Versand, gleich in der Bolsa und auf der Seite "Finalizar compra". */
import { formatCOP } from '../utils/format.js';

/** Was in der Zeile "Envío" steht. */
export function shippingValue(summary) {
  const { shipping } = summary;
  if (!summary.hasProducts) return '—';
  if (shipping.free) return 'Gratis';
  if (shipping.pending) return 'Por acordar';
  return `${formatCOP(shipping.cost)} COP`;
}

function emptyHint(threshold) {
  return threshold === null ? '' : `Envío gratis desde ${formatCOP(threshold)} COP`;
}

/** Der Satz über der Liste: wie viel noch bis zum Gratis-Versand fehlt. */
export function shippingHint(summary, code) {
  const { shipping } = summary;
  if (!summary.hasProducts) return emptyHint(shipping.threshold);
  if (summary.code.freeShipping) return `¡Envío gratis con tu código ${code}!`;
  if (shipping.free) return '¡Envío gratis incluido!';
  if (shipping.threshold === null) return '';
  return `Te faltan ${formatCOP(shipping.shortfall)} COP para envío gratis`;
}

/** Füllstand des Balkens in Prozent. */
export function shippingProgress(summary) {
  const { shipping } = summary;
  if (shipping.free) return 100;
  if (!shipping.threshold || !summary.hasProducts) return 0;
  return ((shipping.threshold - shipping.shortfall) / shipping.threshold) * 100;
}
