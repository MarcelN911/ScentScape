/*
 * Aktionsleiste über dem Header (PromoBar.astro). Sie erscheint, sobald man etwas scrollt,
 * dann rutscht der Header darunter (Klasse has-promo an <html>).
 * Die hervorgehobene Aktion öffnet das Formular (modal.js), weitere Codes löst ein Tippen direkt ein.
 */
import { applyCode } from '../cart/discount.js';
import { FREE_SHIPPING_THRESHOLD } from '../config.js';
import { showToast } from '../core/events.js';
import { initMarquee } from '../effects/marquee.js';
import { formatCOP } from '../utils/format.js';
import { loadPromo, registrationFor } from './data.js';
import { openPromo } from './modal.js';
import { valueOf } from './offer.js';

const SHOW_FROM = 30;
/* Hinweise, die immer in der Leiste stehen, zusätzlich zu den Aktionen aus nexomar */
const FIXED_LINES = [
  { texto: `Envío gratis desde ${formatCOP(FREE_SHIPPING_THRESHOLD)} COP` },
  { texto: 'Envíos a toda Colombia' },
];

function itemFor(template, entry, offer) {
  const item = template.content.firstElementChild.cloneNode(true);
  item.querySelector('[data-promo-text]').textContent = entry.texto;
  const action = item.querySelector('[data-promo-action]');
  action.hidden = !entry.codigo;
  action.dataset.code = entry.codigo ?? '';
  action.textContent = entry.codigo === offer?.codigo ? 'Desbloquear →' : `Usar ${entry.codigo} →`;
  return item;
}

/* Zwei gleiche Hälften: das Laufband schiebt um eine Hälfte und beginnt dann unbemerkt von vorn */
function fill(bar, lines, offer) {
  const template = bar.querySelector('[data-promo-item]');
  const twice = [...lines, ...lines];
  bar.querySelectorAll('[data-promo-half]').forEach((half, index) => {
    half.replaceChildren(...twice.map((entry) => itemFor(template, entry, offer)));
    if (index > 0) half.querySelectorAll('button').forEach((button) => (button.tabIndex = -1));
  });
}

/* Die hervorgehobene Aktion steht immer in der Leiste, auch wenn sie in nexomar nicht dafür eingetragen ist */
function linesOf({ offer, bar }) {
  const listed = !offer || bar.some((entry) => entry.codigo === offer.codigo);
  const featured = listed
    ? []
    : [{ texto: `${valueOf(offer).value} de descuento`, codigo: offer.codigo }];
  return [...featured, ...bar, ...FIXED_LINES];
}

/* Stand vom Build, in die Seite geschrieben von PromoBar.astro */
function buildPromo(bar) {
  try {
    return JSON.parse(bar.querySelector('[data-promo-data]').textContent);
  } catch {
    return undefined;
  }
}

async function useCode(code) {
  const error = await applyCode(code);
  if (error) showToast(error);
  else showToast(`Código ${code} aplicado`, { cart: true });
}

/* Hervorgehobene Aktion: Formular, außer man hat sich dafür schon eingetragen */
function handleClick(event, offer) {
  const code = event.target.closest('[data-promo-action]')?.dataset.code;
  if (!code) return;
  const saved = offer && code === offer.codigo ? registrationFor(offer) : null;
  if (saved) return useCode(saved.code);
  if (code === offer?.codigo) return openPromo(offer);
  useCode(code);
}

function watchScroll() {
  const update = () => document.documentElement.classList.toggle('has-promo', scrollY > SHOW_FROM);
  addEventListener('scroll', update, { passive: true });
  document.addEventListener('astro:after-swap', update);
  update();
}

export async function initPromoBar() {
  const bar = document.querySelector('[data-promo-bar]');
  if (!bar) return;
  const promo = await loadPromo(buildPromo(bar));
  fill(bar, linesOf(promo), promo.offer);
  initMarquee(bar, new AbortController().signal);
  bar.addEventListener('click', (event) => handleClick(event, promo.offer));
  watchScroll();
}
