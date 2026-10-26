/*
 * Seite "Finalizar compra" (/checkout/): Felder, Zahlungsarten und Texte.
 * section: in welchem Block das Feld steht. row: Felder mit derselben Zahl stehen nebeneinander.
 * missing: Hinweis, wenn ein Pflichtfeld leer ist.
 */
export const CHECKOUT_FIELDS = [
  {
    section: 'contact',
    name: 'name',
    label: 'Nombre completo',
    placeholder: 'Ej. María García',
    autocomplete: 'name',
    missing: 'Escribe tu nombre completo.',
  },
  {
    section: 'contact',
    name: 'phone',
    label: 'Celular (WhatsApp)',
    placeholder: 'Ej. 300 123 4567',
    autocomplete: 'tel-national',
    type: 'tel',
    row: 1,
    missing: 'Escribe tu número de celular.',
  },
  {
    section: 'contact',
    name: 'email',
    label: 'Correo',
    placeholder: 'Para tu comprobante',
    autocomplete: 'email',
    type: 'email',
    row: 1,
    optional: true,
  },
  {
    section: 'delivery',
    name: 'department',
    label: 'Departamento',
    autocomplete: 'address-level1',
    kind: 'select',
    row: 2,
    missing: 'Elige tu departamento.',
  },
  {
    section: 'delivery',
    name: 'city',
    label: 'Ciudad o municipio',
    placeholder: 'Ej. Medellín',
    autocomplete: 'address-level2',
    row: 2,
    missing: 'Escribe tu ciudad.',
  },
  {
    section: 'delivery',
    name: 'address',
    label: 'Dirección',
    placeholder: 'Ej. Calle 10 # 43-25, apto 502',
    autocomplete: 'street-address',
    missing: 'Escribe tu dirección.',
  },
  {
    section: 'delivery',
    name: 'district',
    label: 'Barrio',
    placeholder: 'Ej. Laureles',
    row: 3,
    missing: 'Escribe tu barrio.',
  },
  {
    section: 'delivery',
    name: 'reference',
    label: 'Referencia',
    placeholder: 'Ej. Frente al parque',
    row: 3,
    optional: true,
  },
  {
    section: 'delivery',
    name: 'notes',
    label: 'Notas del pedido',
    placeholder: '¿Es un regalo? ¿Alguna indicación para la entrega?',
    kind: 'textarea',
    optional: true,
  },
];

export const DEPARTMENTS = [
  'Amazonas',
  'Antioquia',
  'Arauca',
  'Atlántico',
  'Bogotá D.C.',
  'Bolívar',
  'Boyacá',
  'Caldas',
  'Caquetá',
  'Casanare',
  'Cauca',
  'Cesar',
  'Chocó',
  'Córdoba',
  'Cundinamarca',
  'Guainía',
  'Guaviare',
  'Huila',
  'La Guajira',
  'Magdalena',
  'Meta',
  'Nariño',
  'Norte de Santander',
  'Putumayo',
  'Quindío',
  'Risaralda',
  'San Andrés y Providencia',
  'Santander',
  'Sucre',
  'Tolima',
  'Valle del Cauca',
  'Vaupés',
  'Vichada',
];

/* Zahlungsarten. "bold" erscheint nur, wenn nexomar Bold für den Shop eingeschaltet hat. */
export const PAYMENT_METHODS = [
  {
    id: 'bold',
    icon: 'card',
    title: 'Pago en línea',
    sub: 'Tarjeta, PSE, Nequi o Botón Bancolombia',
    note: 'Pagas en una ventana segura de Bold, sin salir de ScentScape.',
    button: 'Pagar',
  },
  {
    id: 'whatsapp',
    icon: 'send',
    title: 'Por WhatsApp',
    sub: 'Acordamos el pago contigo',
    note: 'Te enviamos el pedido por WhatsApp y acordamos contigo el pago y el envío.',
    button: 'Enviar pedido por WhatsApp',
  },
];

export const MIN_PHONE_DIGITS = 7;

export const CHECKOUT_ERRORS = {
  phone: 'Revisa tu número de celular.',
  email: 'Revisa tu correo.',
  empty: 'Tu bolsa está vacía.',
  terms: 'Acepta los términos para continuar.',
  network: 'No pudimos conectar. Revisa tu internet e intenta de nuevo.',
  bold: 'No pudimos abrir el pago en línea. Intenta de nuevo o elige WhatsApp.',
};

export const CHECKOUT_TITLE = [
  ['Tu pedido, ', false],
  ['casi listo.', true],
];

/*
 * Seite "Gracias" (/checkout/gracias/): ein Text je Stand des Pedidos.
 * actions: welche Knöpfe erscheinen (features/checkout/thanks-view.js).
 */
export const THANKS_STATES = {
  whatsapp: {
    seal: 'send',
    title: '¡Pedido enviado!',
    lead: 'Te escribimos por WhatsApp para coordinar el pago y el envío. Si el chat no se abrió, usa el botón.',
    actions: ['whatsapp', 'shop'],
  },
  checking: {
    seal: 'card',
    title: 'Confirmando tu pago…',
    lead: 'Bold nos está enviando la confirmación. Esto toma unos segundos.',
    actions: [],
  },
  pagado: {
    seal: 'heart',
    title: '¡Pago recibido!',
    lead: 'Gracias por tu compra. Ya estamos preparando tu pedido.',
    actions: ['shop'],
  },
  en_proceso: {
    seal: 'card',
    title: 'Tu pago está en proceso',
    lead: 'Bold todavía está confirmando tu pago; con PSE puede tardar unos minutos. Tu pedido ya quedó registrado.',
    actions: ['check'],
  },
  rechazado: {
    seal: 'card',
    title: 'El pago no se completó',
    lead: 'Bold no aprobó el pago. Puedes intentarlo de nuevo o pedir por WhatsApp.',
    actions: ['retry', 'chat'],
  },
  pendiente: {
    seal: 'card',
    title: 'Aún no recibimos la confirmación',
    lead: 'Si ya pagaste, la confirmación llega en unos minutos. Si cerraste la ventana de Bold, puedes pagar ahora.',
    actions: ['check', 'retry'],
  },
  cancelado: {
    seal: 'bag',
    title: 'Este pedido ya no está activo',
    lead: 'No recibimos el pago a tiempo. Tu bolsa sigue guardada: puedes hacer el pedido de nuevo.',
    actions: ['checkout'],
  },
  missing: {
    seal: 'bag',
    title: 'No encontramos tu pedido',
    lead: 'Si ya hiciste un pedido, escríbenos por WhatsApp y lo revisamos contigo.',
    actions: ['chat', 'shop'],
  },
};

export const THANKS_ACTIONS = {
  whatsapp: { label: 'Abrir WhatsApp', primary: true },
  shop: { label: 'Seguir comprando', href: '/productos/' },
  check: { label: 'Consultar de nuevo', primary: true },
  retry: { label: 'Pagar ahora', primary: true },
  chat: { label: 'Escribir por WhatsApp' },
  checkout: { label: 'Volver al pedido', href: '/checkout/', primary: true },
};
