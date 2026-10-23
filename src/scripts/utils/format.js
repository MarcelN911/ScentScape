const numberFormat = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 });

/** 359990 → "359.990" */
export function formatNumber(amount) {
  return numberFormat.format(Math.round(amount));
}

/** 359990 → "$359.990" */
export function formatCOP(amount) {
  return `$${formatNumber(amount)}`;
}

/** 4.666 → "4,7" */
export function formatRating(value) {
  return value.toFixed(1).replace('.', ',');
}

export function padNumber(value) {
  return String(value).padStart(2, '0');
}

const monthFormat = new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' });

/** "2026-03-14T…" → "marzo de 2026" */
export function formatMonth(date) {
  return date ? monthFormat.format(new Date(date)) : '';
}
