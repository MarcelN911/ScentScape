/*
 * Zustand des Players. Spielt die MP3-Dateien aus data/tracks.js über ein <audio>-Element ab.
 * Der Player bleibt beim Seitenwechsel stehen, deshalb läuft die Musik weiter.
 * Gespeichert (localStorage): ob Musik gewünscht ist (ss_music), stumm und Lautstärke.
 * Stelle im Song (sessionStorage, nur für diesen Tab): Wird die Seite neu geladen, geht es dort weiter.
 * Ein neuer Besuch (neuer Tab) beginnt mit dem ersten Titel der Playlist (data/tracks.js).
 */
import { TRACKS } from '../../../data/tracks.js';

const read = (key, fallback) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // Privater Modus: gilt dann nur für diesen Besuch.
  }
};

/* Titel und Sekunde für diesen Tab merken bzw. lesen */
const POSITION_KEY = 'ss_music_pos';

function readPosition() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(POSITION_KEY));
    return saved && TRACKS[saved.index] ? saved : { index: 0, time: 0 };
  } catch {
    return { index: 0, time: 0 };
  }
}

function savePosition(index, time) {
  try {
    sessionStorage.setItem(POSITION_KEY, JSON.stringify({ index, time: Math.floor(time) }));
  } catch {
    // Privater Modus: dann beginnt ein Neuladen wieder von vorn.
  }
}

const saved = readPosition();

export const music = {
  playing: false,
  muted: read('ss_music_muted', '0') === '1',
  volume: Number(read('ss_music_vol', 60)),
  index: saved.index,
  elapsed: saved.time,
  ducked: false, // kurz still, solange ein Video mit Ton läuft
};

export const wantsMusic = () => read('ss_music', '1') !== '0';
export const currentTrack = () => TRACKS[music.index];

/* Wird aufgerufen, wenn sich etwas ändert, das der Player anzeigen soll (siehe onChange) */
let notify = () => {};

/** player.js meldet hier, wie die Anzeige neu gezeichnet wird */
export function onChange(callback) {
  notify = callback;
}

/* Das <audio>-Element entsteht erst beim ersten Abspielen (spart Ladezeit) */
let element = null;

function applyVolume() {
  const silent = music.muted || music.ducked;
  element.volume = silent ? 0 : music.volume / 100;
}

/* Beim Titelwechsel meldet das Element kurz "pause", das soll den Player nicht anhalten */
let switching = false;

/* Von außen angehalten (z. B. Kopfhörer abgezogen, Sperrbildschirm): Anzeige anpassen */
function onPause() {
  if (switching || element.ended) return;
  music.playing = false;
  notify();
}

/* Laufende Zeit anzeigen und merken (für ein Neuladen der Seite) */
function onTime() {
  music.elapsed = Math.floor(element.currentTime);
  savePosition(music.index, element.currentTime);
}

function bindElement() {
  element.addEventListener('timeupdate', onTime);
  /* Titel zu Ende: der nächste beginnt */
  element.addEventListener('ended', () => setTrack(music.index + 1));
  element.addEventListener('play', () => (switching = false));
  element.addEventListener('pause', onPause);
}

function audio() {
  if (element) return element;
  element = new Audio(currentTrack().src);
  element.preload = 'none';
  /* Nach einem Neuladen an der gemerkten Stelle weitermachen, sobald der Song geladen ist */
  const resume = () => (element.currentTime = saved.time);
  if (saved.time) element.addEventListener('loadedmetadata', resume, { once: true });
  bindElement();
  applyVolume();
  return element;
}

/* Abspielen; blockiert der Browser (noch keine Berührung der Seite), gilt es als pausiert */
function startAudio() {
  music.playing = true;
  audio()
    .play()
    .catch(() => {
      music.playing = false;
      notify();
    });
}

export function play() {
  save('ss_music', 1);
  startAudio();
}

export function pause() {
  audio().pause();
  music.playing = false;
  save('ss_music', 0);
}

export function setTrack(index) {
  music.index = (index + TRACKS.length) % TRACKS.length;
  music.elapsed = 0;
  savePosition(music.index, 0);
  switching = music.playing;
  audio().src = currentTrack().src;
  if (music.playing) startAudio();
  notify();
}

export function setMuted(muted) {
  music.muted = muted;
  save('ss_music_muted', muted ? 1 : 0);
  if (element) applyVolume();
}

export function setVolume(percent) {
  music.volume = percent;
  save('ss_music_vol', percent);
  setMuted(false);
}

/** Musik stumm schalten, solange ein Video mit Ton läuft. Die Einstellung wird dabei nicht gespeichert. */
export function duck(on) {
  music.ducked = on;
  if (element) applyVolume();
}
