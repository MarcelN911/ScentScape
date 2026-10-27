/*
 * Story-Ansicht der Videos mit Ton (StoryModal.astro), nur Handy und Tablet hochkant.
 * - Startet mit Ton. Blockiert der Browser den Ton, läuft das Video stumm und "Ver con sonido" erscheint.
 * - Links antippen = zurück, rechts = weiter, zur Seite wischen ebenso; nach unten wischen,
 *   X oder Escape schließt. Am Ende eines Videos kommt das nächste, nach dem letzten schließt sie.
 * - Solange Ton läuft, ist die Hintergrundmusik still.
 */
import { VIDEOS } from '../../../data/home.js';
import { duck } from '../music/audio.js';
import { lockScroll } from '../../utils/scroll-lock.js';

export const STACKED_QUERY = '(max-width: 1079px) and (orientation: portrait), (max-width: 899px)';
const SWIPE = 40; // so weit zur Seite wischen = nächstes/voriges Video
const CLOSE_SWIPE = 90; // so weit nach unten wischen = schließen

function findParts(root) {
  return {
    root,
    video: root.querySelector('[data-story-video]'),
    frame: root.querySelector('[data-story-frame]'),
    segments: [...root.querySelectorAll('[data-story-segment]')],
    title: root.querySelector('[data-story-title]'),
    caption: root.querySelector('[data-story-caption]'),
    mute: root.querySelector('[data-story-mute]'),
  };
}

function renderSound(story) {
  story.parts.root.classList.toggle('is-muted', story.muted);
  story.parts.mute.setAttribute('aria-pressed', String(!story.muted));
  duck(story.open && !story.muted);
}

/* Mit Ton abspielen; klappt das nicht, stumm weiter */
function play(story) {
  const { video } = story.parts;
  video.muted = story.muted;
  video.play().catch(() => {
    if (video.muted) return;
    story.muted = true;
    renderSound(story);
    play(story);
  });
  renderSound(story);
}

function render(story) {
  const { parts, index } = story;
  const { src, poster, title, caption } = VIDEOS[index];
  Object.assign(parts.video, { src, poster });
  parts.title.textContent = title;
  parts.caption.textContent = caption;
  parts.segments.forEach((segment, position) => {
    segment.classList.toggle('is-done', position < index);
    segment.classList.toggle('is-active', position === index);
  });
  parts.root.style.setProperty('--story-progress', 0);
  play(story);
}

function close(story) {
  if (!story.open) return;
  story.open = false;
  story.parts.video.pause();
  duck(false);
  story.parts.root.classList.remove('is-visible');
  lockScroll('story', false);
  setTimeout(() => story.open || (story.parts.root.hidden = true), 350);
  story.onToggle(false, story.index);
}

/** Vor (1) oder zurück (-1). Vor dem ersten Video: von vorn; nach dem letzten: schließen. */
function go(story, step) {
  const next = story.index + step;
  if (next >= VIDEOS.length) {
    close(story);
  } else if (next < 0) {
    story.parts.video.currentTime = 0;
  } else {
    story.index = next;
    render(story);
  }
}

function open(story, index) {
  Object.assign(story, { index, open: true, muted: false });
  story.parts.root.hidden = false;
  lockScroll('story', true);
  requestAnimationFrame(() => story.parts.root.classList.add('is-visible'));
  render(story);
  story.onToggle(true);
}

function setMuted(story, muted) {
  story.muted = muted;
  play(story);
}

/* Klickziele im Modal und was sie tun */
const ACTIONS = [
  ['[data-story-close]', (story) => close(story)],
  ['[data-story-step]', (story, el) => go(story, Number(el.dataset.storyStep))],
  ['[data-story-mute]', (story) => setMuted(story, !story.muted)],
  ['[data-story-unmute]', (story) => setMuted(story, false)],
];

function onClick(story, event) {
  /* Nach einem Wischer kommt noch ein Klick an, der darf nichts zusätzlich auslösen */
  if (story.swiped) {
    story.swiped = false;
    return;
  }
  if (event.target === story.parts.root) {
    close(story);
    return;
  }
  const action = ACTIONS.find(([selector]) => event.target.closest(selector));
  if (action) action[1](story, event.target.closest(action[0]));
}

/* Wischen: nach unten schließt, zur Seite wechselt (nach links = nächstes) */
function onSwipe(story, dx, dy) {
  if (dy > CLOSE_SWIPE && dy > Math.abs(dx)) close(story);
  else if (Math.abs(dx) > SWIPE) go(story, dx < 0 ? 1 : -1);
  else return;
  story.swiped = true;
}

function bindSwipe(story, signal) {
  const { frame } = story.parts;
  let start = null;
  const down = (event) => (start = { x: event.clientX, y: event.clientY });
  const up = (event) => {
    if (start) onSwipe(story, event.clientX - start.x, event.clientY - start.y);
    start = null;
  };
  frame.addEventListener('pointerdown', down, { signal });
  frame.addEventListener('pointerup', up, { signal });
}

function onKey(story, event) {
  if (!story.open) return;
  if (event.key === 'Escape') close(story);
  if (event.key === 'ArrowRight') go(story, 1);
  if (event.key === 'ArrowLeft') go(story, -1);
}

function bindVideo(story, signal) {
  const { video, root } = story.parts;
  const progress = () =>
    video.duration &&
    root.style.setProperty('--story-progress', video.currentTime / video.duration);
  video.addEventListener('timeupdate', progress, { signal });
  video.addEventListener('ended', () => go(story, 1), { signal });
}

/** onToggle(open, index) meldet dem Karussell, ob es pausieren soll. Gibt open(index) zurück. */
export function createStoryModal(onToggle, signal) {
  const root = document.querySelector('[data-story-modal]');
  if (!root) return null;
  const story = { parts: findParts(root), index: 0, open: false, muted: false, onToggle };
  root.addEventListener('click', (event) => onClick(story, event), { signal });
  document.addEventListener('keydown', (event) => onKey(story, event), { signal });
  bindSwipe(story, signal);
  bindVideo(story, signal);
  signal.addEventListener('abort', () => close(story));
  return (index) => open(story, index);
}
