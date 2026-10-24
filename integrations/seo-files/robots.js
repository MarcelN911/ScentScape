/* robots.txt: alles erlaubt außer Checkout und Hilfsseiten */
export function robotsTxt(site) {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /checkout/',
    'Disallow: /styleguide/',
    'Disallow: /catalogo/imprimir/',
    '',
    `Sitemap: ${new URL('/sitemap.xml', site).href}`,
    '',
  ].join('\n');
}
