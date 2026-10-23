export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function hasFinePointer() {
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}
