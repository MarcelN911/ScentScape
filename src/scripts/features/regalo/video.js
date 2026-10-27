/*
 * Video-Modus für Aufnahmen der Öffnen-Animation: /regalo/?video
 * Mauszeiger unsichtbar, Musik-Player und "Wiederholen" ausgeblendet (CSS in regalo.astro),
 * der Umschlag öffnet sich nach kurzer Zeit von selbst. Für eine neue Aufnahme: Seite neu laden.
 */
const START_MS = 3500; // Vorhang beim Laden (~1,5 s) + 2 s geschlossener Umschlag

export function startVideoMode(regalo, open, signal) {
  if (!new URLSearchParams(window.location.search).has('video')) return;
  document.documentElement.classList.add('is-video');
  const timer = setTimeout(() => open(regalo), START_MS);
  signal.addEventListener('abort', () => {
    clearTimeout(timer);
    document.documentElement.classList.remove('is-video');
  });
}
