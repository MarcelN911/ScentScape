/* Duftpyramide: Klick auf eine Stufe hebt sie hervor. */
function activate(tiers, active) {
  tiers.forEach((tier) => {
    tier.classList.toggle('is-active', tier === active);
    tier.setAttribute('aria-pressed', String(tier === active));
  });
}

export function initPyramid(signal) {
  const tiers = [...document.querySelectorAll('[data-pyramid-tier]')];
  tiers.forEach((tier) => {
    tier.addEventListener('click', () => activate(tiers, tier), { signal });
  });
}
