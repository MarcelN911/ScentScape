/* Abspielen im Karussell: nur das vordere Video läuft, stumm, und nur wenn der Bereich sichtbar ist. */
import { VIDEO_FALLBACK_MS } from '../../../data/home.js';
import { attachSource, warmUp } from './reel-preload.js';
import { videoOf } from './reel-view.js';

const START_AT = 0.6;

function playMuted(video) {
  /* Ist man schneller da als das Vorladen, bekommt das Video hier seine Adresse */
  attachSource(video);
  video.muted = true;
  if (video.ended) video.currentTime = START_AT;
  video.play().catch(() => {});
}

export function syncPlayback(parts, state) {
  parts.cards.forEach((card, index) => {
    const video = videoOf(parts, index);
    const shouldPlay = index === state.index && state.visible && !state.modalOpen;
    if (shouldPlay) playMuted(video);
    else video.pause();
  });
  /* Während eins läuft, puffert schon das nächste */
  if (state.visible) warmUp(videoOf(parts, (state.index + 1) % parts.cards.length));
}

function showProgress(parts, video) {
  if (!video.duration) return;
  parts.section.style.setProperty(
    '--reel-progress',
    (video.currentTime / video.duration).toFixed(4),
  );
}

/** Fortschrittsbalken und automatisches Weiterschalten am Ende (oder wenn ein Video nicht lädt) */
export function bindVideoEvents(parts, state, next, signal) {
  parts.cards.forEach((card, index) => {
    const video = videoOf(parts, index);
    const isActive = () => index === state.index;
    video.addEventListener('timeupdate', () => isActive() && showProgress(parts, video), {
      signal,
    });
    video.addEventListener('ended', () => isActive() && next(), { signal });
    video.addEventListener('error', () => isActive() && setTimeout(next, VIDEO_FALLBACK_MS), {
      signal,
    });
  });
}
