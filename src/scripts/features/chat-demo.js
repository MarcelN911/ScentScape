import { CHAT_MESSAGES, CHAT_WORDS } from '../../data/chat.js';

const DELAY = { typing: 1300, customer: 1100, restart: 4200, afterReset: 700, start: 600 };
const state = { shown: 0, typing: false, word: 0, visible: false, timer: 0 };
let ui;

function findElements(root) {
  return {
    messages: root.querySelector('[data-chat-messages]'),
    typing: root.querySelector('[data-chat-typing]'),
    status: root.querySelector('[data-chat-status]'),
    word: root.querySelector('[data-chat-word]'),
    bubble: root.querySelector('[data-chat-bubble]'),
  };
}

function showWord(index) {
  state.word = index % CHAT_WORDS.length;
  ui.word.textContent = `${CHAT_WORDS[state.word]}?`;
  ui.word.style.animation = 'none';
  void ui.word.offsetWidth;
  ui.word.style.animation = '';
}

function setTyping(typing) {
  state.typing = typing;
  ui.typing.hidden = !typing;
  ui.status.textContent = typing ? 'escribiendo…' : 'en línea';
}

function appendMessage(message) {
  const bubble = ui.bubble.content.firstElementChild.cloneNode(true);
  bubble.textContent = message.text;
  bubble.classList.toggle('is-customer', message.who === 'c');
  ui.messages.insertBefore(bubble, ui.typing);
  state.shown += 1;
}

function resetConversation() {
  ui.messages.querySelectorAll('.chat__bubble').forEach((bubble) => bubble.remove());
  state.shown = 0;
  showWord(state.word + 1);
}

function schedule(step, ms) {
  clearTimeout(state.timer);
  state.timer = setTimeout(step, ms);
}

function finishTyping() {
  setTyping(false);
  appendMessage(CHAT_MESSAGES[state.shown]);
  return DELAY.typing;
}

function sendCustomerMessage() {
  if (state.shown % 2 === 0) showWord(state.word + 1);
  appendMessage(CHAT_MESSAGES[state.shown]);
  return DELAY.customer;
}

function nextStep() {
  if (!state.visible) return;
  if (state.typing) return schedule(nextStep, finishTyping());
  if (state.shown >= CHAT_MESSAGES.length) return schedule(restart, DELAY.restart);
  if (CHAT_MESSAGES[state.shown].who === 's') {
    setTyping(true);
    return schedule(nextStep, DELAY.typing);
  }
  schedule(nextStep, sendCustomerMessage());
}

function restart() {
  resetConversation();
  schedule(nextStep, DELAY.afterReset);
}

function onVisibility([entry]) {
  state.visible = entry.isIntersecting;
  if (state.visible) schedule(nextStep, DELAY.start);
  else clearTimeout(state.timer);
}

export function initChatDemo() {
  const root = document.querySelector('[data-chat]');
  if (!root) return;
  ui = findElements(root);
  new IntersectionObserver(onVisibility, { threshold: 0.2 }).observe(root);
}
