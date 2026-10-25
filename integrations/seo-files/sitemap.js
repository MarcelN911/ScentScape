/* sitemap.xml aus den gebauten Seiten. Seiten ohne Suchmaschinen-Nutzen fehlen. */
const EXCLUDED = ['regalo/', 'catalogo/imprimir/', '404/'];

function isListed(pathname) {
  return !pathname.includes('.') && !EXCLUDED.includes(pathname);
}

function entryOf(site, pathname, today) {
  const loc = new URL(pathname, site).href;
  return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod></url>`;
}

export function sitemapXml(site, pathnames) {
  const today = new Date().toISOString().slice(0, 10);
  const entries = pathnames.filter(isListed).map((path) => entryOf(site, path, today));
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');
}
