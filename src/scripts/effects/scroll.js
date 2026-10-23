/* Kleine Helfer für Effekte, die am Scroll-Fortschritt hängen. */
import { ScrollTrigger } from './gsap.js';

/** 0 → 1, am Anfang schnell, am Ende weich (wie in der Vorlage) */
export function easeOut(progress) {
  return 1 - (1 - progress) ** 3;
}

/**
 * Ruft `paint(progress)` auf, solange `trigger` durch den Bereich start → end scrollt.
 * Muss innerhalb von withGsap() laufen, damit der Trigger beim Seitenwechsel verschwindet.
 * Wichtig: `trigger` selbst nicht verschieben, sondern ein Kind-Element. Sonst verfälscht
 * die Bewegung die Messung, wann der Effekt beginnt.
 */
export function onScrollProgress(trigger, range, paint) {
  return ScrollTrigger.create({
    trigger,
    ...range,
    onUpdate: (self) => paint(self.progress),
    onRefresh: (self) => paint(self.progress),
  });
}

/** Abstand der Elementmitte zur Bildschirmmitte, in Bildschirmhöhen (−0,5 … 0,5 im Bild) */
export function centerOffset(element) {
  const box = element.getBoundingClientRect();
  return (box.top + box.height / 2 - innerHeight / 2) / innerHeight;
}

/** Fortschritt, während ein hoher Bereich mit fixiertem Inhalt durchscrollt wird */
export const PINNED_RANGE = { start: 'top top', end: 'bottom bottom' };

/** Fortschritt von "taucht unten auf" bis "verschwindet oben" */
export const VISIBLE_RANGE = { start: 'top bottom', end: 'bottom top' };
