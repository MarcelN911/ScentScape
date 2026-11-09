/*
 * Zustand des Players. Spielt die MP3-Dateien aus data/tracks.js über ein <audio>-Element ab.
 * Der Player bleibt beim Seitenwechsel stehen, deshalb läuft die Musik weiter.
 * Gespeichert (localStorage): ob Musik gewünscht ist (ss_music) und stumm.
 * Lautstärke (sessionStorage): Jeder neue Besuch beginnt wieder leise (DEFAULT_VOLUME), damit niemand erschrickt.
 * Stelle im Song (sessionStorage, nur für diesen Tab): Wird die Seite neu geladen, geht es dort weiter.
 * Ein neuer Besuch (neuer Tab) beginnt mit dem ersten Titel der Playlist (data/tracks.js).
 */
import { TRACKS } from '../../../data/tracks.js';
import { readJson, writeJson } from '../../utils/storage.js';

const DEFAULT_VOLUME = 50;
const VOLUME_KEY = 'ss_music_vol';

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

/* Manche Browser (blockierte Website-Daten) werfen schon beim Zugriff auf sessionStorage einen Fehler */
function session() {
  try {
    return sessionStorage;
  } catch {
    return null;
  }
}

export const music = {
  playing: false,
  muted: read('ss_music_muted', '0') === '1',
  volume: Number(readJson(session(), VOLUME_KEY, DEFAULT_VOLUME)),
  index: saved.index,
  elapsed: saved.time,
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

/* Das Ohr hört Lautstärke nicht linear: quadriert klingt 50 % am Regler auch wie die Hälfte */
const loudness = (percent) => (percent / 100) ** 2;

/* iPhones ignorieren element.volume, deshalb zum Stummschalten zusätzlich element.muted */
function applyVolume() {
  element.muted = music.muted;
  element.volume = music.muted ? 0 : loudness(music.volume);
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

/* Nach einem Neuladen an der gemerkten Stelle weitermachen. Ein Titelwechsel setzt das auf 0. */
let resumeAt = saved.time;

function resume() {
  if (resumeAt) element.currentTime = resumeAt;
  resumeAt = 0;
}

function audio() {
  if (element) return element;
  element = new Audio(currentTrack().src);
  element.preload = 'none';
  element.addEventListener('loadedmetadata', resume);
  bindElement();
  applyVolume();
  return element;
}

/*
 * Abspielen. Gibt true zurück, wenn es geklappt hat.
 * Blockiert der Browser (noch keine Berührung der Seite), gilt es als pausiert.
 * Wird ein Start durch einen neuen abgelöst (schnell "Siguiente" getippt), läuft die Musik
 * trotzdem: Dann ist das Element nicht pausiert und die Anzeige bleibt auf "sonando".
 */
function startAudio() {
  music.playing = true;
  return audio()
    .play()
    .then(() => true)
    .catch(() => {
      if (!element.paused) return false;
      music.playing = false;
      notify();
      return false;
    });
}

/* true, solange die Musik nur wegen eines Videos pausiert (siehe holdForVideo) */
let heldForVideo = false;

export function play() {
  heldForVideo = false;
  save('ss_music', 1);
  return startAudio();
}

export function pause() {
  audio().pause();
  music.playing = false;
  save('ss_music', 0);
}

export function setTrack(index) {
  music.index = (index + TRACKS.length) % TRACKS.length;
  music.elapsed = 0;
  resumeAt = 0;
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
  writeJson(session(), VOLUME_KEY, percent);
  setMuted(false);
}

/**
 * Musik anhalten, solange ein Video mit Ton läuft. Danach geht sie nur weiter, wenn sie vorher lief.
 * Anders als pause() wird dabei nichts gespeichert: Der Besucher hat die Musik ja nicht ausgeschaltet.
 */
export function holdForVideo(on) {
  if (on && music.playing) {
    heldForVideo = true;
    music.playing = false;
    audio().pause();
    notify();
  } else if (!on && heldForVideo) {
    heldForVideo = false;
    startAudio();
    notify();
  }
}
