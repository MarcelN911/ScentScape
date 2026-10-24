/*
 * Fragen und Antworten.
 * CHAT_QUESTIONS: Handy-Chat auf Produktseite und Servicios
 * FAQ_QUESTIONS: Seite "Te asesoramos" (mit Kategorie und optionalem Link)
 */
export const CHAT_GREETING =
  'Hola, somos Sara y Brayan de ScentScape. Elige una pregunta y te respondemos aquí mismo.';

export const CHAT_QUESTIONS = [
  ['¿Hacen envíos a todo Colombia?', 'Sí. Enviamos a todo Colombia desde Medellín.'],
  ['¿Desde qué valor el envío es gratis?', 'El envío es gratis en pedidos desde $500.000 COP.'],
  [
    '¿Cómo sé qué perfume elegir?',
    'Completa nuestro test de perfil olfativo y te recomendamos el perfume ideal para ti en minutos. También puedes escribirnos por WhatsApp para una asesoría personalizada.',
  ],
  [
    '¿Qué tamaños están disponibles?',
    'Cada fragancia muestra sus presentaciones disponibles en su página de producto.',
  ],
  ['¿Dónde se encuentra ScentScape?', 'ScentScape nace en Medellín, Colombia, en 2024.'],
  [
    '¿Cómo puedo contactarlos?',
    'Por WhatsApp al +57 321 810 1882 o por Instagram en @Scentscapeparfums_.',
  ],
].map(([question, answer]) => ({ question, answer }));

export const FAQ_GREETING =
  'Hola, somos Sara y Brayan de ScentScape. Toca una pregunta y te respondemos aquí mismo.';

export const FAQ_QUESTIONS = [
  {
    category: 'Envíos',
    question: '¿Hacen envíos a toda Colombia?',
    answer: 'Sí. Enviamos desde Medellín a cualquier ciudad de Colombia.',
  },
  {
    category: 'Envíos',
    question: '¿Desde qué valor el envío es gratis?',
    answer:
      'El envío es gratis en compras desde $500.000. Para pedidos menores te confirmamos el valor por WhatsApp según tu ciudad.',
  },
  {
    category: 'Asesoría',
    question: '¿Cómo sé qué perfume elegir?',
    answer:
      'Completa nuestro test de perfil olfativo y te recomendamos el perfume ideal para ti en minutos. También puedes escribirnos por WhatsApp para una asesoría personalizada.',
    link: { label: 'Hacer el test', href: '/test-olfativo/' },
  },
  {
    category: 'Asesoría',
    question: '¿Qué tamaños están disponibles?',
    answer: 'Cada fragancia muestra sus presentaciones disponibles en su página de producto.',
  },
  {
    category: 'ScentScape',
    question: '¿Dónde se encuentra ScentScape?',
    answer: 'ScentScape nace en Medellín, Colombia, en 2024.',
  },
  {
    category: 'ScentScape',
    question: '¿Cómo puedo contactarlos?',
    answer: 'Por WhatsApp al +57 321 810 1882 o por Instagram en @Scentscapeparfums_.',
  },
];
