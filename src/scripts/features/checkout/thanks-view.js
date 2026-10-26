/* Zeichnet die Seite "Gracias" für einen Stand aus THANKS_STATES. */
import { THANKS_STATES } from '../../../data/checkout.js';
import { formatCOP } from '../../utils/format.js';
import { shareUrl, whatsappUrl } from '../../utils/whatsapp.js';
import { regaloPath } from '../regalo/link.js';

const SUCCESS = ['whatsapp', 'pagado'];

function chatMessage(number) {
  return number
    ? `Hola ScentScape, tengo una pregunta sobre mi pedido #${number}.`
    : 'Hola ScentScape, tengo una pregunta sobre mi pedido.';
}

function giftTitle(card) {
  const amount = `Gift card ${formatCOP(card.monto)}`;
  return card.para ? `${amount} para ${card.para}` : amount;
}

function giftLine(template, card) {
  const line = template.content.firstElementChild.cloneNode(true);
  const link = new URL(regaloPath(card), window.location.origin).href;
  line.querySelector('[data-gift-title]').textContent = giftTitle(card);
  line.querySelector('[data-gift-code]').textContent = card.codigo;
  line.querySelector('[data-gift-view]').href = regaloPath(card);
  line.querySelector('[data-gift-share]').href = shareUrl(
    `Tienes un regalo de ScentScape 🎁 ${link}`,
  );
  return line;
}

function renderGifts(root, cards = []) {
  root.querySelector('[data-thanks-gifts]').hidden = cards.length === 0;
  const template = root.querySelector('[data-thanks-gift]');
  const list = root.querySelector('[data-thanks-gift-list]');
  list.replaceChildren(...cards.map((card) => giftLine(template, card)));
}

function renderActions(root, state, info) {
  const hrefs = { whatsapp: info.whatsapp, chat: whatsappUrl(chatMessage(info.number)) };
  root.querySelectorAll('[data-thanks-action]').forEach((action) => {
    const name = action.dataset.thanksAction;
    action.hidden = !state.actions.includes(name) || (name === 'whatsapp' && !info.whatsapp);
    if (hrefs[name])
      Object.assign(action, { href: hrefs[name], target: '_blank', rel: 'noopener' });
  });
}

function renderSeal(root, name) {
  root.querySelectorAll('[data-thanks-seal]').forEach((seal) => {
    seal.hidden = seal.dataset.thanksSeal !== THANKS_STATES[name].seal;
  });
  root.classList.toggle('is-checking', name === 'checking' || name === 'en_proceso');
  root.classList.toggle('is-done', SUCCESS.includes(name));
}

/** info = { number, total, whatsapp, giftCards } */
export function renderThanks(root, name, info) {
  const state = THANKS_STATES[name];
  const total = info.total ? ` · ${formatCOP(info.total)} COP` : '';
  root.querySelector('[data-thanks-number]').textContent = info.number
    ? `Pedido #${info.number}${total}`
    : '';
  root.querySelector('[data-thanks-title]').textContent = state.title;
  root.querySelector('[data-thanks-lead]').textContent = state.lead;
  renderSeal(root, name);
  renderActions(root, state, info);
  renderGifts(root, info.giftCards);
}

export function showThanksError(root, message) {
  root.querySelector('[data-thanks-error]').textContent = message ?? '';
}
