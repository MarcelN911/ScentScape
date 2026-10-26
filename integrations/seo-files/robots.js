/* robots.txt: alles erlaubt außer persönlichen Seiten (Regalo) und der Druckversion des Katalogs */
export function robotsTxt(site) {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /regalo/',
    'Disallow: /catalogo/imprimir/',
    'Disallow: /checkout/',
    '',
    `Sitemap: ${new URL('/sitemap.xml', site).href}`,
    '',
  ].join('\n');
}
