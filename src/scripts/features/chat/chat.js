/*
 * Chat im Handy: Frage erscheint rechts, ScentScape "schreibt", dann kommt die Antwort.
 * Während geschrieben wird, sind die Fragen gesperrt.
 */
const TYPING_MS = 1400;

function nowText() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function addBubble(phone, text, fromMe) {
  const body = phone.querySelector('[data-chat-body]');
  const bubble = phone.querySelector('[data-bubble]').content.firstElementChild.cloneNode(true);
  bubble.classList.add(fromMe ? 'bubble--me' : 'bubble--them');
  bubble.querySelector('.bubble__text').textContent = text;
  bubble.querySelector('.bubble__time').textContent = `${nowText()}${fromMe ? ' ✓✓' : ''}`;
  body.insertBefore(bubble, phone.querySelector('[data-chat-wa]'));
  body.scrollTop = body.scrollHeight;
}

function setTyping(phone, typing) {
  phone.classList.toggle('is-typing', typing);
  phone.querySelector('[data-chat-typing]').hidden = !typing;
  const status = typing ? 'escribiendo…' : 'Sara y Brayan · en línea';
  phone.querySelector('[data-chat-status]').textContent = status;
  const body = phone.querySelector('[data-chat-body]');
  body.scrollTop = body.scrollHeight;
}

/** Stellt eine Frage. Gibt ein Promise zurück, das nach der Antwort erfüllt ist. */
export function askQuestion(phone, { question, answer }) {
  addBubble(phone, question, true);
  setTyping(phone, true);
  return new Promise((resolve) => {
    setTimeout(() => {
      setTyping(phone, false);
      addBubble(phone, answer, false);
      resolve();
    }, TYPING_MS);
  });
}

/** Eigene Nachricht: erscheint im Chat und öffnet WhatsApp mit dem Text */
export function sendOwnMessage(phone, text, url) {
  addBubble(phone, text, true);
  const notice = phone.querySelector('[data-chat-wa]');
  notice.hidden = false;
  setTimeout(() => (notice.hidden = true), 3200);
  window.open(url, '_blank', 'noopener');
}
