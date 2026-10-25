/*
 * .htaccess für Hostinger (Apache): HTTPS erzwingen, eigene 404-Seite
 * und alte Adressen der bisherigen Seite dauerhaft (301) auf die neuen umleiten.
 */
const PAGE_REDIRECTS = {
  'productos.html': '/productos/',
  'nosotros.html': '/nosotros/',
  'contacto.html': '/contacto/',
  'resenas.html': '/resenas/',
  'terminos.html': '/terminos/',
  'privacidad.html': '/privacidad/',
  'formulario.html': '/test-olfativo/',
};

const HEADER = [
  'ErrorDocument 404 /404.html',
  'Options -Indexes',
  'RewriteEngine On',
  '',
  '# Immer HTTPS',
  'RewriteCond %{HTTPS} off',
  'RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]',
];

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* Nur echte Aufrufe von /index.html umleiten: Apache liefert "/" intern selbst über index.html aus */
const INDEX_RULES = [
  'RewriteCond %{THE_REQUEST} \\s/index\\.html[\\s?]',
  'RewriteRule ^index\\.html$ / [R=301,L]',
];

function pageRules() {
  const rules = Object.entries(PAGE_REDIRECTS).map(
    ([from, to]) => `RewriteRule ^${escapeRegex(from)}$ ${to} [R=301,L,NE]`,
  );
  return [...INDEX_RULES, ...rules];
}

/* producto.html?id=<nexomar-id> → /producto/<slug>/ (das "?" am Ende entfernt die alte Query) */
function productRules(products) {
  return products.flatMap((product) => [
    `RewriteCond %{QUERY_STRING} (^|&)id=${escapeRegex(product.id)}(&|$)`,
    `RewriteRule ^producto\\.html$ /producto/${product.slug}/? [R=301,L]`,
  ]);
}

export function htaccess(products) {
  return [
    ...HEADER,
    '',
    '# Alte Seiten',
    ...pageRules(),
    '',
    '# Alte Produktseiten',
    ...productRules(products),
    'RewriteRule ^producto\\.html$ /productos/? [R=301,L]',
    '',
  ].join('\n');
}
