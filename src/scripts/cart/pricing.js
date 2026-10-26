/*
 * Preisberechnung des Warenkorbs. Rechnet wie nexomar (utils/pedidoTienda.js), damit der Betrag
 * auf der Seite derselbe ist, den der Server beim Bestellen festlegt:
 *   Produkte − Ofertas − Código + Envío − Gift card (eingelöst) + gekaufte Gift Cards
 * Eine eingelöste Gift Card bezahlt Produkte und Versand, aber keine weitere Gift Card.
 */
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

const isPurchase = (item) => Boolean(item.giftCard);

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
  return {
    active: true,
    amount: codeAmount(rule, base),
    freeShipping: rule.tipo === 'envio',
    partial: base < net,
    reason: '',
  };
}

/** Was der Rabattcode bei diesen Produkten bewirkt, oder warum er gerade nicht greift. */
export function codeStateOf(rule, products) {
  if (!rule || products.length === 0) return inactive();
  const net = subtotalOf(products) - saleDiscountOf(products);
  const base = eligibleBase(rule, products);
  if (base <= 0) return inactive(notApplicableReason(rule));
  const reason = minimumReason(rule, net);
  return reason ? inactive(reason) : activeState(rule, base, net);
}

const NO_SHIPPING = { cost: 0, pending: false, free: false, shortfall: 0, threshold: null };

/**
 * Versand für die Produkte. envio = { costo, gratisDesde } aus nexomar.
 * costo null = "por acordar" (per WhatsApp), gratisDesde null = nie gratis.
 */
export function shippingOf(products, code, net, envio) {
  const threshold = envio.gratisDesde ?? null;
  if (!products.length) return { ...NO_SHIPPING, threshold };
  if (code.freeShipping) return { ...NO_SHIPPING, free: true, threshold };
  const shortfall = threshold === null ? null : Math.max(0, threshold - net);
  if (shortfall === 0) return { ...NO_SHIPPING, free: true, threshold };
  return {
    cost: envio.costo ?? 0,
    pending: (envio.costo ?? null) === null,
    free: false,
    shortfall,
    threshold,
  };
}

export function countOf(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function giftUseOf(card, payable) {
  if (!card) return { code: '', amount: 0 };
  return { code: card.codigo, amount: Math.min(card.saldo, Math.max(0, payable)) };
}

/**
 * Alle Summen an einer Stelle.
 * options.envio: Versand-Einstellungen, options.giftCard: eingelöste Karte { codigo, saldo }.
 */
export function summaryOf(items, rule, options = {}) {
  const products = items.filter((item) => !isPurchase(item));
  const purchases = subtotalOf(items.filter(isPurchase));
  const saleDiscount = saleDiscountOf(products);
  const code = codeStateOf(rule, products);
  const productNet = subtotalOf(products) - saleDiscount - code.amount;
  const shipping = shippingOf(products, code, productNet, options.envio ?? {});
  const giftCard = giftUseOf(options.giftCard, productNet + shipping.cost);
  const total = productNet + shipping.cost - giftCard.amount + purchases;
  const base = { count: countOf(items), subtotal: subtotalOf(items), saleDiscount, code };
  return { ...base, shipping, giftCard, total, hasProducts: products.length > 0 };
}
