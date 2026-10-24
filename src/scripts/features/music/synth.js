/*
 * Klangerzeugung: weiche Akkordflächen plus einzelne Glockentöne mit Echo.
 * Alles läuft über einen Master-Regler, damit Lautstärke und Stummschalten weich überblenden.
 */
const audio = { context: null, master: null, delay: null };

const midiToHz = (note) => 440 * Math.pow(2, (note - 69) / 12);

function createEcho(context, master) {
  const delay = context.createDelay();
  const feedback = context.createGain();
  const filter = context.createBiquadFilter();
  const wet = context.createGain();
  delay.delayTime.value = 0.42;
  feedback.gain.value = 0.38;
  filter.type = 'lowpass';
  filter.frequency.value = 2400;
  wet.gain.value = 0.45;
  delay.connect(filter).connect(feedback).connect(delay);
  filter.connect(wet).connect(master);
  return delay;
}

/** Baut den Audio-Graphen beim ersten Abspielen. Gibt false zurück, wenn der Browser kein Web Audio kann. */
export function ensureAudio(gain) {
  if (audio.context) return true;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return false;
  audio.context = new AudioContext();
  audio.master = audio.context.createGain();
  audio.master.gain.value = gain;
  const compressor = audio.context.createDynamicsCompressor();
  audio.master.connect(compressor).connect(audio.context.destination);
  audio.delay = createEcho(audio.context, audio.master);
  return true;
}

export function setMasterGain(gain) {
  if (audio.master) audio.master.gain.setTargetAtTime(gain, audio.context.currentTime, 0.15);
}

export function resumeAudio(running) {
  const result = running ? audio.context?.resume() : audio.context?.suspend();
  result?.catch(() => {});
}

function padSource(track, note, detune) {
  const oscillator = Object.assign(audio.context.createOscillator(), { type: track.wave });
  oscillator.frequency.value = midiToHz(note);
  oscillator.detune.value = detune;
  return oscillator;
}

function padFilter(track, start) {
  const filter = Object.assign(audio.context.createBiquadFilter(), { type: 'lowpass' });
  filter.frequency.setValueAtTime(300, start);
  filter.frequency.linearRampToValueAtTime(track.cut, start + track.bar * 0.5);
  filter.frequency.linearRampToValueAtTime(350, start + track.bar * 1.3);
  return filter;
}

function padEnvelope(track, start) {
  const gain = audio.context.createGain();
  const peak = track.wave === 'sawtooth' ? 0.022 : 0.045;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(peak, start + track.bar * 0.4);
  gain.gain.linearRampToValueAtTime(0, start + track.bar * 1.3);
  return gain;
}

function padVoice(track, note, detune, start) {
  const oscillator = padSource(track, note, detune);
  oscillator
    .connect(padFilter(track, start))
    .connect(padEnvelope(track, start))
    .connect(audio.master);
  oscillator.start(start);
  oscillator.stop(start + track.bar * 1.35);
}

function bell(note, start) {
  const { context } = audio;
  const oscillator = Object.assign(context.createOscillator(), { type: 'sine' });
  oscillator.frequency.value = midiToHz(note);
  const gain = context.createGain();
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(0.05, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.4);
  oscillator.connect(gain);
  gain.connect(audio.master);
  gain.connect(audio.delay);
  oscillator.start(start);
  oscillator.stop(start + 1.5);
}

function randomBellNote(chord) {
  const octave = Math.random() < 0.3 ? 24 : 12;
  return chord[Math.floor(Math.random() * chord.length)] + octave;
}

/** Spielt einen Takt: Akkord als Fläche, dazu bis zu acht zufällige Glockentöne. */
export function playBar(track, barIndex) {
  if (!audio.context) return;
  const start = audio.context.currentTime + 0.05;
  const chord = track.chords[barIndex % track.chords.length];
  chord.forEach((note, i) =>
    [-7, 7].forEach((detune) => padVoice(track, i ? note : note - 12, detune, start)),
  );
  for (let step = 0; step < 8; step += 1) {
    if (Math.random() >= 0.4) bell(randomBellNote(chord), start + (step * track.bar) / 8);
  }
}
