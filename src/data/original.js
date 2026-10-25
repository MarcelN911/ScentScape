/*
 * Seite "Original garantizado". Ein eigenes Code-Register gibt es in nexomar nicht:
 * Der Lote-Code wird per WhatsApp vom Team bestätigt (Herkunft und Produktionsdatum).
 */

export const ORIGINAL_TITLE = [
  ['Verifica ', false],
  ['tu ', true],
  ['perfume.', true],
];

/* Erlaubt: Großbuchstaben, Ziffern, Bindestrich, 4–14 Zeichen */
export const LOT_PATTERN = /^[A-Z0-9-]{4,14}$/;
export const LOT_MAX = 14;

export const LOT_SPOTS = [
  { title: 'Base de la caja', text: 'Impreso o grabado cerca del código de barras.' },
  { title: 'Base del frasco', text: 'Debe coincidir con el código de la caja.' },
  {
    title: 'Sello de fábrica',
    text: 'El celofán original llega intacto. Si está roto, escríbenos antes de abrirlo.',
  },
];
