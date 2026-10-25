/* Seite "Te asesoramos": Fragen stellen sich im Handy-Chat, eigene Nachrichten gehen an WhatsApp. */
import { initChat } from '../chat/questions.js';

export function initFaqPage(signal) {
  const root = document.querySelector('[data-faq-page]');
  if (!root) return;
  const questions = JSON.parse(root.querySelector('[data-chat-data]').textContent);
  initChat(root, questions, signal);
  setTimeout(() => root.classList.add('is-in'), 80);
}
