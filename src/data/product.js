/* Inhalte der Produktdetailseite */

export const SHIPPING_ITEMS = [
  'Envíos a todo Colombia desde Medellín.',
  'Envío gratis en compras desde $500.000 COP.',
  'Recibirás la guía de seguimiento por WhatsApp.',
  'Paga de forma segura en línea o coordina tu pago por WhatsApp.',
];

export const ORIGINAL_ITEMS = [
  'Todas nuestras fragancias son 100 % originales.',
  'Cada perfume cuenta con verificación de autenticidad.',
];

/* Handy: drei kurze Versprechen unter dem Kaufbereich (ProductTrust.astro) */
export const TRUST_ITEMS = [
  { icon: 'truck', title: 'Envío gratis', text: 'desde $500.000' },
  { icon: 'shield', title: '100 % original', text: 'garantizado' },
  { icon: 'lock', title: 'Pago seguro', text: 'en línea o WhatsApp' },
];

/* Logos im Akkordeon "Envíos y pagos". Ohne Datei: Name als Schrift in der Markenfarbe */
export const PAYMENT_LOGOS = [
  { name: 'VISA', file: 'visa.svg', height: 16 },
  { name: 'Mastercard', file: 'mastercard.svg', height: 28 },
  { name: 'PSE', color: '#1D4F9C' },
  { name: 'Nequi', file: 'nequi.svg', height: 22 },
  { name: 'Bancolombia', file: 'bancolombia.svg', height: 14 },
  { name: 'Daviplata', color: '#E1251B' },
];
