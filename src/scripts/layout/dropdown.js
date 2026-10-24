/* Dropdown "Servicios": öffnet bei Hover und Fokus, schließt mit kurzer Verzögerung und mit Escape. */
const CLOSE_DELAY = 160;

function setOpen(dropdown, open) {
  dropdown.classList.toggle('is-open', open);
}

function bindHover(dropdown) {
  let timer = 0;
  dropdown.addEventListener('mouseenter', () => {
    clearTimeout(timer);
    setOpen(dropdown, true);
  });
  dropdown.addEventListener('mouseleave', () => {
    timer = setTimeout(() => setOpen(dropdown, false), CLOSE_DELAY);
  });
}

function bindFocus(dropdown) {
  dropdown.addEventListener('focusin', () => setOpen(dropdown, true));
  dropdown.addEventListener('focusout', (event) => {
    if (!dropdown.contains(event.relatedTarget)) setOpen(dropdown, false);
  });
  dropdown.addEventListener(
    'keydown',
    (event) => event.key === 'Escape' && setOpen(dropdown, false),
  );
}

export function initDropdown() {
  const dropdown = document.querySelector('[data-dropdown]');
  if (!dropdown) return;
  bindHover(dropdown);
  bindFocus(dropdown);
  document.addEventListener('astro:before-preparation', () => setOpen(dropdown, false));
}
