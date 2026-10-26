/* Der Link zur Seite /regalo/ für eine Gift Card (Format siehe data/regalo.js). */
export function regaloPath(card) {
  const params = new URLSearchParams({
    para: card.para || '',
    de: card.de || '',
    monto: String(card.monto),
    codigo: card.codigo,
    color: card.color || '',
    hasta: card.vence ? card.vence.slice(0, 10) : '',
    mensaje: card.mensaje || '',
  });
  return `/regalo/?${params}`;
}
