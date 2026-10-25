/*
 * Suchfeld mit Vorschlägen (components/ui/SearchCombo.astro).
 * search(text) liefert [{ title, meta, image, value }], pick(option) übernimmt eine Wahl,
 * change(text) meldet jede Eingabe (z. B. um eine Wahl wieder aufzuheben).
 */

function optionElement(combo, option, index) {
  const element = combo.template.content.firstElementChild.cloneNode(true);
  element.querySelector('img').src = option.image;
  element.querySelector('.combo__title').textContent = option.title;
  element.querySelector('.combo__meta').textContent = option.meta;
  element.dataset.index = index;
  return element;
}

function setOpen(combo, open) {
  const show = open && combo.options.length > 0;
  combo.root.classList.toggle('is-open', show);
  combo.input.setAttribute('aria-expanded', String(show));
}

function renderOptions(combo) {
  const text = combo.input.value.trim();
  combo.options = combo.picked ? [] : combo.handlers.search(text);
  combo.active = 0;
  combo.list.replaceChildren(
    ...combo.options.map((option, index) => optionElement(combo, option, index)),
  );
  combo.list.firstElementChild?.classList.add('is-active');
  combo.root.querySelector('[data-combo-empty]').hidden =
    !text || combo.picked || combo.options.length > 0;
  combo.root.querySelector('[data-combo-clear]').hidden = !text || combo.check;
  setOpen(combo, combo.focused);
}

/** Zeigt eine Wahl im Feld (auch von außen, z. B. vorausgewählt per Link) */
export function showPicked(combo, title) {
  combo.input.value = title;
  combo.picked = Boolean(title);
  combo.root.classList.toggle('is-picked', combo.picked);
  combo.root.querySelector('[data-combo-check]').hidden = !combo.picked || !combo.check;
  renderOptions(combo);
}

function choose(combo, index) {
  const option = combo.options[index];
  if (!option) return;
  combo.focused = false;
  showPicked(combo, option.title);
  combo.handlers.pick(option);
}

function moveActive(combo, step) {
  const items = [...combo.list.children];
  if (!items.length) return;
  combo.active = (combo.active + step + items.length) % items.length;
  items.forEach((item, index) => item.classList.toggle('is-active', index === combo.active));
}

function onEnter(combo, event) {
  if (!combo.options.length) return;
  event.preventDefault();
  choose(combo, combo.active);
}

function onArrow(step) {
  return (combo, event) => {
    event.preventDefault();
    moveActive(combo, step);
  };
}

const KEYS = {
  Enter: onEnter,
  Escape: (combo) => setOpen(combo, false),
  ArrowDown: onArrow(1),
  ArrowUp: onArrow(-1),
};

function onInput(combo) {
  combo.picked = false;
  combo.root.classList.remove('is-picked');
  combo.root.querySelector('[data-combo-check]').hidden = true;
  combo.handlers.change(combo.input.value.trim());
  renderOptions(combo);
}

function setFocused(combo, focused) {
  combo.focused = focused;
  if (focused) renderOptions(combo);
  else setTimeout(() => setOpen(combo, combo.focused), 120);
}

function bindInput(combo, signal) {
  const { input } = combo;
  input.addEventListener('input', () => onInput(combo), { signal });
  input.addEventListener('focus', () => setFocused(combo, true), { signal });
  input.addEventListener('blur', () => setFocused(combo, false), { signal });
  input.addEventListener('keydown', (event) => KEYS[event.key]?.(combo, event), { signal });
}

function bindButtons(combo, signal) {
  const onOption = (event) => {
    const option = event.target.closest('[data-index]');
    if (option) choose(combo, Number(option.dataset.index));
  };
  const onClear = () => {
    combo.input.value = '';
    onInput(combo);
  };
  combo.list.addEventListener('mousedown', onOption, { signal });
  combo.root.querySelector('[data-combo-clear]').addEventListener('click', onClear, { signal });
}

/** check: nach einer Wahl einen Haken statt ✕ zeigen */
export function createCombo(root, handlers, signal, check = false) {
  const combo = { root, handlers, check, options: [], active: 0, picked: false, focused: false };
  combo.input = root.querySelector('[data-combo-input]');
  combo.list = root.querySelector('[data-combo-list]');
  combo.template = root.querySelector('[data-combo-option]');
  bindInput(combo, signal);
  bindButtons(combo, signal);
  return combo;
}
