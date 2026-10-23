/**
 * Lässt Cloudinary das Bild in passender Breite und im besten Format liefern.
 * Andere URLs bleiben unverändert.
 */
export function imageUrl(url, width) {
  if (!url || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
}
