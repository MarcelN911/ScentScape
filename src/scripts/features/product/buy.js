/* Kaufbereich: Größe wählen (Preis rollt), Menge ändern, WhatsApp-Text passend halten. */
import { whatsappUrl } from '../../utils/whatsapp.js';

function selectedIndex(buy) {
  return Number(buy.querySelector('[aria-checked="true"]').dataset.buyOption);
}

function rollPrices(buy, selected) {
  buy.querySelectorAll('[data-buy-price]').forEach((price, index) => {
    price.style.setProperty('--y', index === selected ? 0 : index < selected ? -110 : 110);
  });
}

function updateWhatsApp(buy) {
  const option = buy.querySelector('[aria-checked="true"]');
  const quantity = buy.querySelector('[data-buy-count]').textContent;
  const text = `Hola, quiero pedir ${buy.dataset.productName} (${option.dataset.ml} ml) x${quantity}.`;
  buy.querySelector('[data-buy-wa]').href = whatsappUrl(text);
}

function chooseSize(buy, option) {
  buy
    .querySelectorAll('[data-buy-option]')
    .forEach((other) => other.setAttribute('aria-checked', String(other === option)));
  const add = buy.querySelector('[data-buy-add]');
  add.dataset.cartItem = option.dataset.item;
  buy.querySelector('[data-buy-size]').textContent = `${option.dataset.ml} ml`;
  buy.querySelector('[data-buy-old]').textContent = option.dataset.old;
  rollPrices(buy, selectedIndex(buy));
  updateWhatsApp(buy);
}

function changeQuantity(buy, delta) {
  const count = buy.querySelector('[data-buy-count]');
  const quantity = Math.max(1, Number(count.textContent) + delta);
  count.textContent = quantity;
  buy.querySelector('[data-buy-add]').dataset.quantity = quantity;
  updateWhatsApp(buy);
}

function resetQuantity(buy) {
  changeQuantity(buy, -Infinity);
}

function handleClick(buy, event) {
  const option = event.target.closest('[data-buy-option]');
  const qty = event.target.closest('[data-buy-qty]');
  if (option) chooseSize(buy, option);
  if (qty) changeQuantity(buy, Number(qty.dataset.buyQty));
}

export function initBuy(signal) {
  const buy = document.querySelector('[data-buy]');
  if (!buy) return;
  buy.addEventListener('click', (event) => handleClick(buy, event), { signal });
  buy.addEventListener('ss:added', () => resetQuantity(buy), { signal });
}
