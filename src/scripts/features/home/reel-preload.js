/*
 * Videos im Karussell erst laden, wenn die Seite fertig ist.
 * Die Karten haben zuerst nur ihr Standbild (poster) und die Adresse in data-src.
 * Ist die Seite geladen und kommt der Bereich beim Scrollen näher (etwa zwei Bildschirme vorher),
 * bekommen die Videos ihre Adresse: das vordere und seine Nachbarn laden schon vor,
 * die anderen nur ihre Eckdaten. So bremsen die Videos den Seitenaufbau nicht,
 * und sie sind trotzdem bereit, wenn man beim Bereich ankommt.
 */

/* So weit vor dem Bereich fängt das Laden an (200% = zwei Bildschirmhöhen) */
const AHEAD = '200% 0px';
const START_AT = '#t=0.6';

/* Besucher mit Datensparmodus: nichts vorab herunterladen, nur beim Abspielen */
const saveData = () => Boolean(navigator.connection?.saveData);

/** Gibt einem Video seine Adresse, falls es noch keine hat. */
export function attachSource(video) {
  if (video.getAttribute('src') || !video.dataset.src) return;
  video.src = video.dataset.src + START_AT;
}

/** Lässt ein Video schon puffern, damit es beim Umschalten sofort läuft. */
export function warmUp(video) {
  if (!video || saveData()) return;
  attachSource(video);
  video.preload = 'auto';
}

/* Erstes Video und seine Nachbarn vorladen (im Kreis: das letzte ist Nachbar des ersten) */
function loadAll(videos) {
  const last = videos.length - 1;
  videos.forEach((video, index) => {
    if (!saveData()) video.preload = index <= 1 || index === last ? 'auto' : 'metadata';
    attachSource(video);
  });
}

function whenPageLoaded(callback, signal) {
  if (document.readyState === 'complete') return callback();
  addEventListener('load', callback, { once: true, signal });
  return undefined;
}

export function preloadReel(section, videos, signal) {
  whenPageLoaded(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        loadAll(videos);
      },
      { rootMargin: AHEAD },
    );
    observer.observe(section);
    signal.addEventListener('abort', () => observer.disconnect());
  }, signal);
}
