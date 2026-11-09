/* Titel und Beschreibung für Google: so kurz, dass Google sie nicht mitten im Wort abschneidet. */

/* Längere Titel kürzt Google in den Suchergebnissen mit "…" */
const TITLE_MAX = 65;

/** "NAME — Perfume caballero | ScentScape Medellín", bei langen Namen ohne "Medellín". */
export function productTitle(name, label) {
  const full = `${name} — ${label} | ScentScape Medellín`;
  return full.length <= TITLE_MAX ? full : `${name} — ${label} | ScentScape`;
}

/** Kürzt einen Text auf höchstens `max` Zeichen, an einer Wortgrenze, mit "…". */
export function shortText(text, max) {
  const clean = (text ?? '').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : cut.length).replace(/[\s,;:.]+$/, '')}…`;
}
