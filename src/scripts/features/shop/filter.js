/*
 * Filtern und Sortieren der Produkt-Datensätze (wie in der Vorlage):
 * Geschlecht + Suche → Familie → Noten → Sortierung → Buchstabe (nur im Index).
 */
import { toPlain } from '../../utils/text.js';
import { isIndexMode } from './state.js';

const GENDER_RULES = {
  Dama: (gender) => gender === 'D' || gender === 'U',
  Caballero: (gender) => gender === 'C' || gender === 'U',
  Unisex: (gender) => gender === 'U',
};

function matchesBase(entry, state, words) {
  const rule = GENDER_RULES[state.gender];
  if (rule && !rule(entry.gender)) return false;
  return words.every((word) => entry.search.includes(word));
}

const COMPARE = {
  asc: (a, b) => a.price - b.price,
  desc: (a, b) => b.price - a.price,
  az: (a, b) => a.name.localeCompare(b.name, 'es'),
  dest: (a, b) => a.order - b.order,
};

function byNotes(entries, notes) {
  if (!notes.size) return [...entries];
  return entries.filter((entry) => entry.ingredients.some((note) => notes.has(note)));
}

/** base: nach Geschlecht und Suche · familyBase: zusätzlich Familie · results: sortiert · list: angezeigt */
export function filterEntries(entries, state) {
  const words = toPlain(state.query).split(/\s+/).filter(Boolean);
  const base = entries.filter((entry) => matchesBase(entry, state, words));
  const familyBase = base.filter((entry) => !state.family || entry.families.includes(state.family));
  const results = byNotes(familyBase, state.notes).sort(COMPARE[state.sort]);
  const letters = new Set(results.map((entry) => entry.initial));
  const letter = isIndexMode(state) && letters.has(state.letter) ? state.letter : null;
  const list = letter ? results.filter((entry) => entry.initial === letter) : results;
  return { base, familyBase, results, letters, letter, list };
}

export function countWith(entries, test) {
  return entries.filter(test).length;
}
