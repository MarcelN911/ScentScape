/* Akkordeon: <div data-accordion> mit Einträgen [data-accordion-item]. Es ist immer nur einer offen. */
function setOpen(item, open) {
  item.classList.toggle('is-open', open);
  item.querySelector('[data-accordion-toggle]').setAttribute('aria-expanded', String(open));
}

function toggle(group, item) {
  const willOpen = !item.classList.contains('is-open');
  group.querySelectorAll('[data-accordion-item]').forEach((other) => setOpen(other, false));
  setOpen(item, willOpen);
}

export function initAccordions(signal) {
  document.querySelectorAll('[data-accordion]').forEach((group) => {
    group.querySelectorAll('[data-accordion-item]').forEach((item) => {
      const button = item.querySelector('[data-accordion-toggle]');
      button.addEventListener('click', () => toggle(group, item), { signal });
    });
  });
}
