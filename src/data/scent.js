/*
 * Die 8 Duftfamilien der Vorlage und die 16 Noten, aus denen sie abgeleitet werden.
 * color: Farbe der Familie (Punkte, Ringe, Chips)
 * ingredient: Note, deren Foto die Familie im Rad zeigt
 * icon: Linienzeichnung der Note (viewBox 0 0 24 24)
 * wiki: Wikipedia-Artikel, aus dem das Foto der Note kommt
 */
export const SCENT_FAMILIES = [
  { name: 'Floral', color: '#D9A3A8', ingredient: 'Rosa', hint: 'Jazmín · Rosa' },
  { name: 'Amaderado', color: '#9A7656', ingredient: 'Cedro', hint: 'Cedro · Sándalo' },
  { name: 'Oriental', color: '#6E1824', ingredient: 'Ámbar', hint: 'Ámbar · Oud' },
  { name: 'Cítrico', color: '#E3C064', ingredient: 'Limón', hint: 'Bergamota · Limón' },
  { name: 'Dulce', color: '#F0D2AA', ingredient: 'Vainilla', hint: 'Vainilla · Praliné' },
  { name: 'Fresco', color: '#86AFC0', ingredient: 'Menta', hint: 'Menta · Lavanda' },
  { name: 'Frutal', color: '#CF7A63', ingredient: 'Mandarina', hint: 'Mandarina · Pera' },
  { name: 'Especiado', color: '#B5653A', ingredient: 'Canela', hint: 'Azafrán · Pimienta' },
];

export const INGREDIENTS = [
  { name: 'Bergamota', family: 'Cítrico', wiki: 'Bergamot_orange' },
  { name: 'Canela', family: 'Especiado', wiki: 'Cinnamon' },
  { name: 'Jazmín', family: 'Floral', wiki: 'Jasminum_sambac' },
  { name: 'Ámbar', family: 'Oriental', wiki: 'Amber' },
  { name: 'Limón', family: 'Cítrico', wiki: 'Lemon' },
  { name: 'Pachulí', family: 'Amaderado', wiki: 'Patchouli' },
  { name: 'Almizcle', family: 'Oriental', wiki: 'Abelmoschus_moschatus' },
  { name: 'Praliné', family: 'Dulce', wiki: 'Praline_(nut_confection)' },
  { name: 'Azafrán', family: 'Especiado', wiki: 'Saffron' },
  { name: 'Pimienta', family: 'Especiado', wiki: 'White_pepper' },
  { name: 'Cedro', family: 'Amaderado', wiki: 'Cedrus_libani' },
  { name: 'Vainilla', family: 'Dulce', wiki: 'Vanilla' },
  { name: 'Rosa', family: 'Floral', wiki: 'Rose' },
  { name: 'Oud', family: 'Amaderado', wiki: 'Agarwood' },
  { name: 'Mandarina', family: 'Frutal', wiki: 'Mandarin_orange' },
  { name: 'Menta', family: 'Fresco', wiki: 'Mentha' },
];

const COLORS = Object.fromEntries(SCENT_FAMILIES.map((family) => [family.name, family.color]));
const FAMILY_OF = Object.fromEntries(INGREDIENTS.map((note) => [note.name, note.family]));

/** Farbe einer Familie oder Note, sonst Durazno */
export function scentColor(name) {
  return COLORS[name] ?? COLORS[FAMILY_OF[name]] ?? '#F0BE91';
}

export function familyOfIngredient(name) {
  return FAMILY_OF[name] ?? null;
}
