/*
 * Formular "Finalizar pedido" in der Bolsa.
 * row: Felder mit derselben Zahl stehen nebeneinander. missing: Hinweis, wenn ein Pflichtfeld leer ist.
 */
export const CHECKOUT_FIELDS = [
  {
    name: 'name',
    label: 'Nombre completo',
    placeholder: 'Ej. María García',
    autocomplete: 'name',
    missing: 'Por favor ingresa tu nombre completo.',
  },
  {
    name: 'phone',
    label: 'Celular',
    placeholder: 'Ej. 300 123 4567',
    autocomplete: 'tel',
    type: 'tel',
    missing: 'Por favor ingresa tu número de celular.',
  },
  {
    name: 'city',
    label: 'Ciudad',
    placeholder: 'Ej. Medellín',
    autocomplete: 'address-level2',
    row: 1,
    missing: 'Por favor ingresa tu ciudad.',
  },
  {
    name: 'district',
    label: 'Barrio / Sector',
    placeholder: 'Ej. Laureles',
    row: 1,
    missing: 'Por favor ingresa tu barrio o sector.',
  },
  {
    name: 'address',
    label: 'Dirección',
    placeholder: 'Ej. Calle 10 # 43-25',
    autocomplete: 'street-address',
    missing: 'Por favor ingresa tu dirección.',
  },
  {
    name: 'reference',
    label: 'Lugar de referencia',
    placeholder: 'Ej. Frente al parque',
    optional: true,
  },
];

export const MIN_PHONE_DIGITS = 7;

export const CHECKOUT_ERRORS = {
  phone: 'Revisa tu número de celular.',
  empty: 'Tu bolsa está vacía.',
};
