import { slugify } from '../utils/text.js';

function candidateSlugs(product) {
  const base = slugify(product.name);
  return [base, slugify(`${product.name} ${product.brand}`), `${base}-${product.id.slice(-6)}`];
}

/** Gibt jedem Produkt eine eindeutige URL aus seinem Namen: "khamrah", "khamrah-lattafa", … */
export function assignSlugs(products) {
  const taken = new Set();
  return products.map((product) => {
    const slug = candidateSlugs(product).find((candidate) => candidate && !taken.has(candidate));
    taken.add(slug);
    return { ...product, slug };
  });
}
