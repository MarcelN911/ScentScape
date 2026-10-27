/*
 * Fenster zur Aktion als Gutschein-Ticket (PromoModal.astro): Wert, Bedingungen und ein kurzes
 * Formular (Name, WhatsApp). Der Kontakt geht an nexomar, danach erscheint der Code auf dem Ticket
 * und wird gleich in der Bolsa eingelöst. Wir liefern nur innerhalb Kolumbiens, daher immer +57.
 */
import { applyCode } from '../cart/discount.js';
import { imageUrl } from '../utils/image.js';
import { lockScroll } from '../utils/scroll-lock.js';
import { register } from './data.js';
import { conditionsOf, valueOf } from './offer.js';

let dialog;
let current;

function part(name) {
  return dialog.querySelector(`[data-promo-${name}]`);
}

const INTRO = 'Déjanos tu nombre y WhatsApp: te damos tu código y lo aplicamos a tu bolsa.';

function fillOffer(offer) {
  const { value, label } = valueOf(offer);
  part('value').textContent = value;
  part('label').textContent = label;
  part('conditions').textContent = conditionsOf(offer).join(' · ') || 'Válido en toda la tienda';
  part('text').textContent = offer.descripcion || INTRO;
  part('image').hidden = !offer.imagen;
  if (offer.imagen) part('image').src = imageUrl(offer.imagen, 300);
}

function showDoneView(done) {
  part('form-view').hidden = done;
  part('done-view').hidden = !done;
  part('code-row').hidden = !done;
}

export function openPromo(offer) {
  if (!dialog) return;
  current = offer;
  fillOffer(offer);
  showDoneView(false);
  part('error').textContent = '';
  dialog.showModal();
  lockScroll('promo', true);
}

/**
 * Kolumbianische Handynummer: 10 Ziffern, beginnt mit 3. Leerzeichen, Striche und ein
 * vorangestelltes 57 / +57 werden entfernt. Gibt die 10 Ziffern zurück oder null.
 */
function colombianMobile(input) {
  const digits = String(input)
    .replace(/\D/g, '')
    .replace(/^57(?=\d{10}$)/, '');
  return /^3\d{9}$/.test(digits) ? digits : null;
}

/** { name, phone } oder { error } */
function readForm(form) {
  const data = new FormData(form);
  const name = String(data.get('name')).trim();
  const number = colombianMobile(data.get('phone'));
  if (!name) return { error: 'Escribe tu nombre.' };
  if (!number) return { error: 'Escribe tu celular de 10 dígitos, por ejemplo 300 123 4567.' };
  return { name, phone: `+57${number}` };
}

/* Nach dem Eintragen: Code zeigen und gleich in der Bolsa einlösen */
async function showCode(saved) {
  part('greeting').textContent = `¡Listo, ${saved.nombre.split(' ')[0]}!`;
  part('code').textContent = saved.code;
  part('copy').textContent = 'Copiar';
  showDoneView(true);
  const error = await applyCode(saved.code);
  part('applied').textContent = error
    ? `${error}. Puedes ingresarlo en tu bolsa más tarde.`
    : 'Ya lo aplicamos en tu bolsa.';
}

function setBusy(busy) {
  const button = part('submit');
  button.disabled = busy;
  button.textContent = busy ? 'Un momento…' : 'Obtener mi código';
}

async function submit(event) {
  event.preventDefault();
  const input = readForm(event.target);
  part('error').textContent = input.error ?? '';
  if (input.error) return;
  setBusy(true);
  try {
    await showCode(await register(input.name, input.phone, current));
  } catch (error) {
    part('error').textContent =
      error instanceof TypeError ? 'Error de conexión. Intenta de nuevo.' : error.message;
  }
  setBusy(false);
}

/* Schließen: Knöpfe mit data-promo-close oder ein Klick neben das Fenster */
function handleClick(event) {
  if (event.target === dialog || event.target.closest('[data-promo-close]')) dialog.close();
  if (event.target.closest('[data-promo-copy]')) {
    navigator.clipboard?.writeText(part('code').textContent).catch(() => {});
    part('copy').textContent = '✓ Copiado';
  }
}

export function initPromoModal() {
  dialog = document.querySelector('[data-promo-modal]');
  if (!dialog) return;
  part('form').addEventListener('submit', submit);
  dialog.addEventListener('click', handleClick);
  /* "close" kommt bei jedem Schließen, auch per Escape */
  dialog.addEventListener('close', () => lockScroll('promo', false));
  /* Link im Fenster (z. B. Privacidad): beim Seitenwechsel schließen */
  document.addEventListener('astro:before-preparation', () => dialog.open && dialog.close());
}
