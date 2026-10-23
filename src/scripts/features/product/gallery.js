/*
 * Produktgalerie: wechselt automatisch alle 5,5 s (pausiert beim Hovern und im Zoom).
 * Die Bedienung (Pfeile, Miniaturen, Tastatur, Wischen, Zoom) steht in gallery-input.js.
 */
import { GALLERY_AUTOPLAY_MS, GALLERY_SLIDES } from '../../../data/product.js';
import { bindGalleryInput } from './gallery-input.js';
import { renderGallery, renderProgress } from './gallery-view.js';

function createGallery(root) {
  const gallery = { root, index: 0, zoomed: false, hovering: false, elapsed: 0, lastTime: 0 };
  gallery.render = () => renderGallery(root, gallery);
  gallery.goTo = (index) => {
    const count = GALLERY_SLIDES.length;
    Object.assign(gallery, { index: (index + count) % count, zoomed: false, elapsed: 0 });
    gallery.render();
  };
  return gallery;
}

function isPaused(gallery) {
  return gallery.hovering || gallery.zoomed || document.hidden;
}

function tick(gallery, time) {
  const delta = Math.min(100, time - (gallery.lastTime || time));
  gallery.lastTime = time;
  if (!isPaused(gallery)) gallery.elapsed += delta;
  if (gallery.elapsed >= GALLERY_AUTOPLAY_MS) gallery.goTo(gallery.index + 1);
  renderProgress(gallery.root, gallery, gallery.elapsed / GALLERY_AUTOPLAY_MS);
}

function startAutoplay(gallery, signal) {
  let frame = 0;
  const loop = (time) => {
    tick(gallery, time);
    frame = requestAnimationFrame(loop);
  };
  frame = requestAnimationFrame(loop);
  signal.addEventListener('abort', () => cancelAnimationFrame(frame));
}

export function initGallery(signal) {
  const root = document.querySelector('[data-gallery]');
  if (!root) return;
  const gallery = createGallery(root);
  bindGalleryInput(gallery, signal);
  gallery.render();
  startAutoplay(gallery, signal);
}
