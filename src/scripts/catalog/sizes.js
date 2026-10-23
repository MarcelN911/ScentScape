function toSize(presentation) {
  const ml = parseInt(presentation.etiqueta, 10) || 0;
  const price = Number(presentation.precio) || 0;
  const sale = Number(presentation.precioSale) || 0;
  return { ml, label: `${ml} ml`, price, salePrice: sale > 0 && sale < price ? sale : null };
}

export function readSizes(raw) {
  return (raw.presentaciones ?? [])
    .map(toSize)
    .filter((size) => size.ml > 0 && size.price > 0)
    .sort((a, b) => a.ml - b.ml);
}

export function effectivePrice(size) {
  return size.salePrice ?? size.price;
}

export function lowestPrice(sizes) {
  return Math.min(...sizes.map(effectivePrice));
}
