/* Kontaktwege auf der Seite "Contacto" */
import { EMAIL, INSTAGRAM_HANDLE, INSTAGRAM_URL, PHONE_DISPLAY } from '../scripts/config.js';
import { whatsappUrl } from '../scripts/utils/whatsapp.js';

export const CONTACT_CHANNELS = [
  {
    label: 'WhatsApp',
    value: PHONE_DISPLAY,
    text: 'Pedidos, dudas y asesoría personalizada. Canal principal de atención.',
    cta: 'Abrir chat',
    href: whatsappUrl('Hola ScentScape'),
    icon: '/assets/img/whatsapp_white.svg',
  },
  {
    label: 'Instagram',
    value: INSTAGRAM_HANDLE,
    text: 'Síguenos para ver novedades, lanzamientos y contenido de fragancias.',
    cta: 'Ver perfil',
    href: INSTAGRAM_URL,
    icon: '/assets/img/instagram_white.svg',
  },
  {
    label: 'Correo electrónico',
    value: EMAIL,
    compact: true,
    text: 'Para consultas formales o temas administrativos.',
    cta: 'Enviar correo',
    href: `mailto:${EMAIL}`,
  },
  {
    label: 'Ubicación',
    value: 'Medellín, Colombia',
    text: 'Envíos a todo el país.',
  },
];
