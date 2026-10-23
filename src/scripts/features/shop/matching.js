import { toPlain } from '../../utils/text.js';

const GENDER_RULES = {
  Dama: (gender) => gender === 'D' || gender === 'U',
  Caballero: (gender) => gender === 'C' || gender === 'U',
  Unisex: (gender) => gender === 'U',
};

function matchesQuery(item, query) {
  const words = toPlain(query.trim()).split(/\s+/);
  return query.trim().length < 2 || words.every((word) => item.dataset.search.includes(word));
}

export function matches(item, state) {
  const genderRule = GENDER_RULES[state.gender];
  if (genderRule && !genderRule(item.dataset.gender)) return false;
  if (state.family && item.dataset.family !== state.family) return false;
  return matchesQuery(item, state.query);
}

const COMPARE = {
  rel: (a, b) => a.dataset.order - b.dataset.order,
  asc: (a, b) => a.dataset.price - b.dataset.price,
  desc: (a, b) => b.dataset.price - a.dataset.price,
  az: (a, b) => a.dataset.name.localeCompare(b.dataset.name, 'es'),
};

export function sortItems(items, sort) {
  return [...items].sort(COMPARE[sort] ?? COMPARE.rel);
}
