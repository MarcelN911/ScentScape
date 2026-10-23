/* Formular und Schritte der Checkout-Seite */

/* name: Feldname, wide: über die ganze Breite, required: Pflichtfeld */
export const CHECKOUT_FIELDS = [
  {
    name: 'name',
    label: 'Nombre completo',
    placeholder: 'Ej. María García',
    type: 'text',
    autocomplete: 'name',
    wide: true,
    required: true,
  },
  {
    name: 'phone',
    label: 'Celular',
    placeholder: 'Ej. 300 123 4567',
    type: 'tel',
    autocomplete: 'tel',
    required: true,
  },
  {
    name: 'city',
    label: 'Ciudad',
    placeholder: 'Ej. Medellín',
    type: 'text',
    autocomplete: 'address-level2',
    required: true,
  },
  {
    name: 'district',
    label: 'Barrio / Sector',
    placeholder: 'Ej. El Poblado, Laureles, Envigado...',
    type: 'text',
    autocomplete: 'off',
  },
  {
    name: 'address',
    label: 'Dirección',
    placeholder: 'Ej. Calle 10 # 43-25',
    type: 'text',
    autocomplete: 'street-address',
    wide: true,
    required: true,
  },
  {
    name: 'reference',
    label: 'Lugar de referencia (opcional)',
    placeholder: 'Ej. Frente al parque, edificio azul...',
    type: 'text',
    autocomplete: 'off',
    wide: true,
  },
];

export const CHECKOUT_STEPS = [
  { number: 'I', label: 'Envío' },
  { number: 'II', label: 'Pago' },
  { number: 'III', label: 'Confirmación' },
];

export const MIN_PHONE_DIGITS = 7;

export const CHECKOUT_ERRORS = {
  missing: 'Completa nombre, celular, ciudad y dirección.',
  phone: 'Revisa tu número de celular.',
  empty: 'Tu carrito está vacío.',
};

/* Was nach dem Absenden auf dem Button steht und was im Text unter der Zahlungsart steht */
export const CHECKOUT_MODE_TEXT = {
  wa: 'Al continuar te abrimos WhatsApp con tu pedido. Coordinamos el pago contigo: Nequi, Daviplata, transferencia o contraentrega.',
  card: 'Te enviamos por WhatsApp un enlace de pago seguro de Wompi para pagar con tarjeta o PSE. No guardamos los datos de tu tarjeta.',
  addi: 'Te enviamos por WhatsApp el enlace de Addi para aprobar tu crédito en minutos y pagar en 4 cuotas.',
};
