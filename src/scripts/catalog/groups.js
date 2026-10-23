/* Teilt den Katalog in Abschnitte: erst nach Duftfamilie, der Rest nach Geschlecht. */
import { GENDER_GROUPS } from '../../data/catalog.js';
import { FAMILIES } from '../../data/families.js';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

function familyGroups(catalog) {
  return FAMILIES.map((family) => ({
    title: family.id,
    line: family.line,
    products: catalog.filter((product) => product.family === family.id),
  }));
}

function genderGroups(catalog) {
  const withoutFamily = catalog.filter((product) => !product.family);
  return GENDER_GROUPS.map((group) => ({
    title: group.title,
    line: group.line,
    products: withoutFamily.filter((product) => product.gender === group.gender),
  }));
}

export function catalogGroups(catalog) {
  return [...familyGroups(catalog), ...genderGroups(catalog)]
    .filter((group) => group.products.length > 0)
    .map((group, index) => ({ ...group, number: ROMAN[index] }));
}
