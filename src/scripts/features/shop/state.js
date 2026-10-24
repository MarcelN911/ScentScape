/* Filterzustand der Seite "Productos". Startwerte aus der URL: ?para=dama&familia=Floral&q=khamrah */
import { GENDER_PARAMS, PAGE_SIZE } from '../../../data/shop.js';
import { SCENT_FAMILIES } from '../../../data/scent.js';

function familyFromUrl(params) {
  const value = (params.get('familia') ?? '').toLowerCase();
  return SCENT_FAMILIES.find((family) => family.name.toLowerCase() === value)?.name ?? null;
}

const DEFAULTS = {
  sort: 'dest',
  density: 3,
  letter: null,
  shown: PAGE_SIZE,
  active: null,
  wheel: 0,
};

export function createState() {
  const params = new URLSearchParams(location.search);
  return {
    ...DEFAULTS,
    gender: GENDER_PARAMS[params.get('para')] ?? 'Todos',
    family: familyFromUrl(params),
    notes: new Set(),
    query: params.get('q') ?? '',
    sizes: {},
  };
}

/** Bei jeder Filteränderung: wieder 24 Produkte, Einblenden von vorn */
export function resetPaging(state) {
  state.shown = PAGE_SIZE;
}

/** Index-Ansicht mit Vorschau nur auf breiten Bildschirmen */
export function isIndexMode(state) {
  return state.density === 1 && innerWidth >= 1080;
}
