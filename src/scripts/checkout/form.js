/* Liest und prüft das Formular mit den Lieferdaten. */
import { CHECKOUT_ERRORS, CHECKOUT_FIELDS, MIN_PHONE_DIGITS } from '../../data/checkout.js';

export function readCustomer(form) {
  const data = new FormData(form);
  const entries = CHECKOUT_FIELDS.map((field) => [field.name, String(data.get(field.name)).trim()]);
  return Object.fromEntries(entries);
}

function firstMissingField(customer) {
  return CHECKOUT_FIELDS.find((field) => field.required && !customer[field.name]);
}

/** Gibt { message, field } zurück, wenn etwas fehlt, sonst null. */
export function checkCustomer(customer, items) {
  if (!items.length) return { message: CHECKOUT_ERRORS.empty };
  const missing = firstMissingField(customer);
  if (missing) return { message: CHECKOUT_ERRORS.missing, field: missing.name };
  if (customer.phone.replace(/\D/g, '').length < MIN_PHONE_DIGITS) {
    return { message: CHECKOUT_ERRORS.phone, field: 'phone' };
  }
  return null;
}
