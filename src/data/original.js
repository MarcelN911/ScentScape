/* Seite "Original garantizado" */

/* Bild der versiegelten Box. Solange es fehlt, steht dort ein Platzhalter. */
export const ORIGINAL_IMAGE = null;

export const ORIGINAL_STEPS = [
  {
    title: 'Sellado de fábrica',
    text: 'El perfume viaja con su celofán original intacto. Nunca abrimos, decantamos ni rellenamos una caja.',
  },
  {
    title: 'Código de lote',
    text: 'En la base de la caja hay un código impreso o grabado. Debe coincidir con el que trae el frasco en su base.',
  },
  {
    title: 'Empaque ScentScape',
    text: 'Lo protegemos en nuestro empaque con tarjeta de agradecimiento. El QR de la tarjeta te trae a esta página.',
  },
  {
    title: 'Verifícalo',
    text: 'Escribe el código abajo. Te confirmamos por WhatsApp el origen y la fecha de producción.',
  },
];

/* Erlaubt: Großbuchstaben, Ziffern, Bindestrich, 4–14 Zeichen */
export const LOT_PATTERN = /^[A-Z0-9-]{4,14}$/;
