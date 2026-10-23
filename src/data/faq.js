/* Häufige Fragen auf der Startseite. link: optionaler Button unter der Antwort. */
export const FAQ_GROUPS = [
  {
    label: 'Envíos',
    items: [
      {
        question: '¿Hacen envíos a toda Colombia?',
        answer: 'Sí. Enviamos desde Medellín a cualquier ciudad de Colombia.',
      },
      {
        question: '¿Cuánto cuesta el envío?',
        answer:
          'El envío es gratis en compras desde $500.000. Para pedidos menores te confirmamos el valor por WhatsApp según tu ciudad.',
      },
      {
        question: '¿Cuánto tarda en llegar mi pedido?',
        answer:
          'Depende de tu ciudad. Al confirmar tu pedido por WhatsApp te indicamos el tiempo estimado de entrega.',
      },
    ],
  },
  {
    label: 'Medios de pago',
    items: [
      {
        question: '¿Qué medios de pago aceptan?',
        answer:
          'Nequi, Daviplata, Bancolombia / PSE, tarjeta de crédito o débito con Wompi y pago contraentrega.',
      },
      {
        question: '¿Cómo pago por WhatsApp o en efectivo?',
        answer:
          'En el carrito elige “WhatsApp o efectivo”. Se abre WhatsApp con tu pedido y allí acordamos contigo el pago.',
      },
      {
        question: '¿Puedo pagar a cuotas?',
        answer: 'Muy pronto podrás pagar en 4 cuotas con Addi, sin tarjeta de crédito.',
      },
    ],
  },
  {
    label: 'Originalidad',
    items: [
      {
        question: '¿Los perfumes son originales?',
        answer:
          'Sí. Cada perfume llega sellado de fábrica y con su código de lote impreso en la caja.',
      },
      {
        question: '¿Cómo verifico mi perfume?',
        answer:
          'Escanea el QR de la tarjeta que viene en el empaque o entra a la sección Original garantizado y sigue los pasos.',
        link: { label: 'Verificar mi lote', href: '/original/' },
      },
    ],
  },
  {
    label: 'Regalos',
    items: [
      {
        question: '¿Puedo enviarlo como regalo?',
        answer:
          'Sí. Marca “Es un regalo” en el carrito: añadimos una nota escrita a mano, el paquete va sin precio y puedes elegir la fecha de entrega.',
      },
      {
        question: '¿Tienen gift cards?',
        answer: 'Sí, una gift card digital con el monto que elijas para comprar en la tienda.',
        link: { label: 'Ver gift cards', href: '/gift-card/' },
      },
    ],
  },
  {
    label: 'Asesoría',
    items: [
      {
        question: 'No sé qué perfume elegir',
        answer:
          'Haz nuestro test olfativo o escríbenos: Sara y Brayan te asesoran en persona por WhatsApp.',
        link: { label: 'Hacer el test', href: '/#test', action: 'open-quiz' },
      },
    ],
  },
];
