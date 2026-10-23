import { padNumber } from '../../utils/format.js';
import { matches, sortItems } from './matching.js';
import { isFiltered } from './state.js';

export function activePanel(root, state) {
  return root.querySelector(`[data-view-panel="${state.view}"]`);
}

function updatePanel(panel, state) {
  let visible = 0;
  sortItems(panel.querySelectorAll('[data-shop-item]'), state.sort).forEach((item) => {
    item.hidden = !matches(item, state);
    if (!item.hidden)
      item.querySelector('[data-item-number]').textContent = padNumber((visible += 1));
    panel.append(item);
  });
  return visible;
}

function renderSummary(root, state, visible) {
  root.querySelector('[data-shop-count]').textContent = visible;
  root.querySelector('[data-shop-empty]').hidden = visible > 0;
  root.querySelector('[data-shop-empty-query]').textContent = state.query;
  root
    .querySelectorAll('.family-tabs [data-shop-clear]')
    .forEach((button) => (button.hidden = !isFiltered(state)));
}

export function applyFilters(root, state) {
  root.querySelectorAll('[data-view-panel]').forEach((panel) => {
    panel.hidden = panel.dataset.viewPanel !== state.view;
  });
  const visible = updatePanel(activePanel(root, state), state);
  renderSummary(root, state, visible);
}
