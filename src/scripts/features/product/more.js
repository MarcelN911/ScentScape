/* Handy: "Leer más" unter der Beschreibung zeigt den ganzen Text, "Leer menos" kürzt ihn wieder. */
export function initReadMore(signal) {
  const button = document.querySelector('[data-more-toggle]');
  const text = document.querySelector('[data-more-text]');
  if (!button || !text) return;
  const toggle = () => {
    const open = text.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(open));
    button.textContent = open ? 'Leer menos' : 'Leer más';
  };
  button.addEventListener('click', toggle, { signal });
}
