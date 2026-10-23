/** Warenkorb-Zeilen im Format, das die nexomar-API erwartet. */
export function orderItemsOf(items) {
  return items.map((item) => ({
    nombre: item.giftCard ? `Gift card (${item.color ?? ''})`.trim() : item.name,
    cantidad: item.quantity,
    precio: item.salePrice || item.regularPrice,
    variante: item.size ? `${item.size} ml` : '',
    marca: item.brand || '',
    productId: item.productId || null,
  }));
}
