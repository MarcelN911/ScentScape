import { ADDI_ENABLED } from '../scripts/config.js';

const ADDI = {
  key: 'addi',
  title: 'Addi · 4 cuotas',
  text: 'Paga en cuotas sin tarjeta de crédito.',
  tag: 'Addi',
  tagColor: '#00b4e6',
  cta: 'Continuar con Addi · 4 cuotas',
  note: 'Paga en cuotas sin tarjeta de crédito.',
};

/* Zahlungsarten im Warenkorb. Alle führen zur Checkout-Seite (Lieferdaten + Bestellung speichern). */
export const PAY_MODES = [
  {
    key: 'wa',
    title: 'WhatsApp o efectivo',
    text: 'Nequi, Daviplata, transferencia o contraentrega. Coordinamos el pago contigo.',
    tag: 'WhatsApp',
    tagColor: '#25D366',
    cta: 'Finalizar por WhatsApp',
    note: 'Completa tus datos de envío y te abrimos WhatsApp con tu pedido.',
  },
  {
    key: 'card',
    title: 'Tarjeta crédito o débito',
    text: 'Pago seguro en línea con Wompi. También PSE.',
    tag: 'Wompi',
    tagColor: '#151932',
    cta: 'Pagar con tarjeta',
    note: 'Pago seguro con Wompi · Visa · Mastercard · Amex · PSE',
  },
  ...(ADDI_ENABLED ? [ADDI] : []),
];

export function payModeOf(key) {
  return PAY_MODES.find((mode) => mode.key === key) ?? PAY_MODES[0];
}
