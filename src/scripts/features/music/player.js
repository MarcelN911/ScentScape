/*
 * Bedienung des Players. Wer Musik nicht ausgeschaltet hat, hört sie sofort, wenn der Browser es
 * erlaubt, sonst ab dem ersten Klick oder Tipp irgendwo auf der Seite.
 */
import * as player from './audio.js';
import { markVolumeSupport, renderPlayer, renderTime, setListOpen } from './view.js';

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
  root.querySelectorAll('[data-player-volume]').forEach((slider) => {
    slider.addEventListener('input', () => (player.setVolume(Number(slider.value)), render()));
  });
}

function bindList(root) {
  root.querySelectorAll('[data-player-list-toggle]').forEach((button) => {
    button.addEventListener('click', () => setListOpen(root, !root.hasAttribute('data-list-open')));
  });
  /* pointerdown statt click: iPhones melden Tipps auf leere Flächen nicht als click */
  document.addEventListener(
    'pointerdown',
    (event) => root.contains(event.target) || setListOpen(root, false),
  );
  document.addEventListener(
    'keydown',
    (event) => event.key === 'Escape' && setListOpen(root, false),
  );
}

/* Klicks rund um die Videos starten die Musik nicht: Sie würde sonst nach dem Video loslaufen */
const NO_AUTOSTART = '[data-reel], [data-video-modal], [data-story-modal]';

/*
 * Welche Aktionen Ton erlauben, ist je Browser verschieden: Maus beim Drücken (pointerdown),
 * Finger beim Loslassen (pointerup, touchend), dazu click und Tastendruck. Deshalb auf alle hören.
 * Wischen zum Scrollen zählt auf dem Handy nicht. Klappt der Start nicht, beim nächsten Tipp nochmal.
 */
const START_EVENTS = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'];

/* Maus: nur pointerdown zählt (pointerup danach wäre doppelt). Finger/Stift: nur pointerup. */
function allowsSound(event) {
  if (event.type === 'pointerdown') return event.pointerType === 'mouse';
  if (event.type === 'pointerup') return event.pointerType !== 'mouse';
  return true;
}

/* Klicks im Player selbst und rund um die Videos zählen nicht */
const isIgnored = (root, event) =>
  root.contains(event.target) || Boolean(event.target.closest?.(NO_AUTOSTART));

/*
 * Musik startet sofort beim Laden der Seite, wenn der Browser das erlaubt (manche tun es,
 * z. B. bei Besuchern, die schon öfter Ton auf der Seite gehört haben). Sonst beim ersten Tipp.
 */
async function startMusic(root, render) {
  if (!player.wantsMusic()) return;
  const started = await player.play();
  render();
  if (!started) startOnFirstInteraction(root, render);
}

/*
 * Jeder Tipp versucht zu starten, bis ein Versuch wirklich klappt. Ein Tipp löst mehrere
 * Ereignisse kurz hintereinander aus (pointerup, touchend, click): Jedes darf es versuchen,
 * denn je nach Handy erlaubt nur eines davon Ton. Aufgehört wird erst, wenn Musik läuft
 * oder der Besucher sie selbst ausgeschaltet hat.
 */
function startOnFirstInteraction(root, render) {
  const stop = () => START_EVENTS.forEach((type) => removeEventListener(type, start, true));
  async function start(event) {
    if (!player.wantsMusic()) return stop();
    if (isIgnored(root, event) || !allowsSound(event)) return;
    const started = await player.play();
    render();
    if (started) stop();
  }
  START_EVENTS.forEach((type) => addEventListener(type, start, true));
}

export function initMusicPlayer() {
  const root = document.querySelector('[data-player]');
  if (!root) return;
  const render = () => renderPlayer(root);
  bindPlayback(root, render);
  bindSound(root, render);
  bindList(root);
  markVolumeSupport(root);
  /* Titelwechsel am Ende eines Songs oder Anhalten von außen: Anzeige neu zeichnen */
  player.onChange(render);
  startMusic(root, render);
  setInterval(() => renderTime(root), 1000);
  render();
}
