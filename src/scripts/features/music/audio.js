/*
 * Zustand des Players. Der Player bleibt beim Seitenwechsel stehen, deshalb läuft die Musik weiter.
 * Gespeichert: ob Musik gewünscht ist (ss_music), stumm, Lautstärke und Titel.
 */
import { TRACK_LENGTH, TRACKS } from '../../../data/tracks.js';
import { ensureAudio, playBar, resumeAudio, setMasterGain } from './synth.js';

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

export const music = {
  playing: false,
  muted: read('ss_music_muted', '0') === '1',
  volume: Number(read('ss_music_vol', 60)),
  index: Number(read('ss_music_track', 0)) % TRACKS.length,
  elapsed: 0,
  bar: 0,
  timer: 0,
};

export const wantsMusic = () => read('ss_music', '1') !== '0';
export const currentTrack = () => TRACKS[music.index];
const gain = () => (music.muted ? 0 : (music.volume / 100) * 0.9);

function startLoop() {
  clearInterval(music.timer);
  playBar(currentTrack(), music.bar++);
  music.timer = setInterval(() => playBar(currentTrack(), music.bar++), currentTrack().bar * 1000);
}

export function play() {
  if (!ensureAudio(gain())) return;
  resumeAudio(true);
  music.playing = true;
  save('ss_music', 1);
  startLoop();
}

export function pause() {
  clearInterval(music.timer);
  resumeAudio(false);
  music.playing = false;
  save('ss_music', 0);
}

export function setTrack(index) {
  music.index = (index + TRACKS.length) % TRACKS.length;
  Object.assign(music, { elapsed: 0, bar: 0 });
  save('ss_music_track', music.index);
  if (music.playing) startLoop();
}

export function setMuted(muted) {
  music.muted = muted;
  save('ss_music_muted', muted ? 1 : 0);
  setMasterGain(gain());
}

export function setVolume(percent) {
  music.volume = percent;
  save('ss_music_vol', percent);
  setMuted(false);
}

/** Zählt jede Sekunde weiter. Gibt true zurück, wenn der nächste Titel begonnen hat. */
export function tick() {
  if (!music.playing) return false;
  music.elapsed += 1;
  if (music.elapsed < TRACK_LENGTH) return false;
  setTrack(music.index + 1);
  return true;
}
