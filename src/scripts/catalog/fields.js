/*
 * Liest einzelne Felder aus einem nexomar-Produkt.
 * Familie und Noten: Sobald die Felder in der API live sind,
 * hier die Feldnamen anpassen. Sonst muss nichts geändert werden.
 */
import { FAMILIES } from '../../data/families.js';
import { toPlain } from '../utils/text.js';

const GENDERS = { damas: 'D', caballeros: 'C', unisex: 'U' };
const BADGE_TAGS = { 'más vendido': 'Más vendido', bestseller: 'Más vendido', nuevo: 'Nuevo' };

export function variantOptions(raw, name) {
  const variant = (raw.variantes ?? []).find((entry) => entry.nombre === name);
  return variant?.opciones ?? [];
}

export function readBrand(raw) {
  return raw.marca || variantOptions(raw, 'Marca')[0] || '';
}

export function readGenders(raw) {
  return variantOptions(raw, 'Género');
}

export function readGender(raw) {
  return GENDERS[toPlain(readGenders(raw)[0])] ?? 'U';
}

export function readFamily(raw) {
  const value = raw.familia ?? raw.familiaOlfativa ?? variantOptions(raw, 'Familia')[0];
  const match = FAMILIES.find((family) => toPlain(family.id) === toPlain(value));
  return match?.id ?? null;
}

function toList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value ?? '')
    .split(',')
    .map((note) => note.trim())
    .filter(Boolean);
}

/** Gibt [salida, corazón, fondo] zurück oder null, wenn das Produkt keine Noten hat. */
export function readNotes(raw) {
  const notes = raw.notas ?? raw.piramide;
  if (!notes) return null;
  const tiers = [notes.salida, notes.corazon ?? notes.corazón, notes.fondo].map(toList);
  return tiers.some((tier) => tier.length > 0) ? tiers : null;
}

export function readBadge(raw) {
  const tag = (raw.tags ?? []).map(toPlain).find((entry) => BADGE_TAGS[entry]);
  return tag ? BADGE_TAGS[tag] : null;
}

/** Produkte mit dem Tag "portada" haben ein Stimmungsfoto statt einer freigestellten Flasche. */
export function readHasCoverPhoto(raw) {
  return (raw.tags ?? []).some((tag) => toPlain(tag) === 'portada');
}
