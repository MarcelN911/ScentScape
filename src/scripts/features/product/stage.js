/*
 * Galerie der Produktseite: Bild wählen über Vorschaubilder, Punkte (Handy) oder Pfeile.
 * Auf Touch-Geräten lässt sich das Bild auch zur Seite wischen.
 * Ist das gewählte Bild das Notenrad, erscheinen die Noten im Kreis.
 */
const SWIPE = 40; // so viele Pixel zur Seite = nächstes Bild
function show(stage, index) {
  const images = [...stage.querySelectorAll('[data-stage-img]')];
  const active = (index + images.length) % images.length;
  images.forEach((image, i) => image.classList.toggle('is-active', i === active));
  // Vorschaubilder und Punkte tragen beide data-stage-thumb: über die Nummer zuordnen
  stage
    .querySelectorAll('[data-stage-thumb]')
    .forEach((thumb) =>
      thumb.classList.toggle('is-active', Number(thumb.dataset.stageThumb) === active),
    );
  const box = stage.querySelector('[data-stage-box]');
  box.classList.toggle('is-wheel', Number(box.dataset.wheelSlide) === active);
  stage.dataset.current = active;
}

function handleClick(stage, event) {
  const thumb = event.target.closest('[data-stage-thumb]');
  const step = event.target.closest('[data-stage-step]');
  const current = Number(stage.dataset.current ?? 0);
  if (thumb) show(stage, Number(thumb.dataset.stageThumb));
  if (step) show(stage, current + Number(step.dataset.stageStep));
}

/* Wischen nach links = nächstes Bild, nach rechts = vorheriges (nur Finger, nicht Maus) */
function bindSwipe(stage, signal) {
  const box = stage.querySelector('[data-stage-box]');
  let startX = null;
  const down = (event) => (startX = event.pointerType === 'touch' ? event.clientX : null);
  const up = (event) => {
    if (startX === null) return;
    const dx = event.clientX - startX;
    startX = null;
    if (Math.abs(dx) > SWIPE) show(stage, Number(stage.dataset.current ?? 0) + (dx < 0 ? 1 : -1));
  };
  box.addEventListener('pointerdown', down, { signal });
  box.addEventListener('pointerup', up, { signal });
}

export function initStage(signal) {
  const stage = document.querySelector('[data-stage]');
  if (!stage) return;
  stage.addEventListener('click', (event) => handleClick(stage, event), { signal });
  if (stage.querySelectorAll('[data-stage-img]').length > 1) bindSwipe(stage, signal);
  show(stage, 0);
}
