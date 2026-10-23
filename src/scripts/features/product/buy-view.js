/* Zeigt Größe und Menge im Kaufbereich und in der Kaufleiste unten an. */
import { formatCOP } from '../../utils/format.js';
import { whatsappUrl } from '../../utils/whatsapp.js';

const ADDI_INSTALLMENTS = 4;

export function findBuyElements(root) {
  return {
    root,
    options: [...root.querySelectorAll('[data-size-option]')],
    price: root.querySelector('[data-buy-price]'),
    quantity: root.querySelector('[data-buy-qty]'),
    add: root.querySelector('[data-buy-add]'),
    addLabel: root.querySelector('[data-buy-add-label]'),
    whatsapp: root.querySelector('[data-buy-whatsapp]'),
    addi: root.querySelector('[data-buy-addi]'),
    stickyDetail: document.querySelector('[data-sticky-detail]'),
    stickyAdd: document.querySelector('[data-sticky-add]'),
  };
}

function restartAnimation(element) {
  element.classList.remove('is-updated');
  void element.offsetWidth;
  element.classList.add('is-updated');
}

function renderPrice(ui, option, quantity) {
  const total = Number(option.dataset.price) * quantity;
  ui.price.firstChild.textContent = `${formatCOP(total)} `;
  restartAnimation(ui.price);
  if (ui.addi) ui.addi.textContent = formatCOP(total / ADDI_INSTALLMENTS);
  if (ui.stickyDetail) {
    ui.stickyDetail.textContent = `${option.dataset.sizeLabel} · ${formatCOP(total)}`;
  }
}

function renderButtons(ui, option, quantity) {
  [ui.add, ui.stickyAdd].filter(Boolean).forEach((button) => {
    button.dataset.cartItem = option.dataset.cartItem;
    button.dataset.quantity = String(quantity);
  });
  const name = ui.root.dataset.productName;
  const message = `Hola ScentScape, me interesa ${name} (${option.dataset.sizeLabel}).`;
  ui.whatsapp.href = whatsappUrl(message);
}

export function renderBuy(ui, state) {
  const option = ui.options[state.index];
  ui.options.forEach((other) => other.classList.toggle('is-active', other === option));
  ui.quantity.textContent = String(state.quantity);
  renderPrice(ui, option, state.quantity);
  renderButtons(ui, option, state.quantity);
}

export function showAdded(ui) {
  ui.add.classList.add('is-added');
  ui.addLabel.textContent = '✓ ¡Añadido!';
}

export function resetAdded(ui) {
  ui.add.classList.remove('is-added');
  ui.addLabel.textContent = 'Añadir al carrito';
}
