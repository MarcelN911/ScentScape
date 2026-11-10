/*
 * Noten und Duftfamilien eines Produkts.
 * Solange nexomar keine eigenen Felder liefert, werden sie wie in der Vorlage aus dem Text abgeleitet:
 * Varianten, Tags und Beschreibung werden nach den 16 bekannten Noten durchsucht.
 */
import { INGREDIENTS, SCENT_FAMILIES, familyOfIngredient } from '../../data/scent.js';
import { toPlain } from '../utils/text.js';

const NOTE_VARIANT = /nota|familia|aroma|olfativ/i;

function textOf(raw) {
  const variants = (raw.variantes ?? []).map((variant) => (variant.opciones ?? []).join(' '));
  return toPlain([variants.join(' '), (raw.tags ?? []).join(' '), raw.descripcion ?? ''].join(' '));
}

/** Noten in der Reihenfolge der Pyramide (falls vorhanden), sonst die gefundenen Noten. */
export function readIngredients(raw, pyramid) {
  if (pyramid) return pyramid.flat();
  const text = textOf(raw);
  return INGREDIENTS.map((note) => note.name).filter((name) => text.includes(toPlain(name)));
}

function familyKeywords(raw) {
  const variants = (raw.variantes ?? []).filter((variant) =>
    NOTE_VARIANT.test(variant.nombre ?? ''),
  );
  const words = [...variants.flatMap((variant) => variant.opciones ?? []), ...(raw.tags ?? [])];
  return toPlain(words.join(' '));
}

function matchFamilies(text) {
  return SCENT_FAMILIES.map((family) => family.name).filter((name) =>
    text.includes(toPlain(name).slice(0, 5)),
  );
}

/* Familien aus dem nexomar-Panel ("Floral", "Cítrica" …), Name wie in SCENT_FAMILIES */
function panelFamilies(raw) {
  const names = (raw.perfume?.familias ?? []).map((value) =>
    typeof value === 'object' ? value?.nombre : value,
  );
  return matchFamilies(toPlain(names.join(' ')));
}

/**
 * Bis zu drei Familien: zuerst die aus dem nexomar-Panel (die wichtigste),
 * dann aus den Noten, dann aus Tags und Varianten, zuletzt aus der Beschreibung.
 */
export function readScentFamilies(raw, ingredients) {
  const fromPanel = panelFamilies(raw);
  const fromNotes = ingredients.map(familyOfIngredient).filter(Boolean);
  const fromTags = matchFamilies(familyKeywords(raw));
  const found = new Set([...fromPanel, ...fromNotes, ...fromTags]);
  if (!found.size) matchFamilies(toPlain(raw.descripcion)).forEach((name) => found.add(name));
  return [...found].slice(0, 3);
}
