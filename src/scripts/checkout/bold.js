/*
 * Öffnet den Checkout von Bold (bold.co) als Fenster über der Seite.
 * Betrag und Signatur kommen von nexomar — nur der Server kennt die geheime Llave.
 * Nach der Zahlung schickt Bold die Kundin auf redirectionUrl (/checkout/gracias/).
 * Doku: https://developers.bold.co/pagos-en-linea/boton-de-pagos/integracion-manual/integracion-personalizada
 */
const SCRIPT_URL = 'https://checkout.bold.co/library/boldPaymentButton.js';
let loading = null;

function injectScript(resolve, reject) {
  const script = document.createElement('script');
  script.src = SCRIPT_URL;
  script.async = true;
  script.onload = () => resolve(window.BoldCheckout);
  script.onerror = () => reject(new Error('Bold no cargó'));
  document.head.append(script);
}

/** Lädt das Skript von Bold einmal; danach gibt es window.BoldCheckout. */
export function loadBold() {
  if (window.BoldCheckout) return Promise.resolve(window.BoldCheckout);
  loading ??= new Promise(injectScript).catch((error) => {
    loading = null;
    throw error;
  });
  return loading;
}

/** 573001234567 → 3001234567: Bold erwartet die Nummer ohne Ländervorwahl. */
function nationalPhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('57') ? digits.slice(2) : digits;
}

function customerJson(customer) {
  const data = { fullName: customer.name, phone: nationalPhone(customer.phone), dialCode: '+57' };
  return JSON.stringify(customer.email ? { ...data, email: customer.email } : data);
}

function billingJson(customer) {
  const { address, city, department } = customer;
  return JSON.stringify({ address, city, state: department, country: 'CO' });
}

/** pago: Antwort von nexomar. checkout: { number, customer, redirectionUrl } */
export function boldConfig(pago, checkout) {
  return {
    ...pago,
    description: `Pedido ScentScape #${checkout.number}`,
    redirectionUrl: checkout.redirectionUrl,
    originUrl: window.location.href,
    renderMode: 'embedded',
    customerData: customerJson(checkout.customer),
    billingAddress: billingJson(checkout.customer),
  };
}

export async function openBold(pago, checkout) {
  const BoldCheckout = await loadBold();
  new BoldCheckout(boldConfig(pago, checkout)).open();
}
