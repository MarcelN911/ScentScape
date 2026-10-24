/*
 * Galerie der Produktseite: Bild wählen über Vorschaubilder oder Pfeile.
 * Ist das gewählte Bild das Notenrad, erscheinen die Noten im Kreis.
 */
function show(stage, index) {
  const images = [...stage.querySelectorAll('[data-stage-img]')];
  const active = (index + images.length) % images.length;
  images.forEach((image, i) => image.classList.toggle('is-active', i === active));
  stage
    .querySelectorAll('[data-stage-thumb]')
    .forEach((thumb, i) => thumb.classList.toggle('is-active', i === active));
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

export function initStage(signal) {
  const stage = document.querySelector('[data-stage]');
  if (!stage) return;
  stage.addEventListener('click', (event) => handleClick(stage, event), { signal });
  show(stage, 0);
}
