/* Gift Card: Farben der Karte, feste Beträge und Lieferarten */
export const GIFT_COLORS = [
  {
    name: 'Burdeos',
    background: 'radial-gradient(ellipse at 28% 18%, #8a1230 0%, #61031b 55%, #3a0110 100%)',
    ink: '#f0d2aa',
    foil: 'linear-gradient(100deg, #fff6e6 0%, #f0d2aa 35%, #fff 50%, #e8b98a 70%, #fff6e6 100%)',
    logo: 'none',
  },
  {
    name: 'Noche',
    background: 'radial-gradient(ellipse at 28% 18%, #2a3060 0%, #151932 55%, #0a0c1c 100%)',
    ink: '#f0be91',
    foil: 'linear-gradient(100deg, #f0d2aa 0%, #f0be91 35%, #fff4e0 50%, #d9a06a 70%, #f0d2aa 100%)',
    logo: 'none',
  },
  {
    name: 'Champagne',
    background: 'radial-gradient(ellipse at 28% 18%, #fbecd6 0%, #f0d2aa 50%, #d9ae7c 100%)',
    ink: '#61031b',
    foil: 'linear-gradient(100deg, #61031b 0%, #8a1230 35%, #b0485e 50%, #61031b 70%, #3a0110 100%)',
    logo: 'brightness(0) saturate(100%) invert(9%) sepia(80%) saturate(4000%) hue-rotate(335deg)',
  },
  {
    name: 'Ónix',
    background: 'radial-gradient(ellipse at 28% 18%, #3a3a40 0%, #16161a 55%, #050506 100%)',
    ink: '#d4af7d',
    foil: 'linear-gradient(100deg, #b08a52 0%, #d4af7d 30%, #fff1d6 50%, #c79b5c 70%, #b08a52 100%)',
    logo: 'none',
  },
];

export const GIFT_AMOUNTS = [100000, 200000, 300000, 500000];

export const GIFT_DELIVERY = ['Digital por WhatsApp', 'Impresa, con el pedido'];

export const GIFT_DEFAULTS = {
  to: 'alguien especial',
  from: 'ti',
  message: 'Para que elijas el aroma que te represente.',
};

export const GIFT_LIMITS = { name: 28, message: 160 };
