/*
 * Bedienung des Players. Wer Musik nicht ausgeschaltet hat, hört sie ab dem ersten Klick oder Tastendruck
 * irgendwo auf der Seite (Browser erlauben Ton erst nach einer Nutzeraktion).
 */
import * as player from './audio.js';
import { renderPlayer, renderTime, setListOpen } from './view.js';

const { music } = player;

function togglePlay() {
  if (music.playing) player.pause();
  else player.play();
}

function pickTrack(index) {
  player.setTrack(index);
  if (!music.playing) player.play();
}

function bindPlayback(root, render) {
  const on = (selector, action) =>
    root.querySelector(selector).addEventListener('click', () => (action(), render()));
  on('[data-player-play]', togglePlay);
  on('[data-player-next]', () => player.setTrack(music.index + 1));
  root.querySelectorAll('[data-track]').forEach((button) => {
    button.addEventListener('click', () => (pickTrack(Number(button.dataset.track)), render()));
  });
}

function bindSound(root, render) {
  root.querySelector('[data-player-mute]').addEventListener('click', () => {
    player.setMuted(!music.muted);
    render();
  });
  root.querySelector('[data-player-volume]').addEventListener('input', (event) => {
    player.setVolume(Number(event.target.value));
    render();
  });
}

function bindList(root) {
  root.querySelectorAll('[data-player-list-toggle]').forEach((button) => {
    button.addEventListener('click', () => setListOpen(root, !root.hasAttribute('data-list-open')));
  });
  document.addEventListener(
    'click',
    (event) => root.contains(event.target) || setListOpen(root, false),
  );
  document.addEventListener(
    'keydown',
    (event) => event.key === 'Escape' && setListOpen(root, false),
  );
}

function startOnFirstInteraction(root, render) {
  if (!player.wantsMusic()) return;
  const start = (event) => {
    if (root.contains(event.target)) return;
    removeEventListener('pointerdown', start, true);
    removeEventListener('keydown', start, true);
    if (!music.playing) player.play();
    render();
  };
  addEventListener('pointerdown', start, true);
  addEventListener('keydown', start, true);
}

export function initMusicPlayer() {
  const root = document.querySelector('[data-player]');
  if (!root) return;
  const render = () => renderPlayer(root);
  bindPlayback(root, render);
  bindSound(root, render);
  bindList(root);
  startOnFirstInteraction(root, render);
  setInterval(() => (player.tick() ? render() : renderTime(root)), 1000);
  render();
}
