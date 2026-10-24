/*
 * Fotos der 16 Noten (Rosa, Cedro, …) aus Wikipedia. Werden einmal beim Build geladen,
 * damit der Browser der Besucher nichts nachladen muss. Fehlt ein Foto, bleibt nur die Farbe.
 */
import { INGREDIENTS } from '../../data/scent.js';

const SUMMARY = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
let imagesPromise;

async function imageOf(note) {
  try {
    const response = await fetch(SUMMARY + encodeURIComponent(note.wiki));
    const data = await response.json();
    const source = data.thumbnail?.source ?? data.originalimage?.source;
    return source ? [note.name, source.replace(/\/\d+px-/, '/250px-').split('?')[0]] : null;
  } catch {
    return null;
  }
}

async function loadImages() {
  const entries = await Promise.all(INGREDIENTS.map(imageOf));
  return Object.fromEntries(entries.filter(Boolean));
}

/** { Rosa: 'https://upload.wikimedia.org/…', … } */
export function getNoteImages() {
  imagesPromise ??= loadImages();
  return imagesPromise;
}
