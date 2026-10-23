/* Lot-Prüfung: Code prüfen und als WhatsApp-Nachricht vorbereiten. */
import { LOT_PATTERN } from '../../data/original.js';
import { whatsappUrl } from '../utils/whatsapp.js';

function showResult(section, code) {
  const valid = LOT_PATTERN.test(code);
  section.querySelector('[data-lot-ok]').hidden = !valid;
  section.querySelector('[data-lot-error]').hidden = valid;
  if (!valid) return;
  section.querySelector('[data-lot-code]').textContent = code;
  const message = `Hola ScentScape, quiero verificar el código de lote ${code} de mi perfume.`;
  section.querySelector('[data-lot-whatsapp]').href = whatsappUrl(message);
}

export function initLotCheck(signal) {
  const form = document.querySelector('[data-lot-form]');
  if (!form) return;
  const section = form.closest('section');
  form.addEventListener(
    'submit',
    (event) => {
      event.preventDefault();
      showResult(section, form.elements.lot.value.trim().toUpperCase());
    },
    { signal },
  );
}
