export const EVENTS = {
  cartChange: 'ss:cart-change',
  cartOpen: 'ss:cart-open',
  toast: 'ss:toast',
  quizOpen: 'ss:quiz-open',
};

export function emit(name, detail) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

export function listen(name, handler, options) {
  window.addEventListener(name, (event) => handler(event.detail), options);
}

export function showToast(message) {
  emit(EVENTS.toast, message);
}
