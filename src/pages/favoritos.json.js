/*
 * Kleine Produktliste als Datei /favoritos.json, entsteht beim Build.
 * Im Browser sind nur die IDs der Herzen gespeichert; die Seitenleiste "Favoritos" holt sich hier
 * Name, Bild und Preis dazu.
 */
import { getCatalog } from '../scripts/catalog/load.js';
import { wishEntryOf } from '../scripts/catalog/wish-entry.js';

export async function GET() {
  const catalog = await getCatalog();
  return Response.json(catalog.map(wishEntryOf));
}
