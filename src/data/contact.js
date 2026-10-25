/* Kontaktwege der Seite "Contacto" (Texte aus der Vorlage) */
import {
  EMAIL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_DISPLAY,
  WHATSAPP_NUMBER,
} from '../scripts/config.js';

export const CONTACT_TITLE = [
  ['Contáct', false],
  ['anos', true],
];

/* icon: 'whatsapp' zeigt das grüne WhatsApp-Zeichen, sonst ein Name aus data/icons.js */
export const CONTACT_CHANNELS = [
  {
    label: 'WhatsApp',
    value: PHONE_DISPLAY,
    text: 'Pedidos, dudas y asesoría personalizada. Canal principal de atención.',
    cta: 'Abrir chat',
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    icon: 'whatsapp',
  },
  {
    label: 'Instagram',
    value: INSTAGRAM_HANDLE,
    text: 'Síguenos para ver novedades, lanzamientos y contenido de fragancias.',
    cta: 'Ver perfil',
    href: INSTAGRAM_URL,
    icon: 'instagram',
  },
  {
    label: 'Correo electrónico',
    value: EMAIL,
    text: 'Para consultas formales o temas administrativos.',
    cta: 'Enviar correo',
    href: `mailto:${EMAIL}`,
    icon: 'mail',
  },
  {
    label: 'Ubicación',
    value: 'Medellín, Colombia',
    text: 'Envíos a todo el país.',
    cta: 'Ver en el mapa',
    href: 'https://maps.google.com/?q=Medell%C3%ADn,+Colombia',
    icon: 'pin',
  },
];
