// generate-product-pages.mjs — erzeugt für jedes Produkt eine eigene, fertige HTML-Seite
// (Titel, Beschreibung, Bild, Preis, Google-Daten schon im HTML), damit Google jedes
// Parfum als eigene Seite findet. Vorlage ist producto.html; die Daten kommen von NEXOMAR.
//
//   node tools/generate-product-pages.mjs                 → Produkte live von nexomar.co
//   node tools/generate-product-pages.mjs --data f.json   → Produkte aus einer Datei (Test)
//
// Ergebnis:
//   perfume/<slug>/index.html   eine Seite pro Produkt
//   scripts/product-urls.js     Zuordnung Produkt-ID → schöne URL (für Links im Shop)
//   sitemap.xml                 Produkt-URLs zwischen den PRODUCT-Markern

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT      = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE      = 'https://scentscape.com.co';
const SHOP_ID   = '6a0de7a797ebb49fffb11079';
const API       = 'https://nexomar.co/api/products/public?userId=' + SHOP_ID;
const BRAND     = 'ScentScape';
const OUT_DIR   = 'perfume';

// ── Daten laden ─────────────────────────────────────────────────────────────

async function loadProducts() {
    const i = process.argv.indexOf('--data');
    if (i !== -1) return JSON.parse(fs.readFileSync(path.resolve(process.argv[i + 1]), 'utf8'));
    const res = await fetch(API);
    if (!res.ok) throw new Error('API ' + res.status);
    return res.json();
}

// ── Helfer ──────────────────────────────────────────────────────────────────

function slugify(str) {
    return String(str || '')
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 60) || 'producto';
}

