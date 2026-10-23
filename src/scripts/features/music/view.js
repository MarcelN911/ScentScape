import { currentTrack, music } from './audio.js';

function formatTime(seconds) {
  const whole = Math.floor(seconds || 0);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

function statusText() {
  if (!music.playing) return 'en pausa';
  return music.muted ? 'silenciado' : 'sonando';
}

function renderText(root) {
  root.querySelector('[data-player-title]').textContent = currentTrack().title;
  root.querySelector('[data-player-time]').textContent = formatTime(music.audio.currentTime);
  root.querySelector('[data-player-status]').textContent = statusText();
}

function renderButtons(root) {
  const play = root.querySelector('[data-player-play]');
  const mute = root.querySelector('[data-player-mute]');
  play.setAttribute('aria-label', music.playing ? 'Pausar' : 'Reproducir');
  mute.setAttribute('aria-label', music.muted ? 'Activar sonido' : 'Silenciar');
  root.querySelectorAll('[data-track]').forEach((button) => {
    button.classList.toggle('is-active', Number(button.dataset.track) === music.index);
  });
}

export function renderPlayer(root) {
  root.toggleAttribute('data-playing', music.playing);
  root.toggleAttribute('data-muted', music.muted);
  renderText(root);
  renderButtons(root);
}

export function toggleList(root) {
  root.toggleAttribute('data-list-open');
}
