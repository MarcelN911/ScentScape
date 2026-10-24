/*
 * Header: Glas-Hintergrund ab 40px Scroll, beim Runterscrollen ausblenden, beim Hochscrollen zeigen.
 * Dazu die Markierung des aktiven Menüpunkts.
 */
import { SERVICE_PATHS } from '../../data/navigation.js';

const SOLID_FROM = 40;
const HIDE_FROM = 320;
const state = { lastY: 0, hidden: false, frame: 0 };

function nextHidden(header, y) {
  const dropdownOpen = header.querySelector('.is-open');
  if (y < state.lastY - 2 || y < HIDE_FROM) return false;
  if (!dropdownOpen && y > state.lastY + 2) return true;
  return state.hidden;
}

function update(header) {
  state.frame = 0;
  const y = scrollY;
  state.hidden = nextHidden(header, y);
  header.classList.toggle('is-solid', y > SOLID_FROM);
  header.classList.toggle('is-hidden', state.hidden);
  state.lastY = y;
}

export function initHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const request = () => (state.frame ||= requestAnimationFrame(() => update(header)));
  addEventListener('scroll', request, { passive: true });
  document.addEventListener('astro:page-load', request);
  update(header);
}

function sectionOf(path) {
  if (path === '/') return 'home';
  if (path.startsWith('/producto')) return 'shop';
  if (SERVICE_PATHS.includes(path)) return 'services';
  if (path.startsWith('/nosotros')) return 'about';
  return path.startsWith('/contacto') ? 'contact' : null;
}

/** Hebt den Menüpunkt hervor, in dessen Bereich man sich gerade befindet. */
export function markActiveLinks() {
  const section = sectionOf(location.pathname);
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    const active = link.dataset.navLink === section;
    link.classList.toggle('is-active', active);
    link.toggleAttribute('aria-current', active);
  });
}
