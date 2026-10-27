/*
 * Hero-Video passend zum Format: Handys im Hochformat bekommen das Hochformat-Video (HomeHero.astro).
 * Der Browser wählt die <source> nur einmal beim Laden. Dreht man das Handy, zieht das Fenster
 * schmal oder schaltet in den Entwicklertools auf Handy-Ansicht, tauscht dieses Skript das Video aus.
 * Es hilft auch Browsern, die media an <source> eines Videos nicht kennen.
 */
function sourcesOf(video) {
  const tall = video?.querySelector('source[media]');
  const wide = video?.querySelector('source:not([media])');
  return tall && wide ? { tall, wide } : null;
}

export function watchHeroVideo(signal) {
  const video = document.querySelector('[data-hero-video]');
  const sources = sourcesOf(video);
  if (!sources) return;
  const query = matchMedia(sources.tall.media);
  const update = () => {
    const wanted = query.matches ? sources.tall.src : sources.wide.src;
    if (video.currentSrc === wanted) return;
    video.src = wanted;
    video.play().catch(() => {});
  };
  query.addEventListener('change', update, { signal });
  update();
}
