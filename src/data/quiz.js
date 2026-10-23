/* Test olfativo: drei Fragen. key: Feld in den Antworten */
export const QUIZ_STEPS = [
  { key: 'who', question: '¿Para quién es?', options: ['Dama', 'Caballero', 'Sin etiquetas'] },
  { key: 'when', question: '¿Cuándo lo vas a usar?', options: ['De día', 'De noche', 'Siempre'] },
  {
    key: 'vibe',
    question: '¿Qué te atrae?',
    options: ['Dulce', 'Especiada', 'Floral', 'Amaderada', 'Fresca'],
  },
];

/* Für den Satz "Porque buscas algo …" */
export const VIBE_WORDS = {
  Dulce: 'dulce',
  Especiada: 'especiado',
  Floral: 'floral',
  Amaderada: 'amaderado',
  Fresca: 'fresco',
};

/* Diese Familien kommen je nach Tageszeit zuerst */
export const TIME_FAMILIES = {
  'De noche': ['Especiada', 'Amaderada', 'Dulce'],
  'De día': ['Fresca', 'Floral'],
};
