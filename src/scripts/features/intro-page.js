/* Seiten ohne eigene Bedienung (Nosotros, Contacto, Legal, 404): nur die Einblendung starten. */
export function initIntroPage() {
  const root = document.querySelector('[data-intro-page]');
  if (root) setTimeout(() => root.classList.add('is-in'), 80);
}
