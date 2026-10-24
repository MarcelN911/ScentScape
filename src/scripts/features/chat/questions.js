/*
 * Liste mit Fragen neben dem Handy ([data-chat-question]): Klick stellt die Frage im Chat.
 * Beantwortete Fragen werden kursiv und bekommen ein ✓.
 */
import { whatsappUrl } from '../../utils/whatsapp.js';
import { askQuestion, sendOwnMessage } from './chat.js';

function lockQuestions(root, locked) {
  root.querySelectorAll('[data-chat-question]').forEach((button) => (button.disabled = locked));
}

async function ask(root, phone, button, questions) {
  lockQuestions(root, true);
  await askQuestion(phone, questions[Number(button.dataset.chatQuestion)]);
  button.classList.add('is-asked');
  lockQuestions(root, false);
}

/* Senden-Knopf erscheint, sobald Text im Feld steht; sonst Kamera und Mikrofon */
function toggleSend(phone, input) {
  const empty = !input.value.trim();
  phone.querySelector('[data-chat-send]').hidden = empty;
  phone.querySelector('[data-chat-icons]').hidden = !empty;
}

function submitOwn(phone, input, event) {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  sendOwnMessage(phone, text, whatsappUrl(text));
  input.value = '';
  toggleSend(phone, input);
}

function bindOwnMessage(phone, signal) {
  const form = phone.querySelector('[data-chat-form]');
  if (!form) return;
  const input = form.querySelector('[data-chat-input]');
  input.addEventListener('input', () => toggleSend(phone, input), { signal });
  form.addEventListener('submit', (event) => submitOwn(phone, input, event), { signal });
}

/** root: Bereich mit Fragen und Handy · questions: [{ question, answer }] */
export function initChat(root, questions, signal) {
  const phone = root.querySelector('[data-phone]');
  if (!phone) return;
  root.addEventListener(
    'click',
    (event) => {
      const button = event.target.closest('[data-chat-question]');
      if (button && !button.disabled) ask(root, phone, button, questions);
    },
    { signal },
  );
  bindOwnMessage(phone, signal);
}
