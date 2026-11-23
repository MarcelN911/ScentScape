/*
 * Produktliste für die Suche im Header als Datei /buscar.json, entsteht beim Build.
 * Die beliebtesten Produkte stehen vorn: die ersten zeigt die Suche, bevor man etwas tippt.
 */
import { getCatalog } from '../scripts/catalog/load.js';
import { bestsellers } from '../scripts/catalog/queries.js';
import { searchEntryOf } from '../scripts/catalog/search-entry.js';

export async function GET() {
  const catalog = await getCatalog();
  return Response.json(bestsellers(catalog, catalog.length).map(searchEntryOf));
}
