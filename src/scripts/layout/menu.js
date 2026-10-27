/*
 * Menü (MobileMenu.astro): öffnet mit einer runden Blende, die vom Burger-Knopf aus wächst.
 * --cx/--cy = Mitte des Burgers, --r = Radius, der den ganzen Bildschirm abdeckt.
 * Die Seite, auf der man ist, wird im Menü markiert.
 */
import { registerAction } from '../core/actions.js';

function originFromBurger(menu) {
  const burger = document.querySelector('.site-header__burger');
  const box = burger?.getBoundingClientRect();
  const x = box ? box.left + box.width / 2 : innerWidth - 40;
  const y = box ? box.top + box.height / 2 : 40;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  menu.style.setProperty('--cx', `${x}px`);
  menu.style.setProperty('--cy', `${y}px`);
  menu.style.setProperty('--r', `${Math.ceil(radius)}px`);
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
  document.documentElement.classList.toggle('is-locked', open);
  document.documentElement.classList.toggle('is-menu-open', open);
}

export function initMenu() {
  const menu = document.querySelector('[data-menu]');
  if (!menu) return;
  menu.addEventListener('click', (event) => event.target.closest('a') && setOpen(menu, false));
  document.addEventListener('keydown', (event) => event.key === 'Escape' && setOpen(menu, false));
  registerAction('open-menu', () => setOpen(menu, true));
  registerAction('close-menu', () => setOpen(menu, false));
  document.addEventListener('astro:before-preparation', () => setOpen(menu, false));
}
