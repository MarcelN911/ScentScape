/*
 * "ScentScape en video": Karussell mit aufgefächerten Karten.
 * Beim Hereinscrollen fächern die Karten auf, das vordere Video läuft stumm und schaltet am Ende weiter.
 */
import { VIDEOS } from '../../../data/home.js';
import { easeOut, onScrollProgress, PINNED_RANGE } from '../../effects/scroll.js';
import { clamp } from '../../utils/motion.js';
import { bindVideoEvents, syncPlayback } from './reel-playback.js';
import { findReelParts, renderReel } from './reel-view.js';
import { createVideoModal } from './video-modal.js';

const TITLES = VIDEOS.map((video) => video.title);

function select(reel, index) {
  const count = reel.parts.cards.length;
  reel.state.index = ((index % count) + count) % count;
  renderReel(reel.parts, reel.state.index, TITLES);
  syncPlayback(reel.parts, reel.state);
}

function onCardClick(reel, card) {
  const index = Number(card.dataset.videoCard);
  if (index === reel.state.index) reel.openModal(index);
  else select(reel, index);
}

/* Klickziele im Bereich und was sie tun */
const CLICK_TARGETS = [
  ['[data-video-card]', onCardClick],
  ['[data-video-thumb]', (reel, thumb) => select(reel, Number(thumb.dataset.videoThumb))],
  [
    '[data-reel-step]',
    (reel, step) => select(reel, reel.state.index + Number(step.dataset.reelStep)),
  ],
  ['[data-reel-open]', (reel) => reel.openModal(reel.state.index)],
];

function handleClick(reel, event) {
  for (const [selector, handler] of CLICK_TARGETS) {
    const element = event.target.closest(selector);
    if (element) return handler(reel, element);
  }
  return undefined;
}

function watchVisibility(reel) {
  const observer = new IntersectionObserver(
    ([entry]) => {
      reel.state.visible = entry.isIntersecting;
      syncPlayback(reel.parts, reel.state);
    },
    { threshold: 0.35 },
  );
  observer.observe(reel.parts.stage);
  return () => observer.disconnect();
}

/* Beim Hereinscrollen fächern die Karten auf (--fan: 0 → 1). Läuft innerhalb von withGsap(). */
export function animateReelFan() {
  const section = document.querySelector('[data-reel]');
  if (!section) return;
  const stage = section.querySelector('[data-reel-stage]');
  onScrollProgress(section, PINNED_RANGE, (progress) => {
    stage.style.setProperty('--fan', easeOut(clamp(progress / 0.55)).toFixed(4));
  });
}

function createReel(section, signal) {
  const reel = {
    parts: findReelParts(section),
    state: { index: 0, visible: false, modalOpen: false },
  };
  reel.openModal = createVideoModal((open) => {
    reel.state.modalOpen = open;
    syncPlayback(reel.parts, reel.state);
  }, signal);
  return reel;
}

export function initReel(signal) {
  const section = document.querySelector('[data-reel]');
  if (!section) return undefined;
  const reel = createReel(section, signal);
  section.addEventListener('click', (event) => handleClick(reel, event), { signal });
  bindVideoEvents(reel.parts, reel.state, () => select(reel, reel.state.index + 1), signal);
  select(reel, 0);
  return watchVisibility(reel);
}
