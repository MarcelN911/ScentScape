/* Warenkorb-Zeilen im Format, das die nexomar-API erwartet. */
const isPurchase = (item) => Boolean(item.giftCard);

/** Nur Produkte: so prüft nexomar auch Rabattcodes. */
export function orderItemsOf(items) {
  return items
    .filter((item) => !isPurchase(item))
    .map((item) => ({
      nombre: item.name,
      cantidad: item.quantity,
      precio: item.salePrice || item.regularPrice,
      variante: item.size ? `${item.size} ml` : '',
      marca: item.brand || '',
      productId: item.productId || null,
    }));
}

function purchaseOf(item) {
  return {
    giftCard: {
      monto: item.regularPrice,
      para: item.recipient || '',
      de: item.sender || '',
      mensaje: item.message || '',
      color: item.color || '',
      entrega: item.delivery || '',
    },
  };
}

/** Gekaufte Gift Cards: eine Position je Karte, auch bei Menge 2. */
export function purchasesOf(items) {
  return items
    .filter(isPurchase)
    .flatMap((item) => Array.from({ length: item.quantity }, () => purchaseOf(item)));
}
