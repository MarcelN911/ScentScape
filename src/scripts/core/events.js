export const EVENTS = {
  cartChange: 'ss:cart-change',
  cartOpen: 'ss:cart-open',
  toast: 'ss:toast',
  wishChange: 'ss:wish-change',
};

export function emit(name, detail) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function listen(name, handler, options) {
  window.addEventListener(name, (event) => handler(event.detail), options);
}

/** options.cart: zusätzlich "Bolsa (n)" anzeigen */
export function showToast(message, options = {}) {
  emit(EVENTS.toast, { message, ...options });
}
