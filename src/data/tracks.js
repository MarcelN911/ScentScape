/*
 * Playlist "ScentScape Sessions". Die Musik wird im Browser erzeugt (Web Audio), es gibt keine Dateien.
 * bar: Sekunden pro Akkord · wave: Klangfarbe · cut: Filter-Höhe · chords: MIDI-Noten je Takt
 */
export const TRACK_LENGTH = 150;

export const TRACKS = [
  {
    title: 'Orquesta de Medianoche',
    mood: 'Orquestal · lounge',
    bar: 5.2,
    wave: 'triangle',
    cut: 1500,
    chords: [
      [57, 64, 69, 72],
      [53, 60, 65, 69],
      [50, 57, 62, 65],
      [52, 59, 64, 68],
    ],
  },
  {
    title: 'Formato Nocturno',
    mood: 'Minimal · hipnótico',
    bar: 4.0,
    wave: 'sawtooth',
    cut: 900,
    chords: [
      [45, 52, 57, 60],
      [45, 52, 57, 62],
      [43, 50, 55, 58],
      [45, 52, 57, 60],
    ],
  },
  {
    title: 'Olas de Ámbar',
    mood: 'Electrónica · ambient',
    bar: 6.0,
    wave: 'sine',
    cut: 2200,
    chords: [
      [60, 67, 72, 76],
      [57, 64, 69, 72],
      [53, 60, 65, 69],
      [55, 62, 67, 74],
    ],
  },
  {
    title: 'Terciopelo',
    mood: 'Soul · cálido',
    bar: 5.0,
    wave: 'triangle',
    cut: 1800,
    chords: [
      [52, 59, 62, 67],
      [48, 55, 59, 64],
      [50, 57, 60, 65],
      [47, 54, 57, 62],
    ],
  },
];