function esc(str) {
    return String(str == null ? '' : str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function plain(str) {
    return String(str || '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\s+/g, ' ').trim();
}

function formatPrice(n) {
    return '$' + Math.round(Number(n) || 0).toLocaleString('es-CO') + ' COP';
}

function effective(pres) {
    const p = Number(pres.precio) || 0, s = Number(pres.precioSale) || 0;
    return s > 0 && s < p ? s : p;
}

/** Ersetzt genau einen Treffer — bricht ab, wenn die Vorlage sich geändert hat. */
function replaceOnce(html, pattern, replacement, label) {
    const matches = html.match(new RegExp(pattern.source, pattern.flags.replace('g', '') + 'g'));
    if (!matches || matches.length !== 1) {
        throw new Error('Vorlage producto.html: "' + label + '" nicht eindeutig gefunden (' + (matches ? matches.length : 0) + ')');
    }
    return html.replace(pattern, replacement);
}

// Gleiche Logik wie perfumeLabel() in script.js
function categoryLabel(p) {
    const GENEROS = ['dama', 'caballero', 'mujer', 'hombre', 'ella', 'él', 'el', 'unisex'];
    const v = (p.variantes || []).find(x => x.nombre === 'Género');
    const opciones = (v && v.opciones) || [];
    let genero = opciones.length === 1 ? opciones[0] : (opciones.includes('Unisex') ? 'Unisex' : '');
    if (!genero && p.categoria && GENEROS.includes(String(p.categoria).trim().toLowerCase())) genero = p.categoria;
    if (!genero) return 'Perfume';
    return genero.toLowerCase() === 'unisex' ? 'Perfume unisex' : 'Perfume para ' + genero;
}

// ── Google-Daten (schema.org/Product) ──────────────────────────────────────

function productSchema(p, url) {
    const pres   = (p.presentaciones || []).filter(x => effective(x) > 0);
    const prices = pres.map(effective);
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: p.nombre,
        description: plain(p.descripcion).slice(0, 5000),
        url,
        sku: String(p._id),
        // Immer die eigene Marke — nie die Duft-Inspiration
        brand: { '@type': 'Brand', name: BRAND },
        category: 'Salud y belleza > Cuidado personal > Cosméticos > Perfumes y colonias'
    };
    if (p.imagenes && p.imagenes.length) schema.image = p.imagenes.slice(0, 5);
    if (prices.length) {
        schema.offers = {
            '@type': 'AggregateOffer',
            priceCurrency: 'COP',
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: prices.length,
            availability: 'https://schema.org/InStock',
            url,
            seller: { '@type': 'Organization', name: BRAND }
        };
    }
    return JSON.stringify(schema).replace(/</g, '\\u003c');
}

// ── Seite bauen ─────────────────────────────────────────────────────────────

function buildPage(template, p, url) {
    const name   = p.nombre || 'Perfume';
    const desc   = plain(p.descripcion) || (name + ' — fragancia disponible en ScentScape. Envíos a todo Colombia.');
    const meta   = desc.length > 158 ? desc.slice(0, 155).replace(/\s+\S*$/, '') + '…' : desc;
    const image  = (p.imagenes && p.imagenes[0]) || SITE + '/assets/img/og-banner.png';
    const pres   = (p.presentaciones || []);
    const first  = pres[0];
    const title  = name + ' — ' + categoryLabel(p) + ' | ScentScape Medellín';

    let h = template;

    // Kopf: Basis-URL, damit die relativen Pfade der Vorlage auch in /perfume/<slug>/ stimmen
    h = replaceOnce(h, /<meta charset="UTF-8">/, '<meta charset="UTF-8">\n    <base href="/">', 'charset');
    h = replaceOnce(h, /<title>[^<]*<\/title>/, '<title>' + esc(title) + '</title>', 'title');
    h = replaceOnce(h, /<meta name="description" content="[^"]*">/, '<meta name="description" content="' + esc(meta) + '">', 'description');
    h = replaceOnce(h, /<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + esc(name + ' — ScentScape') + '">', 'og:title');
    h = replaceOnce(h, /<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + esc(meta) + '">', 'og:description');
    h = replaceOnce(h, /<meta property="og:image" content="[^"]*">/, '<meta property="og:image" content="' + esc(image) + '">', 'og:image');
    h = h.replace(/\s*<meta property="og:image:(width|height)" content="[^"]*">/g, '');
    h = replaceOnce(h, /<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + esc(url) + '">', 'og:url');
    h = replaceOnce(h, /<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + esc(url) + '">', 'canonical');
    h = replaceOnce(h, /<script src="scripts\/producto\.js" defer><\/script>/,
        '<script>window.SS_PRODUCT_ID = ' + JSON.stringify(String(p._id)) + ';</script>\n' +
        '    <script type="application/ld+json" id="pd-jsonld">' + productSchema(p, url) + '</script>\n' +
        '    <script src="scripts/producto.js" defer></script>', 'producto.js');

    // Sichtbarer Inhalt — producto.js überschreibt ihn später mit Live-Daten
    // Inhalt steht schon im HTML → sofort sichtbar statt erst nach dem Laden der Live-Daten
    h = replaceOnce(h, /<div class="pd-layout">/, '<div class="pd-layout visible">', 'pd-layout');
    h = replaceOnce(h, /<span class="pd-breadcrumb-current">[^<]*<\/span>/, '<span class="pd-breadcrumb-current">' + esc(name) + '</span>', 'breadcrumb');
    h = replaceOnce(h, /<img src="[^"]*" loading="lazy" alt="[^"]*" class="pd-image">/,
        '<img src="' + esc(image) + '" alt="' + esc(name + ' — perfume ScentScape') + '" class="pd-image" fetchpriority="high">', 'pd-image');
    h = replaceOnce(h, /<p class="pd-eyebrow">[^<]*<\/p>/, '<p class="pd-eyebrow">' + esc(categoryLabel(p)) + '</p>', 'eyebrow');
    h = replaceOnce(h, /<h1 class="pd-title">[^<]*<\/h1>/, '<h1 class="pd-title">' + esc(name) + '</h1>', 'h1');
    h = replaceOnce(h, /<p class="pd-inspiration"><em>[^<]*<\/em><\/p>/, '<p class="pd-inspiration"><em>' + esc(p.marca || '') + '</em></p>', 'inspiration');

    if (first) {
        const pr = Number(first.precio) || 0, ps = Number(first.precioSale) || 0;
        const sale = ps > 0 && ps < pr;
        h = replaceOnce(h, /<span class="pd-price-old" id="pdPriceOld">[^<]*<\/span>/, '<span class="pd-price-old" id="pdPriceOld">' + (sale ? formatPrice(pr) : '') + '</span>', 'price-old');
        h = replaceOnce(h, /<span class="pd-price-current" id="pdPrice">[^<]*<\/span>/, '<span class="pd-price-current" id="pdPrice">' + formatPrice(sale ? ps : pr) + '</span>', 'price');
        h = replaceOnce(h, /<span class="pd-size-selected" id="pdSizeLabel">[^<]*<\/span>/, '<span class="pd-size-selected" id="pdSizeLabel">' + esc(first.etiqueta) + ' ml</span>', 'size-label');
        const buttons = pres.map((x, i) =>
            '<button class="pd-size-btn' + (i === 0 ? ' active' : '') + '" data-size="' + esc(x.etiqueta) + ' ml" data-price="' + (Number(x.precio) || 0) + '">' + esc(x.etiqueta) + ' ml</button>'
        ).join('\n                            ');
        h = replaceOnce(h, /(<div class="pd-sizes">)[\s\S]*?(<\/div>)/, '$1\n                            ' + buttons + '\n                        $2', 'sizes');
    }

    const descHtml = esc(p.descripcion || desc).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    h = replaceOnce(h, /(<p class="pd-desc-text pd-desc-clamped">)[\s\S]*?(<\/p>)/, '$1' + descHtml + '$2', 'description-text');

    return h;
}

// ── Hauptprogramm ───────────────────────────────────────────────────────────

const products = (await loadProducts()).filter(p => p && p._id && p.disponible !== false);
const template = fs.readFileSync(path.join(ROOT, 'producto.html'), 'utf8');

// Eindeutige Slugs: bei gleichem Namen wird ein Stück der ID angehängt
const used = new Map();
const entries = products
    .sort((a, b) => String(a._id).localeCompare(String(b._id)))
    .map(p => {
        let slug = slugify(p.nombre);
        if (used.has(slug)) slug = slug + '-' + String(p._id).slice(-5);
        used.set(slug, true);
        return { p, slug, url: SITE + '/' + OUT_DIR + '/' + slug + '/' };
    });

// Alte Seiten entfernen (gelöschte oder deaktivierte Produkte)
fs.rmSync(path.join(ROOT, OUT_DIR), { recursive: true, force: true });

for (const { p, slug, url } of entries) {
    const dir = path.join(ROOT, OUT_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), buildPage(template, p, url));
}

// Zuordnung ID → URL für die Links im Shop
const map = Object.fromEntries(entries.map(e => [String(e.p._id), '/' + OUT_DIR + '/' + e.slug + '/']));
fs.writeFileSync(path.join(ROOT, 'scripts', 'product-urls.js'),
    '// AUTOMATISCH ERZEUGT von tools/generate-product-pages.mjs — nicht von Hand bearbeiten.\n' +
    'window.SS_PRODUCT_URLS = ' + JSON.stringify(map, null, 2) + ';\n');

// Sitemap: Produktbereich zwischen den Markern neu schreiben
const today = new Date().toISOString().slice(0, 10);
const smPath = path.join(ROOT, 'sitemap.xml');
let sm = fs.readFileSync(smPath, 'utf8');
const block = entries.map(e =>
    '    <url>\n' +
    '        <loc>' + e.url + '</loc>\n' +
    '        <lastmod>' + (e.p.updatedAt ? String(e.p.updatedAt).slice(0, 10) : today) + '</lastmod>\n' +
    '        <changefreq>weekly</changefreq>\n' +
    '        <priority>0.8</priority>\n' +
    '    </url>').join('\n');
const START = '    <!-- PRODUCTS:START (automatisch erzeugt) -->';
const END   = '    <!-- PRODUCTS:END -->';
if (sm.includes(START)) {
    sm = sm.replace(new RegExp(START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), START + '\n' + block + '\n' + END);
} else {
    sm = sm.replace('</urlset>', '\n' + START + '\n' + block + '\n' + END + '\n\n</urlset>');
}
fs.writeFileSync(smPath, sm);

console.log(entries.length + ' Produktseiten erzeugt in /' + OUT_DIR + '/');
