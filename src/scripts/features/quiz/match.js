/*
 * Empfehlung wie in der Vorlage: Jede gemeinsame Familie zählt 3 Punkte,
 * passendes Geschlecht 2, Unisex 1. Daraus wird eine Affinität zwischen 62 und 98 %.
 */
function genderScore(productGender, wanted) {
  if (productGender === wanted) return 2;
  return productGender === 'U' || wanted === 'U' ? 1 : 0;
}

function scoreOf(product, state) {
  const shared = product.families.filter((family) => state.families.includes(family)).length;
  return shared * 3 + genderScore(product.gender, state.gender);
}

/** Die drei besten Produkte mit Prozentwert */
export function recommend(products, state) {
  const max = state.families.length * 3 + 2;
  return products
    .map((product) => ({ product, score: scoreOf(product, state) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ product, score }, index) => ({
      ...product,
      pct: Math.round(62 + 36 * Math.min(1, score / max)) - index,
    }));
}
