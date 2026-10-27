/* Seite "Productos" */

export const GENDER_TABS = ['Todos', 'Dama', 'Caballero', 'Unisex'];

/* Wert in der URL (?para=dama) → Reiter */
export const GENDER_PARAMS = { dama: 'Dama', caballero: 'Caballero', unisex: 'Unisex' };

export const SORT_OPTIONS = [
  { value: 'dest', label: 'Destacados' },
  { value: 'asc', label: 'Precio ↑' },
  { value: 'desc', label: 'Precio ↓' },
  { value: 'az', label: 'A – Z' },
  { value: 'brand', label: 'Marca A – Z' },
];

/* Ansicht: Index (Liste mit Vorschau), 3 oder 4 Spalten */
export const DENSITIES = [
  { value: 1, label: 'Índice', bars: 3, row: false },
  { value: 3, label: '3 columnas', bars: 3, row: true },
  { value: 4, label: '4 columnas', bars: 4, row: true },
];

/* So viele Produkte zeigt die Seite, danach "Ver más fragancias" */
export const PAGE_SIZE = 24;
