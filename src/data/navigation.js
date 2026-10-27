/* Alle Menüs der Seite: Header, Dropdown "Servicios", Vollbild-Menü und Footer. */

export const NAV_LINKS = [
  { key: 'home', label: 'Inicio', href: '/' },
  { key: 'shop', label: 'Productos', href: '/productos/' },
  { key: 'services', label: 'Servicios', href: '/servicios/', dropdown: true },
  { key: 'about', label: 'Nosotros', href: '/nosotros/' },
  { key: 'contact', label: 'Contacto', href: '/contacto/' },
];

export const SERVICE_LINKS = [
  { title: 'Test Olfativo', text: 'Encuentra tu aroma ideal', href: '/test-olfativo/' },
  { title: 'Gift Card', text: 'Regala distinción', href: '/gift-card/' },
  { title: 'Catálogo Digital', text: 'Tu PDF para WhatsApp', href: '/catalogo/' },
  { title: 'Original Garantizado', text: 'Verifica tu perfume', href: '/original/' },
  { title: 'Reseñas', text: 'Comparte tu experiencia', href: '/resenas/' },
  /* El Ritual ist vorerst ausgeblendet. Zum Einblenden: Zeile wieder aktivieren
     und src/pages/_el-ritual.astro in el-ritual.astro umbenennen. */
  // { title: 'El Ritual', text: 'Así llega tu perfume', href: '/el-ritual/' },
  { title: 'Te asesoramos', text: 'Envíos, pagos y más', href: '/te-asesoramos/' },
];

/* Pfade, bei denen im Header "Servicios" markiert wird */
export const SERVICE_PATHS = ['/servicios/', '/regalo/', ...SERVICE_LINKS.map((link) => link.href)];

/* Menü (Burger): große Hauptlinks, darunter die Services als zweite Ebene.
   "Servicios" fehlt hier bewusst: die Services stehen direkt darunter einzeln. */
export const MENU_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/productos/' },
  { label: 'Nosotros', href: '/nosotros/' },
  { label: 'Contacto', href: '/contacto/' },
];

export const MENU_SERVICES = SERVICE_LINKS;

export const FOOTER_COLUMNS = [
  {
    title: 'Tienda',
    links: [
      { label: 'Productos', href: '/productos/' },
      { label: 'Para Dama', href: '/productos/?para=dama' },
      { label: 'Para Caballero', href: '/productos/?para=caballero' },
      { label: 'Unisex', href: '/productos/?para=unisex' },
    ],
  },
  {
    title: 'Servicios',
    links: SERVICE_LINKS.map(({ title, href }) => ({ label: title, href })),
  },
  {
    title: 'ScentScape',
    links: [
      { label: 'Inicio', href: '/' },
      { label: 'Nosotros', href: '/nosotros/' },
      { label: 'Contacto', href: '/contacto/' },
      { label: 'Términos', href: '/terminos/' },
      { label: 'Privacidad', href: '/privacidad/' },
    ],
  },
];
