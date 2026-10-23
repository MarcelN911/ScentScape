const SHOP_PATHS = ['/productos', '/producto/'];
const DISCOVER_PATHS = ['/original', '/gift-card', '/catalogo', '/nosotros'];

function sectionOf(path) {
  if (path === '/') return 'home';
  if (SHOP_PATHS.some((prefix) => path.startsWith(prefix))) return 'shop';
  return DISCOVER_PATHS.some((prefix) => path.startsWith(prefix)) ? 'discover' : null;
}

/** Hebt in der Navigation den Bereich hervor, in dem man sich gerade befindet. */
export function markActiveLinks() {
  const section = sectionOf(location.pathname);
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    link.classList.toggle('is-active', link.dataset.navLink === section);
  });
  document
    .querySelector('[data-mega-toggle]')
    ?.classList.toggle('is-active', section === 'discover');
}

function setOpen(root, open) {
  root.toggleAttribute('data-mega-open', open);
  root.querySelector('[data-mega-toggle]').setAttribute('aria-expanded', String(open));
}

function showPreview(root, key) {
  root.querySelectorAll('[data-mega-preview]').forEach((preview) => {
    preview.classList.toggle('is-active', preview.dataset.megaPreview === key);
  });
  root.querySelectorAll('[data-mega-item]').forEach((item) => {
    item.classList.toggle('is-active', item.dataset.megaItem === key);
  });
}

function bindPreviews(root) {
  root.querySelectorAll('[data-mega-item]').forEach((item) => {
    const activate = () => showPreview(root, item.dataset.megaItem);
    item.addEventListener('mouseenter', activate);
    item.addEventListener('focus', activate);
    item.addEventListener('click', () => setOpen(root, false));
  });
}

function bindOpenClose(root) {
  const toggle = root.querySelector('[data-mega-toggle]');
  toggle.addEventListener('click', () => setOpen(root, !root.hasAttribute('data-mega-open')));
  toggle.addEventListener('mouseenter', () => setOpen(root, true));
  root.addEventListener('mouseleave', () => setOpen(root, false));
  document.addEventListener('keydown', (event) => event.key === 'Escape' && setOpen(root, false));
  document.addEventListener('astro:before-preparation', () => setOpen(root, false));
}

export function initMegaMenu() {
  const root = document.querySelector('[data-mega]');
  if (!root) return;
  showPreview(root, root.querySelector('[data-mega-item]').dataset.megaItem);
  bindPreviews(root);
  bindOpenClose(root);
}
