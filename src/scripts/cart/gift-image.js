/*
 * Kleines Bild einer Gift Card in ihrer Farbe, für Warenkorb und Kasse.
 * Es ist ein SVG, das wir als Text bauen und direkt als Bildadresse (data:…) nutzen,
 * deshalb braucht es keine Bilddateien. Die Farben kommen aus data/gift-card.js.
 */
import { GIFT_COLORS } from '../../data/gift-card.js';

/* "linear-gradient(150deg,#6E1824,#531019 60%,#3d0211)" → ['#6E1824', '#531019', '#3d0211'] */
function gradientColors(background) {
  return background.match(/#[0-9a-f]{3,8}/gi) ?? ['#1E2342'];
}

function gradientStops(colors) {
  return colors
    .map((color, index) => {
      const offset = (index / Math.max(1, colors.length - 1)) * 100;
      return `<stop offset="${offset}%" stop-color="${color}"/>`;
    })
    .join('');
}

function cardSvg(color) {
  const stops = gradientStops(gradientColors(color.background));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">${stops}</linearGradient></defs>
<g transform="rotate(-8 120 120)">
<rect x="22" y="58" width="196" height="124" rx="14" fill="url(#g)"/>
<rect x="22.5" y="58.5" width="195" height="123" rx="13.5" fill="none" stroke="${color.line}"/>
<text x="40" y="86" fill="${color.ink}" font-family="Helvetica,Arial,sans-serif" font-size="11" letter-spacing="3">GIFT CARD</text>
<text x="40" y="150" fill="${color.amount}" font-family="Georgia,serif" font-style="italic" font-size="30">ScentScape</text>
<line x1="40" y1="164" x2="200" y2="164" stroke="${color.line}"/>
</g>
</svg>`;
}

/** Bildadresse der Gift Card in der Farbe `colorName` ("Burdeos", …) */
export function giftCardImage(colorName) {
  const color = GIFT_COLORS.find((item) => item.name === colorName) ?? GIFT_COLORS[0];
  return `data:image/svg+xml,${encodeURIComponent(cardSvg(color))}`;
}

/** Bild einer Warenkorb-Zeile. Gift Cards zeichnen wir neu, so passt es auch bei alten Einträgen. */
export function lineImageOf(item) {
  return item.giftCard ? giftCardImage(item.color) : item.image;
}
