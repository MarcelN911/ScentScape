/** "canela" → "Canela" */
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** "Nuez Moscada" → "Nuez moscada" */
export function sentenceCase(text) {
  return capitalize(String(text).toLowerCase());
}

/** Kleinbuchstaben ohne Akzente, für Suche und Vergleiche: "Jazmín" → "jazmin" */
export function toPlain(text) {
  return String(text ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/** "Club de Nuit Intense" → "club-de-nuit-intense" */
export function slugify(text) {
  return toPlain(text)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function initialOf(name) {
  return String(name ?? '?')
    .trim()
    .charAt(0)
    .toUpperCase();
}
