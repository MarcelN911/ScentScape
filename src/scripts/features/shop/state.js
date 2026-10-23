/* Filterzustand der Produktseite. Startwerte können per URL kommen: ?q=vainilla&familia=Floral */
export function createShopState() {
  const params = new URLSearchParams(location.search);
  return {
    family: params.get('familia') ?? '',
    gender: 'Todos',
    query: params.get('q') ?? '',
    sort: 'rel',
    view: 'grid',
  };
}

export function isFiltered(state) {
  return Boolean(state.family || state.query.trim() || state.gender !== 'Todos');
}

export const DEFAULT_FILTERS = { family: '', gender: 'Todos', query: '', sort: 'rel' };
