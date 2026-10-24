import { currentTrack, music, wantsMusic } from './audio.js';

function timeText() {
  const minutes = Math.floor(music.elapsed / 60);
  const seconds = String(music.elapsed % 60).padStart(2, '0');
  const status = !music.playing ? 'en pausa' : music.muted ? 'silenciado' : 'sonando';
  return `${minutes}:${seconds} · ${status}`;
}

export function renderTime(root) {
  root.querySelector('[data-player-time]').textContent = timeText();
}

function renderButtons(root) {
  root
    .querySelector('[data-player-play]')
    .setAttribute('aria-label', music.playing ? 'Pausar' : 'Reproducir');
  root
    .querySelector('[data-player-mute]')
    .setAttribute('aria-label', music.muted ? 'Activar sonido' : 'Silenciar');
  root.querySelectorAll('[data-track]').forEach((button) => {
    button.classList.toggle('is-active', Number(button.dataset.track) === music.index);
  });
}

export function renderPlayer(root) {
  root.toggleAttribute('data-playing', music.playing);
  root.toggleAttribute('data-muted', music.muted);
  root.toggleAttribute('data-waiting', !music.playing && wantsMusic());
  root.querySelector('[data-player-title]').textContent = currentTrack().title;
  root.querySelector('[data-player-volume]').value = music.volume;
  renderButtons(root);
  renderTime(root);
}

export function setListOpen(root, open) {
  root.toggleAttribute('data-list-open', open);
}
