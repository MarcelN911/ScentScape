/* Inhalte der Produktdetailseite */

/* Galerie: Vorderansicht, zwei Detail-Zooms (Ursprung + Vergrößerung) und die Noten */
export const GALLERY_SLIDES = [
  { label: 'Vista frontal' },
  { label: 'Detalle de la tapa', origin: '50% 12%', scale: 2.4 },
  { label: 'Detalle de la etiqueta', origin: '50% 64%', scale: 2.1 },
  { label: 'Sus notas', notes: true },
];

export const GALLERY_AUTOPLAY_MS = 5500;

/* Positionen der Noten-Kreise um die Flasche (Prozent von links / oben) */
export const ORBIT_POSITIONS = [
  [18, 24],
  [82, 22],
  [12, 60],
  [88, 58],
  [28, 88],
  [72, 88],
];

export const SHIPPING_TEXT =
  'Envíos a todo Colombia. Envío gratis en compras desde $500.000. Al finalizar la compra completas tus datos de envío y confirmamos tu pedido por WhatsApp.';

export const ORIGINAL_TEXT =
  'Llega sellado de fábrica, con su código de lote impreso en la caja. Puedes verificarlo en la sección Original garantizado o escribiéndonos por WhatsApp.';

export const TRUST_ITEMS = [
  'Envíos a todo Colombia',
  'Envío gratis desde $500.000',
  'Original garantizado',
  'Sellado de fábrica',
  'Pago contraentrega',
];
