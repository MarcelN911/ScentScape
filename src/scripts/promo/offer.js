/* Texte zu einer Aktion aus nexomar: der große Wert und die Bedingungen in kurzen Sätzen. */
import { formatCOP } from '../utils/format.js';

const DAY = 86400000;

/** { value: "10%", label: "de descuento" } */
export function valueOf(offer) {
  if (offer.tipo === 'envio') return { value: 'Envío gratis', label: 'en tu pedido' };
  if (offer.tipo === 'monto') return { value: formatCOP(offer.valor), label: 'de descuento' };
  return { value: `${offer.porcentaje || 0}%`, label: 'de descuento' };
}

function deadlineText(offer) {
  const end = new Date(offer.vence ?? NaN).getTime();
  if (Number.isNaN(end)) return null;
  const days = Math.ceil((end - Date.now()) / DAY);
  if (days <= 1) return 'Termina hoy';
  if (days <= 3) return `Termina en ${days} días`;
  const date = new Date(end).toLocaleDateString('es-CO', { day: 'numeric', month: 'long' });
  return `Válido hasta el ${date}`;
}

function couponsText(left) {
  if (left === null || left === undefined) return null;
  if (left === 1) return 'Queda 1 cupón';
  return left <= 20 ? `Solo quedan ${left} cupones` : 'Cupones limitados';
}

/* Kategorie, Marke und Geschlecht: wenige werden genannt, viele zusammengefasst */
function scopeText(offer) {
  const scope = [...(offer.categorias ?? []), ...(offer.marcas ?? []), ...(offer.generos ?? [])];
  if (offer.productos?.length || scope.length > 3) return 'Válido en productos seleccionados';
  return scope.length ? `Válido en ${scope.join(' · ')}` : null;
}

function usesText(max) {
  if (max === null || max === undefined) return null;
  return max === 1 ? 'Un uso por cliente' : `${max} usos por cliente`;
}

/** Alles, was man vor dem Einlösen wissen sollte, das Dringendste zuerst */
export function conditionsOf(offer) {
  return [
    deadlineText(offer),
    couponsText(offer.restantes),
    offer.minimo > 0 && `En compras desde ${formatCOP(offer.minimo)}`,
    scopeText(offer),
    offer.sobreSale === false && 'No acumulable con ofertas',
    usesText(offer.maxUsosPorCliente),
  ].filter(Boolean);
}
