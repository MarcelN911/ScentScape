/*
 * Seite "Original garantizado": Code eintippen, Schild scannt, danach Bestätigung per WhatsApp.
 * Ein Register zum sofortigen Prüfen gibt es nicht, deshalb bestätigt das Team den Code.
 */
import { LOT_MAX, LOT_PATTERN } from '../../../data/original.js';
import { whatsappUrl } from '../../utils/whatsapp.js';

const SCAN_MS = 1800;
const GLOW = { idle: 'rgb(38 44 99 / .55)', received: 'rgb(240 190 145 / .22)' };

/* Nur Großbuchstaben, Ziffern und Bindestrich */
const cleanCode = (value) =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, LOT_MAX);

function statusOf(lot) {
  if (lot.phase === 'scanning') return 'Verificando…';
  if (lot.phase === 'received') return 'Código recibido';
  return LOT_PATTERN.test(lot.code) ? 'Listo para verificar' : 'Esperando código';
}

function renderStage(lot) {
  const code = lot.root.querySelector('[data-original-code]');
  code.textContent = lot.code || '······';
  code.classList.toggle('is-typed', Boolean(lot.code));
  lot.root.querySelector('[data-original-status]').textContent = statusOf(lot);
  lot.root.classList.toggle('is-scanning', lot.phase === 'scanning');
  lot.root.classList.toggle('is-received', lot.phase === 'received');
  lot.root.querySelector('.split').style.setProperty('--glow', GLOW[lot.phase] ?? GLOW.idle);
}

function renderForm(lot) {
  const ready = LOT_PATTERN.test(lot.code);
  const field = lot.root.querySelector('[data-lot-field]');
  field.classList.toggle('is-ready', ready);
  field.classList.toggle('is-received', lot.phase === 'received');
  field.classList.toggle('is-invalid', lot.invalid);
  lot.root.querySelector('[data-lot-submit]').disabled = !ready || lot.phase === 'scanning';
  lot.root.querySelector('[data-lot-error]').hidden = !lot.invalid;
  lot.root.querySelector('[data-lot-result]').hidden = lot.phase !== 'received';
}

function render(lot) {
  renderStage(lot);
  renderForm(lot);
}

function showResult(lot) {
  const message = `Hola ScentScape, quiero verificar el código de lote ${lot.code} de mi perfume.`;
  lot.root.querySelector('[data-lot-code]').textContent = lot.code;
  lot.root.querySelector('[data-lot-whatsapp]').href = whatsappUrl(message);
  lot.phase = 'received';
  render(lot);
}

function submit(lot, event) {
  event.preventDefault();
  lot.invalid = !LOT_PATTERN.test(lot.code);
  if (lot.invalid || lot.phase === 'scanning') return render(lot);
  lot.phase = 'scanning';
  render(lot);
  lot.timer = setTimeout(() => showResult(lot), SCAN_MS);
  return undefined;
}

function type(lot, input) {
  if (lot.phase === 'scanning') return;
  input.value = cleanCode(input.value);
  Object.assign(lot, { code: input.value, phase: 'idle', invalid: false });
  render(lot);
}

export function initOriginalPage(signal) {
  const root = document.querySelector('[data-original-page]');
  if (!root) return;
  const form = root.querySelector('[data-lot-form]');
  const lot = { root, code: '', phase: 'idle', invalid: false, timer: 0 };
  form.addEventListener('input', (event) => type(lot, event.target), { signal });
  form.addEventListener('submit', (event) => submit(lot, event), { signal });
  signal.addEventListener('abort', () => clearTimeout(lot.timer));
  render(lot);
  setTimeout(() => root.classList.add('is-in'), 80);
}
