import { WHATSAPP_NUMBER } from '../config.js';

export function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function shareUrl(message) {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message) {
  window.open(whatsappUrl(message), '_blank', 'noopener');
}
