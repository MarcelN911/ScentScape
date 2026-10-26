/* Liest und prüft die Angaben im Formular "Finalizar compra". */
import { CHECKOUT_ERRORS, CHECKOUT_FIELDS, MIN_PHONE_DIGITS } from '../../data/checkout.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function readCustomer(form) {
  const data = new FormData(form);
  const entries = CHECKOUT_FIELDS.map((field) => [
    field.name,
    String(data.get(field.name) ?? '').trim(),
  ]);
  return Object.fromEntries(entries);
}

function formatError(customer) {
  if (customer.phone.replace(/\D/g, '').length < MIN_PHONE_DIGITS) {
    return { message: CHECKOUT_ERRORS.phone, field: 'phone' };
  }
  if (customer.email && !EMAIL.test(customer.email)) {
    return { message: CHECKOUT_ERRORS.email, field: 'email' };
  }
  return null;
}

/** Gibt { message, field } zurück, wenn etwas fehlt, sonst null. */
export function checkCustomer(form, customer, items) {
  if (!items.length) return { message: CHECKOUT_ERRORS.empty };
  const missing = CHECKOUT_FIELDS.find((field) => !field.optional && !customer[field.name]);
  if (missing) return { message: missing.missing, field: missing.name };
  const error = formatError(customer);
  if (error) return error;
  return form.elements.terms.checked ? null : { message: CHECKOUT_ERRORS.terms, field: 'terms' };
}
