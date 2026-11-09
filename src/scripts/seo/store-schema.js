/*
 * Strukturierte Daten (schema.org) zum Geschäft, für die Startseite.
 * ScentScape verkauft nur online (kein Laden): deshalb OnlineStore, mit Medellín
 * als Sitz und ganz Kolumbien als Liefergebiet. Google kann damit Name, Logo,
 * Kontakt und Instagram zur Marke zeigen.
 */
import { EMAIL, INSTAGRAM_URL, PHONE_DISPLAY, SITE_URL } from '../config.js';

const STORE_ID = `${SITE_URL}/#store`;

/* Wie in den Términos (Punkt 5, Derecho de retracto): 5 días hábiles, Rückversand zahlt der Kunde */
const RETURN_POLICY = {
  '@type': 'MerchantReturnPolicy',
  applicableCountry: 'CO',
  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
  merchantReturnDays: 5,
  returnMethod: 'https://schema.org/ReturnByMail',
  returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
  merchantReturnLink: `${SITE_URL}/terminos/`,
};

const STORE = {
  '@type': 'OnlineStore',
  '@id': STORE_ID,
  name: 'ScentScape',
  alternateName: 'ScentScape Parfums',
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/assets/img/scentscape-logo.png`,
  image: `${SITE_URL}/assets/img/scentscape-logo.png`,
  description:
    'Tienda online de perfumes para dama, caballero y unisex desde Medellín, con envíos a todo Colombia.',
  telephone: PHONE_DISPLAY.replace(/\s/g, ''),
  email: EMAIL,
  sameAs: [INSTAGRAM_URL],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Medellín',
    addressRegion: 'Antioquia',
    addressCountry: 'CO',
  },
  areaServed: { '@type': 'Country', name: 'Colombia' },
  currenciesAccepted: 'COP',
  hasMerchantReturnPolicy: RETURN_POLICY,
};

const WEBSITE = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'ScentScape',
  url: `${SITE_URL}/`,
  inLanguage: 'es-CO',
  publisher: { '@id': STORE_ID },
};

export function storeSchema() {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [STORE, WEBSITE] });
}
