/*
 * Fotos der 16 Noten (Rosa, Cedro, …). Sie liegen als Dateien im Projekt
 * (public/assets/img/notas/), Dateiname = Note ohne Akzente: "Ámbar" → ambar.jpg.
 * Ursprünglich aus Wikipedia (siehe "wiki" in data/scent.js).
 */
import { INGREDIENTS } from '../../data/scent.js';
import { slugify } from '../utils/text.js';

const NOTE_IMAGES = Object.fromEntries(
  INGREDIENTS.map((note) => [note.name, `/assets/img/notas/${slugify(note.name)}.jpg`]),
);

/** { Rosa: '/assets/img/notas/rosa.jpg', … } */
export async function getNoteImages() {
  return NOTE_IMAGES;
}
