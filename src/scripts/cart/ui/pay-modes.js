import { getPreferences, updatePreferences } from '../preferences.js';

export function renderPayModes(root) {
  const selected = getPreferences().payMode;
  root.querySelectorAll('[data-pay-mode]').forEach((option) => {
    option.setAttribute('aria-pressed', String(option.dataset.payMode === selected));
  });
}

export function bindPayModes(root) {
  root.querySelectorAll('[data-pay-mode]').forEach((option) => {
    option.addEventListener('click', () => updatePreferences({ payMode: option.dataset.payMode }));
  });
}
