/*
 * Alte Produkt-Adressen der bisherigen Seite (/perfume/<slug>/), damit sie auf die neuen umleiten.
 * Die Liste erzeugt das alte Skript in legacy/tools/ als "window.SS_PRODUCT_URLS = { id: url };".
 */
import { readFile } from 'node:fs/promises';

const LEGACY_URL_FILE = new URL('../../legacy/scripts/product-urls.js', import.meta.url);

/** { "<nexomar-id>": "perfume/khamrah" } – ohne Datei einfach leer */
export async function loadLegacyProductPaths() {
  try {
    const source = await readFile(LEGACY_URL_FILE, 'utf8');
    const json = source.slice(source.indexOf('{'), source.lastIndexOf('}') + 1);
    const urls = JSON.parse(json);
    const paths = Object.entries(urls).map(([id, url]) => [id, url.replace(/^\/|\/$/g, '')]);
    return Object.fromEntries(paths);
  } catch {
    return {};
  }
}
