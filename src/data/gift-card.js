/* Gift Card: Farben, feste Beträge, Grenzen und Lieferarten (Texte aus der Vorlage). */

export const GIFT_COLORS = [
  {
    name: 'Burdeos',
    background: 'linear-gradient(150deg,#6E1824,#531019 60%,#3d0211)',
    ink: '#F0D2AA',
    amount: '#F6E3C6',
    line: 'rgba(240,210,170,.45)',
    glow: 'rgba(83,16,25,.6)',
    logo: 'none',
  },
  {
    name: 'Azul noche',
    background: 'linear-gradient(150deg,#262c63,#1E2342 60%,#12152B)',
    ink: '#F0D2AA',
    amount: '#F6E3C6',
    line: 'rgba(240,210,170,.4)',
    glow: 'rgba(38,44,99,.7)',
    logo: 'none',
  },
  {
    name: 'Champán',
    background: 'linear-gradient(150deg,#F7E6CB,#E2C193 60%,#C9A06E)',
    ink: '#1E2342',
    amount: '#1E2342',
    line: 'rgba(30,35,66,.3)',
    glow: 'rgba(240,190,145,.35)',
    logo: 'brightness(0) opacity(.85)',
  },
  {
    name: 'Negro',
    background: 'linear-gradient(150deg,#2b2b31,#141417 60%,#050506)',
    ink: '#F0BE91',
    amount: '#F0D2AA',
    line: 'rgba(240,190,145,.4)',
    glow: 'rgba(240,190,145,.18)',
    logo: 'none',
  },
];

export const GIFT_AMOUNTS = [100000, 200000, 300000, 500000];
export const GIFT_DEFAULT_AMOUNT = 200000;

export const GIFT_DELIVERY = [
  {
    title: 'Digital por WhatsApp',
    sub: 'La enviamos al instante con tu mensaje',
    hint: 'Te pediremos el número de WhatsApp al finalizar la compra.',
  },
  {
    title: 'Impresa, con el pedido',
    sub: 'Tarjeta física dentro de tu envío',
    hint: 'La tarjeta impresa viaja dentro de tu pedido.',
  },
];

export const GIFT_TITLE = [
  ['Regala ', false],
  ['un aroma.', true],
];

export const GIFT_DEFAULTS = {
  to: 'alguien especial',
  from: 'ti',
  message: 'Tu mensaje aparecerá aquí.',
};

export const GIFT_LIMITS = { name: 30, message: 160 };
