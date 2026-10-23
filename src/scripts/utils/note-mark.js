/*
 * Monogramm für eine Duftnote: dunkler Kreis, zwei Ringe, kursiver Anfangsbuchstabe.
 * Als SVG-Text, damit es beim Build (Astro) und im Browser gleich aussieht.
 */
let counter = 0;

function letterFor(name, glyph) {
  if (glyph) return glyph;
  const text = String(name ?? '').trim();
  return text ? text[0].toUpperCase() : '✦';
}

function ornaments(color) {
  return [
    `<circle cx="50" cy="50" r="44" fill="none" stroke="${color}" stroke-width="1.6" opacity=".9"/>`,
    `<circle cx="50" cy="50" r="38.5" fill="none" stroke="${color}" stroke-width=".7" opacity=".45"/>`,
    `<path d="M50 4.5 L51.6 8 L50 11.5 L48.4 8 Z M50 88.5 L51.6 92 L50 95.5 L48.4 92 Z" fill="${color}"/>`,
  ].join('');
}

function letterSvg(letter, color) {
  const size = letter === '✦' ? 30 : 46;
  return `<text x="50" y="51" text-anchor="middle" dominant-baseline="central" font-family="Bodoni Moda Variable, Bodoni 72, Didot, Georgia, serif" font-style="italic" font-size="${size}" fill="${color}">${letter}</text>`;
}

export function noteMarkSvg(name, color = '#f0be91', glyph = '') {
  const id = `note-mark-${(counter += 1)}`;
  const gradient = `<defs><radialGradient id="${id}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#262b4d"/><stop offset="1" stop-color="#0e1124"/></radialGradient></defs>`;
  const disc = `<circle cx="50" cy="50" r="50" fill="url(#${id})"/>`;
  const content = gradient + disc + ornaments(color) + letterSvg(letterFor(name, glyph), color);
  return `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">${content}</svg>`;
}
