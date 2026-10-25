/* Lädt die Fotos der Auswahl vor, damit das PDF sofort vollständig ist. Meldet den echten Fortschritt. */

function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = resolve;
    image.src = src;
  });
}

/** onProgress(0…1) nach jedem fertigen Bild; aborted() bricht still ab */
export async function preloadImages(sources, onProgress, aborted) {
  const unique = [...new Set(sources)];
  let done = 0;
  await Promise.all(
    unique.map((src) =>
      loadImage(src).then(() => {
        done += 1;
        if (!aborted()) onProgress(done / unique.length);
      }),
    ),
  );
}
