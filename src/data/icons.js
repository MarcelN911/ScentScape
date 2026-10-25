/* SVG-Inhalte der Icons aus der Vorlage (viewBox 0 0 24 24). fill: true = gefüllt statt Linie */
export const ICONS = {
  cart: {
    svg: '<path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
  },
  bag: { svg: '<path d="M5 8h14l-1.2 12H6.2z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>' },
  search: { svg: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>' },
  menu: { svg: '<path d="M4 8h16M4 16h11"/>' },
  chevron: { svg: '<path d="M6 9l6 6 6-6"/>' },
  play: { fill: true, svg: '<path d="M7 4l13 8-13 8z"/>' },
  pause: { fill: true, svg: '<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>' },
  volume: {
    svg: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
  },
  mute: { svg: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/>' },
  heart: {
    svg: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>',
  },
  lock: {
    svg: '<rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
  },
  grid: {
    svg: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/>',
  },
  list: { svg: '<path d="M4 7h16M4 12h16M4 17h16"/>' },
  send: { fill: true, svg: '<path d="M3 20.5 21 12 3 3.5l2.5 8.5L3 20.5z"/>' },
  card: {
    svg: '<rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 10h19M6 15h4"/>',
  },
  bank: { svg: '<path d="M3 10l9-5 9 5"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>' },
  cash: {
    svg: '<rect x="2.5" y="6.5" width="19" height="11" rx="1.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/>',
  },
  comment: { svg: '<path d="M20.7 16.5A9 9 0 1 0 17 20.3L21 21z"/>' },
  share: { svg: '<path d="M22 3 9.2 10.1M22 3l-7 18-5.8-10.9L2 6.6z"/>' },
  bookmark: { svg: '<path d="M19 21l-7-6-7 6V3h14z"/>' },
  instagram: {
    svg: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/>',
  },
  mail: { svg: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>' },
  pin: {
    svg: '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>',
  },
};
