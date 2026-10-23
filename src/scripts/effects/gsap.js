/* GSAP einmal zentral mit ScrollTrigger registrieren. Alle Effekte importieren von hier. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Führt `setup` in einem GSAP-Kontext aus und räumt alle Animationen
 * und ScrollTrigger beim Seitenwechsel wieder ab.
 */
export function withGsap(signal, setup, scope) {
  const context = gsap.context(setup, scope);
  signal.addEventListener('abort', () => context.revert());
  return context;
}
