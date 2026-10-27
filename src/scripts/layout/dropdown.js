/* Dropdown "Servicios": öffnet bei Hover, Fokus und Klick, schließt mit kurzer Verzögerung und mit Escape. */
const CLOSE_DELAY = 160;

function setOpen(dropdown, open) {
  dropdown.classList.toggle('is-open', open);
  dropdown.querySelector('.dropdown__toggle')?.setAttribute('aria-expanded', String(open));
}

/* Klick auf "Servicios" öffnet das Dropdown oder lässt es offen (z. B. auf dem Touchscreen ohne Hover) */
function bindClick(dropdown) {
  const toggle = dropdown.querySelector('.dropdown__toggle');
  toggle?.addEventListener('click', () => setOpen(dropdown, true));
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
  bindClick(dropdown);
  document.addEventListener('astro:before-preparation', () => setOpen(dropdown, false));
}
