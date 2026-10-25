/* Seite "Reseñas" und Bewertungskarten (Texte aus der Vorlage). */

export const RATING_LABELS = [
  'Toca una estrella',
  'Malo',
  'Regular',
  'Bueno',
  'Muy bueno',
  'Excelente',
];

export const REVIEW_LIMITS = { name: 40, city: 40, phone: 20, text: 300, minText: 10 };

/* Hintergründe der Bewertungskarten und ihre Neigung in Grad */
export const REVIEW_CARD_COLORS = [
  '#F0D2AA',
  '#EBC193',
  '#F3DFC1',
  '#E2BC98',
  '#EDCBA4',
  '#F2D9B8',
];
export const REVIEW_CARD_TILTS = [-2, 1.6, -1, 2.2, -1.6, 1.2];

export const REVIEW_TITLE = [
  ['Escribe ', false],
  ['tu reseña', true],
];

/* Hinweis unter dem Knopf: was noch fehlt */
export const REVIEW_MISSING = {
  rating: 'Elige una calificación para continuar.',
  name: 'Escribe tu nombre.',
  phone: 'Escribe tu WhatsApp. No se publica, solo lo usamos para verificar la compra.',
  text: 'Tu reseña necesita al menos 10 caracteres.',
  ready: 'Todo listo. Revisaremos tu reseña antes de publicarla.',
  send: 'No se pudo enviar tu reseña. Intenta de nuevo.',
};

/* Karussell: Karten je Seite sichtbar, Grundtempo (Karten pro Sekunde) */
export const CAROUSEL = { maxCards: 40, speed: 0.28, maxBoost: 7 };
