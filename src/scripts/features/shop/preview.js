/*
 * Vorschau rechts in der Indexansicht: zeigt das Produkt unter der Maus (sonst das erste).
 * Beim Wechsel: neues Bild wird von unten aufgedeckt, eine Lichtlinie läuft hoch, der Name gleitet herein.
 */
import { familyOfIngredient, scentColor } from '../../../data/scent.js';
import { formatCOP } from '../../utils/format.js';
import { prefersReducedMotion } from '../../utils/motion.js';

const CURTAIN = 'cubic-bezier(.7,0,.2,1)';
const EASE = 'cubic-bezier(.2,.8,.2,1)';

function noteChip(note, images) {
  const chip = document.createElement('span');
  chip.className = 'preview__note';
  chip.innerHTML = '<span class="preview__note-dot"></span><span></span>';
  chip.firstChild.style.background = scentColor(familyOfIngredient(note) ?? note);
  if (images[note]) chip.firstChild.innerHTML = `<img src="${images[note]}" alt="">`;
  chip.lastChild.textContent = note;
  return chip;
}

function sizeButton(size, index, selected) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = size.ml ? `${size.ml} ml` : 'Única';
  button.dataset.previewSize = index;
  button.setAttribute('aria-pressed', String(index === selected));
  return button;
}

function priceRoll(sizes, selected) {
  return sizes.map((size, index) => {
    const span = document.createElement('span');
    span.textContent = formatCOP(size.sale ?? size.price);
    span.style.setProperty('--y', index === selected ? 0 : index < selected ? -110 : 110);
    span.style.setProperty('--o', index === selected ? 1 : 0);
    return span;
  });
}

function fillText(preview, entry, number) {
  const q = (name) => preview.querySelector(`[data-preview-${name}]`);
  q('number').textContent = number;
  q('meta').textContent = [entry.brand, entry.label].filter(Boolean).join(' · ');
  q('name').textContent = entry.name;
  q('link').href = entry.href;
  q('heart').dataset.wishId = entry.id;
  preview.style.setProperty('--halo', `${scentColor(entry.families[0])}30`);
}

/** Größe, Preis und Warenkorb-Button passend zur gewählten Größe */
export function fillSizes(preview, entry, selected) {
  const size = entry.sizes[selected];
  const q = (name) => preview.querySelector(`[data-preview-${name}]`);
  q('sizes').replaceChildren(
    ...entry.sizes.map((item, index) => sizeButton(item, index, selected)),
  );
  q('prices').replaceChildren(...priceRoll(entry.sizes, selected));
  q('old').textContent = size.sale ? formatCOP(size.price) : '';
  q('size-label').textContent = size.ml ? `${size.ml} ml` : 'Bolsa';
  q('add').dataset.cartItem = JSON.stringify(size.item);
}

const SCAN = [
  { top: '100%', opacity: 1 },
  { top: '0%', opacity: 1 },
  { top: '0%', opacity: 0 },
];
const SLIDE_IN = [{ transform: 'translateY(105%)' }, { transform: 'none' }];
const FADE_UP = [
  { opacity: 0, transform: 'translateY(10px)' },
  { opacity: 1, transform: 'none' },
];

function animateChange(preview) {
  if (prefersReducedMotion()) return;
  const part = (name) => preview.querySelector(`[data-preview-${name}]`);
  const after = (delay, duration) => ({ duration, delay, easing: EASE, fill: 'backwards' });
  part('scan').animate(SCAN, { duration: 1150, easing: CURTAIN });
  part('head').animate(SLIDE_IN, after(180, 800));
  part('notes').animate(FADE_UP, after(340, 600));
}

function swapImage(preview, src, animate) {
  const base = preview.querySelector('[data-preview-image]');
  const next = preview.querySelector('[data-preview-next]');
  if (!animate || prefersReducedMotion()) return (base.src = src);
  next.src = src;
  const frames = [
    { clipPath: 'inset(100% 0% 0% 0%)', transform: 'scale(1.18)' },
    { clipPath: 'inset(0% 0% 0% 0%)', transform: 'scale(1.02)' },
  ];
  next.animate(frames, { duration: 1000, easing: CURTAIN }).onfinish = () => (base.src = src);
}

/** Zeigt ein Produkt in der Vorschau. animate: nur beim Wechsel, nicht beim ersten Füllen. */
export function showPreview(root, { entry, number, selected, images, animate }) {
  const preview = root.querySelector('[data-preview]');
  fillText(preview, entry, number);
  preview
    .querySelector('[data-preview-notes]')
    .replaceChildren(
      ...(entry.ingredients.length ? entry.ingredients : entry.families).map((note) =>
        noteChip(note, images),
      ),
    );
  fillSizes(preview, entry, selected);
  swapImage(preview, entry.image, animate);
  if (animate) animateChange(preview);
}
