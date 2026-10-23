import { GALLERY_SLIDES } from '../../../data/product.js';

const KEY_STEPS = { ArrowRight: 1, ArrowLeft: -1 };

function followZoom(gallery, event) {
  const box = gallery.root.querySelector('[data-gallery-stage]').getBoundingClientRect();
  gallery.root.style.setProperty('--zx', `${((event.clientX - box.left) / box.width) * 100}%`);
  gallery.root.style.setProperty('--zy', `${((event.clientY - box.top) / box.height) * 100}%`);
}

function toggleZoom(gallery, event) {
  const isControl = event.target.closest('a, button');
  if (isControl || gallery.dragged || GALLERY_SLIDES[gallery.index].notes) return;
  gallery.zoomed = !gallery.zoomed;
  followZoom(gallery, event);
  gallery.render();
}

function leaveStage(gallery) {
  gallery.hovering = false;
  gallery.zoomed = false;
  gallery.render();
}

function bindStage(gallery, signal) {
  const stage = gallery.root.querySelector('[data-gallery-stage]');
  stage.addEventListener('mouseenter', () => (gallery.hovering = true), { signal });
  stage.addEventListener('mouseleave', () => leaveStage(gallery), { signal });
  stage.addEventListener('mousemove', (event) => gallery.zoomed && followZoom(gallery, event), {
    signal,
  });
  stage.addEventListener('click', (event) => toggleZoom(gallery, event), { signal });
}

function pointX(event) {
  return event.changedTouches?.[0]?.clientX ?? event.touches?.[0]?.clientX ?? event.clientX;
}

function endSwipe(gallery, event) {
  if (gallery.dragStart === undefined) return;
  const dx = pointX(event) - gallery.dragStart;
  gallery.dragStart = undefined;
  gallery.dragged = Math.abs(dx) > 8;
  if (Math.abs(dx) > 50) gallery.goTo(gallery.index + (dx < 0 ? 1 : -1));
}

function bindSwipe(gallery, signal) {
  const stage = gallery.root.querySelector('[data-gallery-stage]');
  const start = (event) => Object.assign(gallery, { dragStart: pointX(event), dragged: false });
  stage.addEventListener('mousedown', start, { signal });
  stage.addEventListener('touchstart', start, { signal, passive: true });
  addEventListener('mouseup', (event) => endSwipe(gallery, event), { signal });
  addEventListener('touchend', (event) => endSwipe(gallery, event), { signal });
}

function bindArrow(gallery, selector, step, signal) {
  gallery.root.querySelector(selector).addEventListener(
    'click',
    (event) => {
      event.stopPropagation();
      gallery.goTo(gallery.index + step);
    },
    { signal },
  );
}

function bindThumbs(gallery, signal) {
  gallery.root.querySelectorAll('[data-slide-go]').forEach((thumb) => {
    thumb.addEventListener('click', () => gallery.goTo(Number(thumb.dataset.slideGo)), { signal });
  });
}

function onKey(gallery, event) {
  if (event.target.closest('input, textarea, select')) return;
  if (KEY_STEPS[event.key]) gallery.goTo(gallery.index + KEY_STEPS[event.key]);
  if (event.key === 'Escape' && gallery.zoomed) gallery.goTo(gallery.index);
}

export function bindGalleryInput(gallery, signal) {
  bindStage(gallery, signal);
  bindSwipe(gallery, signal);
  bindArrow(gallery, '[data-gallery-prev]', -1, signal);
  bindArrow(gallery, '[data-gallery-next]', 1, signal);
  bindThumbs(gallery, signal);
  addEventListener('keydown', (event) => onKey(gallery, event), { signal });
}
