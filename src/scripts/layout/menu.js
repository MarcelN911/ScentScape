/*
 * Menü (MobileMenu.astro): öffnet mit einer runden Blende, die vom Burger-Knopf aus wächst.
 * --cx/--cy = Mitte des Burgers, --r = Radius, der den ganzen Bildschirm abdeckt.
 * Die Seite, auf der man ist, wird im Menü markiert.
 */
import { registerAction } from '../core/actions.js';
import { burgerCircle } from '../utils/burger-circle.js';
import { lockScroll } from '../utils/scroll-lock.js';

function originFromBurger(menu) {
  const { x, y, r } = burgerCircle();
  menu.style.setProperty('--cx', `${x}px`);
  menu.style.setProperty('--cy', `${y}px`);
  menu.style.setProperty('--r', `${r}px`);
}

/* Aktuelle Seite markieren: der längste passende Pfad gewinnt (/productos/ vor /) */
function markCurrent(menu) {
  const path = location.pathname;
  let best = null;
  menu.querySelectorAll('[data-menu-link]').forEach((link) => {
    const href = link.getAttribute('href');
    const fits = href === '/' ? path === '/' : path.startsWith(href);
    if (fits && (!best || href.length > best.getAttribute('href').length)) best = link;
  });
  menu.querySelectorAll('[data-menu-link]').forEach((link) => {
    link.classList.toggle('is-current', link === best);
  });
}

function setOpen(menu, open) {
  if (open) {
    originFromBurger(menu);
    markCurrent(menu);
  }
  menu.classList.toggle('is-open', open);
  menu.setAttribute('aria-hidden', String(!open));
  menu.querySelectorAll('a, button').forEach((element) => (element.tabIndex = open ? 0 : -1));
  lockScroll('menu', open);
  document.documentElement.classList.toggle('is-menu-open', open);
}

export function initMenu() {
  const menu = document.querySelector('[data-menu]');
  if (!menu) return;
  /* Links und der Favoriten-Knopf schließen das Menü */
  const closesMenu = 'a, [data-action="open-wishlist"]';
  menu.addEventListener(
    'click',
    (event) => event.target.closest(closesMenu) && setOpen(menu, false),
  );
  document.addEventListener('keydown', (event) => event.key === 'Escape' && setOpen(menu, false));
  registerAction('open-menu', () => setOpen(menu, true));
  registerAction('close-menu', () => setOpen(menu, false));
  document.addEventListener('astro:before-preparation', () => setOpen(menu, false));
}
