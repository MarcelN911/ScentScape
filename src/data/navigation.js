/*
 * Mega-Menü "Descubre".
 * preview: 'product' (Flasche aus dem Katalog), 'logo' oder 'seal' (Siegel mit ✓)
 * action: 'open-quiz' öffnet den Test statt einen Link
 */
export const MEGA_GROUPS = [
  {
    label: 'Comprar',
    items: [
      {
        key: 'shop',
        title: 'Productos',
        text: 'Toda la colección, por familia y género.',
        href: '/productos/',
        preview: 'product',
        slug: 'khamrah',
        accent: '#d9782e',
      },
      {
        key: 'catalog',
        title: 'Catálogo digital',
        text: 'Hojéalo, compártelo por WhatsApp o descárgalo en PDF.',
        href: '/catalogo/',
        preview: 'product',
        slug: 'amethyst',
        accent: '#9a62c8',
      },
      {
        key: 'gift',
        title: 'Gift card',
        text: 'Regala un monto y que elijan su aroma.',
        href: '/gift-card/',
        preview: 'product',
        slug: 'amber-oud-ruby',
        accent: '#c8303e',
      },
    ],
  },
  {
    label: 'Elige tu aroma',
    items: [
      {
        key: 'quiz',
        title: 'Test olfativo',
        text: 'Tres preguntas y te mostramos tu match.',
        action: 'open-quiz',
        cta: 'Hacer el test',
        preview: 'product',
        slug: 'cloud-pink',
        accent: '#ee9cc0',
      },
      {
        key: 'families',
        title: 'Familias olfativas',
        text: 'Especiada, floral, amaderada, fresca y dulce.',
        href: '/#familias',
        section: true,
        preview: 'product',
        slug: 'boss-bottled-tonic',
        accent: '#e0a848',
      },
      {
        key: 'reviews',
        title: 'Reseñas',
        text: 'Lo que dicen nuestros clientes en toda Colombia.',
        href: '/#resenas',
        section: true,
        preview: 'product',
        slug: 'club-de-nuit-intense-ndt',
        accent: '#8a96b0',
      },
    ],
  },
  {
    label: 'ScentScape',
    items: [
      {
        key: 'faq',
        title: 'Preguntas frecuentes',
        text: 'Envíos, pagos, originalidad y regalos.',
        href: '/#faq',
        section: true,
        preview: 'seal',
        accent: '#f0d2aa',
      },
      {
        key: 'about',
        title: 'Nosotros',
        text: 'Nuestra historia desde Medellín.',
        href: '/nosotros/',
        preview: 'logo',
        accent: '#f0be91',
      },
      {
        key: 'original',
        title: 'Original garantizado',
        text: 'Sellado de fábrica. Verifica el código de lote.',
        href: '/original/',
        preview: 'seal',
        accent: '#d4af7d',
      },
    ],
  },
];

export const MOBILE_PRIMARY = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/productos/' },
  { label: 'Familias', href: '/#familias' },
  { label: 'Reseñas', href: '/#resenas' },
];

export const MOBILE_SECONDARY = [
  { label: 'Test olfativo', action: 'open-quiz' },
  { label: 'Catálogo digital', href: '/catalogo/' },
  { label: 'Gift card', href: '/gift-card/' },
  { label: 'Original garantizado', href: '/original/' },
  { label: 'Nosotros', href: '/nosotros/' },
];

export const FOOTER_COLUMNS = [
  {
    title: 'Tienda',
    links: [
      { label: 'Productos', href: '/productos/' },
      { label: 'Nosotros', href: '/nosotros/' },
      { label: 'Reseñas', href: '/resenas/' },
    ],
  },
  {
    title: 'Descubre',
    links: [
      { label: 'Test Olfativo', action: 'open-quiz' },
      { label: 'Catálogo digital', href: '/catalogo/' },
      { label: 'Gift card', href: '/gift-card/' },
    ],
  },
  {
    title: 'Ayuda',
    links: [
      { label: 'Original garantizado', href: '/original/' },
      { label: 'Contacto', href: '/contacto/' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Términos y Condiciones', href: '/terminos/' },
      { label: 'Política de Privacidad', href: '/privacidad/' },
    ],
  },
];
