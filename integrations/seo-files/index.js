/*
 * Astro-Integration: schreibt nach dem Build sitemap.xml, robots.txt und .htaccess nach dist/.
 */
import { writeFile } from 'node:fs/promises';
import { getCatalog } from '../../src/scripts/catalog/load.js';
import { htaccess } from './htaccess.js';
import { robotsTxt } from './robots.js';
import { sitemapXml } from './sitemap.js';

async function writeFiles(dir, site, pages) {
  const products = await getCatalog();
  const pathnames = pages.map((page) => page.pathname);
  await Promise.all([
    writeFile(new URL('sitemap.xml', dir), sitemapXml(site, pathnames)),
    writeFile(new URL('robots.txt', dir), robotsTxt(site)),
    writeFile(new URL('.htaccess', dir), htaccess(products)),
  ]);
}

export function seoFiles() {
  let site;
  return {
    name: 'scentscape-seo-files',
    hooks: {
      'astro:config:done': ({ config }) => (site = config.site),
      'astro:build:done': ({ dir, pages }) => writeFiles(dir, site, pages),
    },
  };
}
