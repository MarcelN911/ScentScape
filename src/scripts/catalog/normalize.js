import { toPlain } from '../utils/text.js';
import { plainDescription } from './description.js';
import * as fields from './fields.js';
import { readIngredients, readScentFamilies } from './scent.js';
import { lowestPrice, readSizes } from './sizes.js';

const GENDER_LABELS = { D: 'Dama', C: 'Caballero', U: 'Unisex' };

function identityOf(raw) {
  return {
    id: String(raw._id),
    name: raw.nombre.trim(),
    brand: fields.readBrand(raw),
    category: raw.categoria ?? '',
    images: raw.imagenes ?? [],
    description: raw.descripcion ?? '',
    plainDescription: plainDescription(raw.descripcion),
    hasCoverPhoto: fields.readHasCoverPhoto(raw),
  };
}

function scentOf(raw) {
  const notes = fields.readNotes(raw);
  const ingredients = readIngredients(raw, notes);
  return { notes, ingredients, scentFamilies: readScentFamilies(raw, ingredients) };
}

function classificationOf(raw) {
  const gender = fields.readGender(raw);
  return {
    ...scentOf(raw),
    gender,
    genderLabel: GENDER_LABELS[gender],
    genders: fields.readGenders(raw),
    family: fields.readFamily(raw),
    badge: fields.readBadge(raw),
    featured: Boolean(raw.destacado),
    hearts: raw.hearts ?? 0,
  };
}

function pricingOf(raw) {
  const sizes = readSizes(raw);
  return { sizes, price: sizes.length ? lowestPrice(sizes) : 0 };
}

function searchTextOf(product) {
  const notes = (product.notes ?? []).flat().join(' ');
  const parts = [product.name, product.brand, product.family, notes, product.plainDescription];
  parts.push(product.scentFamilies.join(' '), product.ingredients.join(' '));
  return toPlain(parts.join(' '));
}

/** Macht aus einem nexomar-Produkt das Format, mit dem die ganze Seite arbeitet. */
export function normalizeProduct(raw) {
  const product = { ...identityOf(raw), ...classificationOf(raw), ...pricingOf(raw) };
  return { ...product, searchText: searchTextOf(product) };
}
