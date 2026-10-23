/* Kaufbereich der Produktseite: Größe wählen, Menge ändern, Rückmeldung nach dem Hinzufügen. */
import { clamp } from '../../utils/motion.js';
import { findBuyElements, renderBuy, resetAdded, showAdded } from './buy-view.js';

const MAX_QUANTITY = 20;
const ADDED_FEEDBACK_MS = 1600;

function bindSizes(ui, state, signal) {
  ui.options.forEach((option, index) => {
    option.addEventListener('click', () => renderBuy(ui, Object.assign(state, { index })), {
      signal,
    });
  });
}

function bindQuantity(ui, state, signal) {
  ui.root.querySelectorAll('[data-qty-change]').forEach((button) => {
    const step = Number(button.dataset.qtyChange);
    button.addEventListener(
      'click',
      () => {
        state.quantity = clamp(state.quantity + step, 1, MAX_QUANTITY);
        renderBuy(ui, state);
      },
      { signal },
    );
  });
}

function bindAdded(ui, signal) {
  let timer = 0;
  ui.add.addEventListener(
    'ss:added',
    () => {
      showAdded(ui);
      clearTimeout(timer);
      timer = setTimeout(() => resetAdded(ui), ADDED_FEEDBACK_MS);
    },
    { signal },
  );
}

export function initBuy(signal) {
  const root = document.querySelector('[data-buy]');
  if (!root) return;
  const ui = findBuyElements(root);
  const state = { index: 0, quantity: 1 };
  bindSizes(ui, state, signal);
  bindQuantity(ui, state, signal);
  bindAdded(ui, signal);
}
