/* Seite "Test Olfativo": vier Fragen und die Pyramide links. */

export const QUIZ_TITLE = [
  ['Encuentra ', false],
  ['tu ', true],
  ['aroma.', true],
];

export const QUIZ_GENDERS = [
  { label: 'Dama', gender: 'D' },
  { label: 'Caballero', gender: 'C' },
  { label: 'Unisex', gender: 'U' },
];

/* title, sub, Adjektiv für "Tu perfil", Zeitpunkt für den Satz darunter */
export const QUIZ_MOMENTS = [
  { title: 'Día', sub: 'Oficina, brunch y diario', adjective: 'diurno', when: 'el día' },
  { title: 'Noche', sub: 'Cenas y salidas', adjective: 'nocturno', when: 'la noche' },
  {
    title: 'Ocasión especial',
    sub: 'Eventos y celebraciones',
    adjective: 'de gala',
    when: 'ocasiones especiales',
  },
];

export const QUIZ_INTENSITIES = ['Suave', 'Moderada', 'Intensa'];

export const MAX_FAMILIES = 3;

/* Stufe der Pyramide, in die eine Familie fällt (0 Salida, 1 Corazón, 2 Fondo) */
export const TIER_OF_FAMILY = {
  Cítrico: 0,
  Fresco: 0,
  Frutal: 0,
  Floral: 1,
  Especiado: 1,
  Amaderado: 2,
  Oriental: 2,
  Dulce: 2,
};

export const QUIZ_TIERS = [
  {
    label: 'Salida',
    width: 40,
    clip: 'polygon(50% 0,100% 100%,0 100%)',
    fill: 'linear-gradient(180deg,#F6E3C6,#F0D2AA)',
  },
  {
    label: 'Corazón',
    width: 70,
    clip: 'polygon(21.4% 0,78.6% 0,100% 100%,0 100%)',
    fill: 'linear-gradient(180deg,#F0BE91,#B88D58)',
  },
  {
    label: 'Fondo',
    width: 100,
    clip: 'polygon(15% 0,85% 0,100% 100%,0 100%)',
    fill: 'linear-gradient(180deg,#6E1824,#531019)',
  },
];
