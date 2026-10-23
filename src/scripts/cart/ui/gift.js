import { getPreferences, updatePreferences } from '../preferences.js';

function tomorrow() {
  return new Date(Date.now() + 864e5).toISOString().slice(0, 10);
}

export function renderGift(root) {
  const preferences = getPreferences();
  root.querySelector('[data-gift-toggle]').checked = preferences.gift;
  root.querySelector('[data-gift-details]').hidden = !preferences.gift;
  root.querySelector('[data-gift-count]').textContent = preferences.note.length;
}

function fillInputs(root) {
  const preferences = getPreferences();
  root.querySelector('[data-gift-note]').value = preferences.note;
  root.querySelector('[data-gift-date]').value = preferences.date;
  root.querySelector('[data-gift-date]').min = tomorrow();
}

export function bindGift(root) {
  fillInputs(root);
  root.querySelector('[data-gift-toggle]').addEventListener('change', (event) => {
    updatePreferences({ gift: event.target.checked });
  });
  root.querySelector('[data-gift-note]').addEventListener('input', (event) => {
    updatePreferences({ note: event.target.value.slice(0, 180) });
  });
  root.querySelector('[data-gift-date]').addEventListener('change', (event) => {
    updatePreferences({ date: event.target.value });
  });
}
