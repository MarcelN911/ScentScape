import { showToast } from '../../core/events.js';
import * as player from './audio.js';
import { renderPlayer, toggleList } from './view.js';

const { music } = player;

async function startPlayback(root) {
  try {
    await player.play();
  } catch {
    player.pause();
    showToast('La música llega muy pronto ♪');
  }
  renderPlayer(root);
}

function togglePlay(root) {
  if (music.playing) {
    player.pause();
    renderPlayer(root);
    return;
  }
  startPlayback(root);
}

function switchTrack(root, index) {
  player.loadTrack(index);
  startPlayback(root);
}

function bindControls(root) {
  root.querySelector('[data-player-play]').addEventListener('click', () => togglePlay(root));
  root
    .querySelector('[data-player-next]')
    .addEventListener('click', () => switchTrack(root, music.index + 1));
  root.querySelectorAll('[data-player-list-toggle]').forEach((button) => {
    button.addEventListener('click', () => toggleList(root));
  });
  root.querySelectorAll('[data-track]').forEach((button) => {
    button.addEventListener('click', () => switchTrack(root, Number(button.dataset.track)));
  });
}

function bindSound(root) {
  root.querySelector('[data-player-mute]').addEventListener('click', () => {
    player.setMuted(!music.muted);
    renderPlayer(root);
  });
  root.querySelector('[data-player-volume]').addEventListener('input', (event) => {
    player.setVolume(Number(event.target.value));
    renderPlayer(root);
  });
}

function bindAudio(root) {
  music.audio.addEventListener('timeupdate', () => renderPlayer(root));
  music.audio.addEventListener('ended', () => switchTrack(root, music.index + 1));
}

export function initMusicPlayer() {
  const root = document.querySelector('[data-player]');
  if (!root) return;
  bindControls(root);
  bindSound(root);
  bindAudio(root);
  renderPlayer(root);
}
