/* FAQ: die Themen links schalten die Fragen rechts um. */
function showGroup(section, active) {
  section.querySelectorAll('[data-faq-tab]').forEach((tab) => {
    const isActive = Number(tab.dataset.faqTab) === active;
    tab.classList.toggle('is-active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });
  section.querySelectorAll('[data-faq-panel]').forEach((panel) => {
    panel.hidden = Number(panel.dataset.faqPanel) !== active;
  });
}

export function initFaq(signal) {
  const section = document.querySelector('[data-faq]');
  if (!section) return;
  section.querySelectorAll('[data-faq-tab]').forEach((tab) => {
    const index = Number(tab.dataset.faqTab);
    tab.addEventListener('click', () => showGroup(section, index), { signal });
  });
}
