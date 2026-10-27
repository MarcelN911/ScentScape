/*
 * Seitenleisten (components/ui/Drawer.astro) öffnen und schließen.
 * Escape und jeder Seitenwechsel schließen sie. Solange eine offen ist, scrollt die Seite nicht.
 */
import { registerAction } from '../core/actions.js';
import { lockScroll } from '../utils/scroll-lock.js';

/**
 * Verbindet die Leiste `name` mit den Aktionen open-{name} und close-{name}.
 * onOpen läuft bei jedem Öffnen. Gibt setOpen(true | false) zurück.
 */
export function initDrawer(name, onOpen) {
  const root = document.querySelector(`[data-drawer="${name}"]`);
  const setOpen = (open) => {
    if (!root || root.hasAttribute('data-open') === open) return;
    root.toggleAttribute('data-open', open);
    lockScroll(`drawer-${name}`, open);
    if (open) onOpen?.(root);
  };
  registerAction(`open-${name}`, () => setOpen(true));
  registerAction(`close-${name}`, () => setOpen(false));
  document.addEventListener('keydown', (event) => event.key === 'Escape' && setOpen(false));
  document.addEventListener('astro:before-preparation', () => setOpen(false));
  return setOpen;
}
