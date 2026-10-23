import { GALLERY_SLIDES } from '../../../data/product.js';

function hintFor(slide, zoomed) {
  if (zoomed) return 'Clic para salir del zoom';
  return slide.notes ? 'Arrastra para cambiar' : 'Clic para ampliar';
}

function cursorFor(slide, zoomed) {
  if (zoomed) return 'Cerrar';
  return slide.notes ? 'Arrastra' : 'Ampliar';
}

function renderSlides(root, index) {
  root.querySelectorAll('[data-slide]').forEach((slide) => {
    const position = Number(slide.dataset.slide);
    slide.classList.toggle('is-active', position === index);
    slide.classList.toggle('is-before', position < index);
  });
  root.querySelectorAll('[data-slide-go]').forEach((thumb) => {
    thumb.classList.toggle('is-active', Number(thumb.dataset.slideGo) === index);
  });
}

export function renderGallery(root, state) {
  const slide = GALLERY_SLIDES[state.index];
  renderSlides(root, state.index);
  root.toggleAttribute('data-zoomed', state.zoomed);
  root.querySelector('[data-gallery-label]').textContent = slide.label;
  root.querySelector('[data-gallery-hint]').textContent = hintFor(slide, state.zoomed);
  root.querySelector('[data-gallery-stage]').dataset.cursor = cursorFor(slide, state.zoomed);
}

export function renderProgress(root, state, fraction) {
  root.querySelectorAll('[data-gallery-segment]').forEach((segment, position) => {
    const fill = position < state.index ? 1 : position === state.index ? fraction : 0;
    segment.style.setProperty('--fill', `${Math.min(1, fill) * 100}%`);
  });
}
