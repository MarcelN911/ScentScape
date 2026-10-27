/* Texte einer Fragancia im Catálogo Digital */
import { formatCOP } from '../utils/format.js';

/** Günstigster Preis; bei mehreren Größen setzt CatalogSheetItem "Desde" davor. */
export function catalogPriceOf(product) {
  return formatCOP(product.price);
}
