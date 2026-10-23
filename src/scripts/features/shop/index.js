import { activePanel, applyFilters } from './apply.js';
import { bindControls, renderControls } from './controls.js';
import { initEntrance, refreshEntrance } from './entrance.js';
import { capturePositions, playFlip } from './flip.js';
import { initListPreview } from './list-preview.js';
import { createShopState } from './state.js';

function render(root, state) {
  renderControls(root, state);
  applyFilters(root, state);
}

function createUpdater(root, state) {
  return (changes) => {
    const positions = capturePositions(activePanel(root, state));
    Object.assign(state, changes);
    render(root, state);
    playFlip(activePanel(root, state), positions);
    requestAnimationFrame(refreshEntrance);
  };
}

function focusSearchIfRequested(root) {
  if (new URLSearchParams(location.search).has('buscar'))
    root.querySelector('[data-shop-search]').focus();
}

export function initShop(signal) {
  const root = document.querySelector('[data-shop]');
  if (!root) return;
  const state = createShopState();
  bindControls(root, state, createUpdater(root, state), signal);
  render(root, state);
  initEntrance(root, signal);
  initListPreview(root, signal);
  focusSearchIfRequested(root);
}
