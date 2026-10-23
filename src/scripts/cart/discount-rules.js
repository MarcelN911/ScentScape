/*
 * Welche Warenkorb-Zeilen ein Rabattcode betrifft.
 * Muss genau so rechnen wie itemsAplicables() im nexomar-Server (der Server hat das letzte Wort).
 */
function lowerList(list) {
  return (list ?? []).map((entry) => String(entry).trim().toLowerCase());
}

function lower(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

export function isCodeLimited(rule) {
  return ['categorias', 'marcas', 'generos', 'productos'].some(
    (key) => (rule[key] ?? []).length > 0,
  );
}

function filtersOf(rule) {
  return {
    categories: lowerList(rule.categorias),
    brands: lowerList(rule.marcas),
    genders: lowerList(rule.generos),
  };
}

function passesFilters(item, filters) {
  if (filters.categories.length && !filters.categories.includes(lower(item.category))) return false;
  if (filters.brands.length && !filters.brands.includes(lower(item.ruleBrand ?? item.brand)))
    return false;
  return (
    !filters.genders.length ||
    lowerList(item.genders).some((gender) => filters.genders.includes(gender))
  );
}

function hasFilters(filters) {
  return filters.categories.length + filters.brands.length + filters.genders.length > 0;
}

function isExcluded(item, rule) {
  return Boolean(item.giftCard) || (rule.sobreSale === false && Boolean(item.salePrice));
}

function matchesSingleProduct(item, rule) {
  const products = (rule.productos ?? []).map(String);
  return Boolean(item.productId) && products.includes(String(item.productId));
}

function isEligible(item, rule, filters) {
  if (isExcluded(item, rule)) return false;
  if (!isCodeLimited(rule)) return true;
  return matchesSingleProduct(item, rule) || (hasFilters(filters) && passesFilters(item, filters));
}

export function eligibleItems(rule, items) {
  const filters = filtersOf(rule);
  return items.filter((item) => isEligible(item, rule, filters));
}
