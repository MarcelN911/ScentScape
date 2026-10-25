/* Liest die Gift Card aus dem Link. Fehlt etwas Wichtiges, gilt das Beispiel. */
import { GIFT_COLORS } from '../../../data/gift-card.js';
import { REGALO_EXAMPLE, REGALO_LIMITS } from '../../../data/regalo.js';
import { slugify } from '../../utils/text.js';

const dateFormat = new Intl.DateTimeFormat('es-CO', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const shortFormat = new Intl.DateTimeFormat('es-CO', { month: 'short', year: 'numeric' });

function readText(params, key, max) {
  return (params.get(key) ?? '').trim().slice(0, max);
}

function readAmount(params) {
  const amount = Number(readText(params, 'monto', 9).replace(/\D/g, ''));
  return amount > 0 && amount <= REGALO_LIMITS.amount ? amount : 0;
}

function readColor(params) {
  const wanted = slugify(readText(params, 'color', 20));
  const index = GIFT_COLORS.findIndex((color) => slugify(color.name) === wanted);
  return Math.max(0, index);
}

/** "2027-10-18" → { long: "18 oct 2027", short: "oct 2027" }; ungültig → null */
function readUntil(params) {
  const value = readText(params, 'hasta', 10);
  const date = new Date(`${value}T12:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime())) return null;
  const clean = (text) => text.replace(/\./g, '').replace(/ de /g, ' ');
  return { long: clean(dateFormat.format(date)), short: clean(shortFormat.format(date)) };
}

function fromLink(params) {
  return {
    to: readText(params, 'para', REGALO_LIMITS.name),
    from: readText(params, 'de', REGALO_LIMITS.name),
    amount: readAmount(params),
    code: readText(params, 'codigo', REGALO_LIMITS.code).toUpperCase(),
    color: readColor(params),
    until: readUntil(params),
    message: readText(params, 'mensaje', REGALO_LIMITS.message),
  };
}

/** Ein echter Link braucht Empfänger, Betrag und Code */
export function readGift(search = window.location.search) {
  const gift = fromLink(new URLSearchParams(search));
  const real = Boolean(gift.to && gift.amount && gift.code);
  if (!real) return { ...REGALO_EXAMPLE, until: null, example: true };
  return {
    ...gift,
    from: gift.from || 'ScentScape',
    message: gift.message || REGALO_EXAMPLE.message,
  };
}
