/* Großansicht eines Videos mit Ton, im Stil eines Instagram-Beitrags. */
import { VIDEOS } from '../../../data/home.js';

function findModalParts() {
  const modal = document.querySelector('[data-video-modal]');
  return {
    modal,
    player: modal.querySelector('[data-video-player]'),
    caption: modal.querySelector('[data-video-caption]'),
    prev: modal.querySelector('[data-video-step="-1"]'),
    next: modal.querySelector('[data-video-step="1"]'),
  };
}

function show(parts, index) {
  const video = VIDEOS[index];
  parts.player.src = video.src;
  parts.player.play().catch(() => {});
  parts.caption.textContent = video.caption;
  parts.prev.hidden = index === 0;
  parts.next.hidden = index === VIDEOS.length - 1;
}

function openModal(modal, index) {
  modal.current = index;
  show(modal.parts, index);
  modal.parts.modal.hidden = false;
  document.documentElement.classList.add('is-locked');
  modal.parts.modal.querySelector('[data-video-close]').focus();
  modal.onToggle(true);
}

function closeModal(modal) {
  if (modal.parts.modal.hidden) return;
  modal.parts.player.pause();
  modal.parts.modal.hidden = true;
  document.documentElement.classList.remove('is-locked');
  modal.onToggle(false);
}

function isCloseClick(parts, event) {
  return event.target === parts.modal || Boolean(event.target.closest('[data-video-close]'));
}

function bindClosing(modal, signal) {
  const { parts } = modal;
  const onClick = (event) => isCloseClick(parts, event) && closeModal(modal);
  parts.modal.addEventListener('click', onClick, { signal });
  const onKey = (event) => event.key === 'Escape' && closeModal(modal);
  document.addEventListener('keydown', onKey, { signal });
}

function bindSteps(modal, signal) {
  [modal.parts.prev, modal.parts.next].forEach((button) => {
    const step = Number(button.dataset.videoStep);
    button.addEventListener('click', () => openModal(modal, modal.current + step), { signal });
  });
}

/** onToggle(open) meldet dem Karussell, ob es pausieren soll. Gibt open(index) zurück. */
export function createVideoModal(onToggle, signal) {
  const modal = { parts: findModalParts(), current: 0, onToggle };
  bindClosing(modal, signal);
  bindSteps(modal, signal);
  signal.addEventListener('abort', () => closeModal(modal));
  return (index) => openModal(modal, index);
}
