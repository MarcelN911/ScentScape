/* Inhalte der Startseite */

export const HERO_VIDEO = '/assets/video/hero.mp4';

/* Hochformat-Version fürs Handy. Wird erst benutzt, wenn die Datei in public/ liegt. */
export const HERO_VIDEO_PORTRAIT = '/assets/video/hero2.mp4';

/* Laufband mit Parfumnamen und die Karten "Los más pedidos" (Slugs aus nexomar) */
export const BESTSELLER_SLUGS = [
  'khamrah',
  'club-de-nuit-intense-ndt',
  'amethyst',
  'cloud-pink',
  '212-vip-red-men',
  'amber-oud-ruby',
  'baccarat-rouge-540',
];

/* Pyramide im Bereich "Test Olfativo" (Breite in %, Form als clip-path) */
export const PYRAMID_TIERS = [
  {
    label: 'Salida',
    notes: 'Bergamota · Limón · Pimienta rosa',
    width: 40,
    clip: 'polygon(50% 0,100% 100%,0 100%)',
    background: '#F0BE91',
    color: '#161A32',
  },
  {
    label: 'Corazón',
    notes: 'Jazmín · Rosa · Iris',
    width: 70,
    clip: 'polygon(21% 0,79% 0,100% 100%,0 100%)',
    background: '#C99A6E',
    color: '#161A32',
  },
  {
    label: 'Fondo',
    notes: 'Ámbar · Vainilla · Sándalo',
    width: 100,
    clip: 'polygon(15% 0,85% 0,100% 100%,0 100%)',
    background: '#531019',
    color: '#F0D2AA',
  },
];

/* Farben der Gift Card im Bereich "Gift Card" der Startseite */
export const STORY_CARD_COLORS = [
  {
    name: 'Burdeos',
    swatch: '#531019',
    background: 'linear-gradient(150deg,#6E1824,#531019 60%,#33080f)',
    ink: '#F0D2AA',
    accent: '#F6E3C6',
    border: 'rgba(240,210,170,.45)',
    logo: 'none',
  },
  {
    name: 'Azul noche',
    swatch: '#1E2342',
    background: 'linear-gradient(150deg,#2a3166,#1E2342 60%,#11142B)',
    ink: '#F0D2AA',
    accent: '#F6E3C6',
    border: 'rgba(240,210,170,.4)',
    logo: 'none',
  },
  {
    name: 'Champán',
    swatch: '#E2C193',
    background: 'linear-gradient(150deg,#F7E6CB,#E2C193 60%,#C9A06E)',
    ink: '#161A32',
    accent: '#161A32',
    border: 'rgba(22,26,50,.3)',
    logo: 'brightness(0) opacity(.85)',
  },
  {
    name: 'Negro',
    swatch: '#141417',
    background: 'linear-gradient(150deg,#2b2b31,#141417 60%,#050506)',
    ink: '#F0BE91',
    accent: '#F0D2AA',
    border: 'rgba(240,190,145,.4)',
    logo: 'none',
  },
];

const VIDEO_CAPTIONS = [
  'Distinción sin límites ✨ Así se ve una fragancia ScentScape de cerca.',
  'Tu próximo aroma favorito te espera 🖤',
  'Notas que se quedan contigo todo el día.',
  'Del frasco a tu piel.',
  'Pequeño formato, gran presencia. Envíos a toda Colombia 🇨🇴',
  'Elige tu esencia. Descubre la colección Especiada.',
  'Detrás de cada aroma hay una historia.',
];

export const VIDEOS = VIDEO_CAPTIONS.map((caption, index) => ({
  src: `/assets/video/video${index + 1}.mp4`,
  /* Standbild aus dem Video (Sekunde 0,6): wird gezeigt, bis das Video läuft (wichtig fürs iPhone) */
  poster: `/assets/img/reels/video${index + 1}.jpg`,
  title: `Reel ${String(index + 1).padStart(2, '0')} · Instagram`,
  caption,
}));

/* So lange bleibt ein Video ohne Länge (noch nicht geladen) vorne, bevor das nächste kommt */
export const VIDEO_FALLBACK_MS = 7000;
