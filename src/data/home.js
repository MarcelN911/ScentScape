/* Inhalte der Startseite */

/* Bis das Video aus der Vorlage (hero5.mp4) da ist, läuft eines der vorhandenen Reels. */
export const HERO_VIDEO = '/assets/video/video4.mp4';

export const HERO_MARQUEE = [
  'Envíos a todo Colombia',
  'Compra por WhatsApp',
  'Envío gratis desde $500.000',
  'Hecho en Medellín',
];

/* Laufband mit Parfumnamen und die Karten "Los más pedidos" (Slugs aus nexomar) */
export const BESTSELLER_SLUGS = [
  'khamrah',
  'club-de-nuit-intense-ndt',
  'amethyst',
  'cloud-pink',
  '212-vip-red-men',
  'amber-oud-ruby',
  'baccarat-rouge-540',
  '9-pm',
];

/*
 * Karten im Bereich "Descubre".
 * layout.basis/height: Größe in px, row: Verzögerung beim Hereinkippen, parallax: Stärke der Bildbewegung
 */
export const DISCOVER_CARDS = [
  {
    number: 'I',
    eyebrow: 'Test olfativo',
    title: 'Tu aroma en tres toques',
    text: 'Tres preguntas y te mostramos el perfume que va contigo, con su pirámide olfativa.',
    cta: 'Hacer el test',
    href: '/#test',
    action: 'open-quiz',
    art: 'quiz',
    layout: { basis: 560, height: 480, row: 0, parallax: 50 },
    background: 'radial-gradient(ellipse at 80% 20%, #3a1030 0%, #1b1f3d 45%, #10132a 100%)',
  },
  {
    number: 'II',
    eyebrow: 'Gift card',
    title: 'Regala un aroma',
    text: 'Elige un monto y que ellos escojan su perfume. Digital o impresa con el pedido.',
    cta: 'Crear gift card',
    href: '/gift-card/',
    art: 'gift',
    layout: { basis: 420, height: 480, row: 1, parallax: -40 },
    background: 'linear-gradient(160deg, #241a2a 0%, #151932 70%)',
  },
  {
    number: 'III',
    eyebrow: 'Catálogo digital',
    title: 'Toda la colección',
    text: 'Por familia olfativa. Compártelo por WhatsApp o descárgalo en PDF.',
    cta: 'Ver catálogo',
    href: '/catalogo/',
    art: 'catalog',
    layout: { basis: 300, height: 460, row: 0, parallax: 35 },
    background: 'radial-gradient(ellipse at 50% 25%, #2a2440 0%, #151932 65%)',
  },
  {
    number: 'IV',
    eyebrow: 'Original garantizado',
    title: 'Sellado de fábrica',
    text: 'Verifica aquí el código de lote de tu caja.',
    cta: 'Verificar',
    href: '/original/',
    art: 'seal',
    layout: { basis: 300, height: 460, row: 1, parallax: -30 },
    background: 'radial-gradient(ellipse at 50% 25%, #2a1c14 0%, #151932 65%)',
  },
  {
    number: 'V',
    eyebrow: 'Reseñas',
    title: 'Lo que dicen de nosotros',
    text: 'Opiniones reales de clientes en toda Colombia.',
    cta: 'Leer reseñas',
    href: '/resenas/',
    art: 'reviews',
    layout: { basis: 300, height: 460, row: 2, parallax: 25 },
    background: 'linear-gradient(170deg, #61031b 0%, #3a0214 100%)',
  },
];

const VIDEO_CAPTIONS = [
  'Distinción sin límites ✨',
  'Tu próximo aroma favorito te espera 🖤',
  'Notas que se quedan contigo todo el día.',
  'Del frasco a tu piel.',
  'Pequeño detalle, gran presencia. Envíos a toda Colombia 🇨🇴',
  'Elige tu esencia.',
  'Detrás de cada aroma hay una historia.',
];

export const VIDEOS = VIDEO_CAPTIONS.map((caption, index) => ({
  src: `/assets/video/video${index + 1}.mp4`,
  title: `Reel ${String(index + 1).padStart(2, '0')} · Instagram`,
  caption,
}));

/* So lange bleibt ein Video ohne Länge (noch nicht geladen) vorne, bevor das nächste kommt */
export const VIDEO_FALLBACK_MS = 7000;

/* Neigung der Bewertungskarten in Grad */
export const REVIEW_ROTATIONS = [-4, 3, -2, 5, -3, 2];
