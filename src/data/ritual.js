/* Seite "El Ritual": so wird jeder Pedido verpackt (Texte und Fotos aus der Vorlage). */

export const RITUAL_TRUST = ['Original garantizado', 'Empacado a mano', 'Envíos a toda Colombia'];

/* Satz im Intro: die letzten Wörter stehen kursiv */
export const RITUAL_INTRO =
  'Cada pedido pasa por nuestras manos. Lo envolvemos, lo sellamos y lo firmamos para ti.';
export const RITUAL_INTRO_ITALIC = 2;

/*
 * Fünf Momente. image: null → noch kein Foto ("Manos envolviendo la seda" fehlt noch),
 * dann zeigt die Fläche nur die Seidenfarbe. visual: 'cards' → gezeichnete Tarjetas statt Foto.
 */
export const RITUAL_MOMENTS = [
  {
    title: ['La ', 'seda'],
    text: 'Tu caja original, sellada de fábrica, se envuelve a mano en papel de seda, sin abrirla. Un color por pedido: bordeaux o azul noche.',
    image: null,
    tag: 'La seda',
    swatches: [
      { name: 'Night bordeaux', color: '#6e1824' },
      { name: 'Space indigo', color: '#232a5c' },
    ],
  },
  {
    title: ['El ', 'sello'],
    text: 'Un sticker negro con nuestro símbolo en foil durazno cierra la seda. Nadie la abre antes que tú.',
    image: '/assets/img/ritual-a.jpeg',
    alt: 'Sticker negro con el símbolo ScentScape en foil durazno sobre papel de seda bordeaux',
    tag: 'El sello',
    flip: true,
  },
  {
    title: ['Faja y ', 'lacre'],
    text: 'Una faja negra mate abraza el empaque y la sella un lacre cobre con el símbolo de ScentScape. El detalle que convierte un perfume en un regalo.',
    image: '/assets/img/ritual-b.jpeg',
    alt: 'Empaque en seda bordeaux con tarjeta negra, faja negra mate y lacre cobre',
    tag: 'Faja y lacre',
  },
  {
    title: ['Tu ', 'tarjeta'],
    text: 'Cada perfume viaja con su tarjeta: sus notas de salida, corazón y fondo, cómo usarlo y la firma de quien lo preparó para ti.',
    visual: 'cards',
    rows: [
      ['Notas olfativas', 'Salida · Corazón · Fondo'],
      ['Código QR', 'Conoce su historia'],
      ['Firma', 'Sara & Brayan'],
    ],
  },
  {
    title: ['La ', 'bolsa'],
    text: 'Todo llega en nuestra bolsa negra con el logo en foil, junto a una tarjeta de gracias con un regalo para tu próxima compra.',
    image: '/assets/img/ritual-c.jpeg',
    alt: 'Bolsa negra ScentScape con logo en foil, empaque bordeaux y tarjeta de gracias',
    tag: 'La bolsa',
  },
];

/* Beispiel auf der gezeichneten Tarjeta (Momento 04) */
export const RITUAL_CARD = {
  name: ['Intense ', 'Starry Nights'],
  brand: 'Montale Paris · Floral ámbar',
  notes: [
    ['Salida', 'bergamota, limón'],
    ['Corazón', 'rosa, jazmín, pachulí'],
    ['Fondo', 'ámbar, vainilla, almizcle'],
  ],
};

export const RITUAL_BENEFITS = [
  ['Original garantizado', 'Perfumería sellada de fábrica, verificable con su código.'],
  ['Envíos a toda Colombia', 'Desde Medellín, con guía de seguimiento por WhatsApp.'],
  ['Pago contra entrega', 'Paga cuando tengas tu ritual en las manos.'],
];
