/*
 * Ein einziges <audio>-Element für die ganze Seite.
 * Weil der Player beim Seitenwechsel stehen bleibt, läuft die Musik weiter.
 */
import { TRACKS } from '../../../data/tracks.js';

const audio = new Audio();
audio.preload = 'none';
audio.volume = 0.6;

export const music = { audio, index: 0, playing: false, muted: false };

export function loadTrack(index) {
  music.index = (index + TRACKS.length) % TRACKS.length;
  audio.src = TRACKS[music.index].src;
}

export async function play() {
  if (!audio.src) loadTrack(music.index);
  await audio.play();
  music.playing = true;
}

export function pause() {
  audio.pause();
  music.playing = false;
}

export function setMuted(muted) {
  music.muted = muted;
  audio.muted = muted;
}

export function setVolume(percent) {
  audio.volume = percent / 100;
  setMuted(false);
}

export function currentTrack() {
  return TRACKS[music.index];
}
