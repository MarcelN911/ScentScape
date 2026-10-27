/*
 * Playlist "ScentScape Sessions": Musikdateien aus public/assets/music/.
 * title und mood erscheinen im Player, src ist der Pfad zur Datei.
 * Neuen Titel hinzufügen: MP3 in den Ordner legen und hier eine Zeile ergänzen.
 * Der erste Titel startet bei jedem Besuch der Seite.
 */
const MUSIC = '/assets/music';

export const TRACKS = [
  {
    title: 'Ritmo de Ámbar',
    mood: 'Afro beat · instrumental',
    src: `${MUSIC}/rediskasound-afro-beat-instrumental-music-554537.mp3`,
  },
  {
    title: 'Lounge de Medianoche',
    mood: 'Lounge · cálido',
    src: `${MUSIC}/atlasaudio-lounge-621603.mp3`,
  },
  {
    title: 'Jazz de Terciopelo',
    mood: 'Jazz · suave',
    src: `${MUSIC}/atlasaudio-jazz-music-617577.mp3`,
  },
  {
    title: 'Café de París',
    mood: 'Francés · romántico',
    src: `${MUSIC}/vjgalaxy-french-music-02-481005.mp3`,
  },
];
