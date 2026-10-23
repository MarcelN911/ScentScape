/*
 * Produktbeschreibungen aus nexomar enthalten etwas Markdown (**fett**) und Zeilenumbrüche.
 * Hier wird daraus sicheres HTML (alles andere wird maskiert) oder reiner Text.
 */
const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(text) {
  return String(text ?? '').replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

function paragraphsOf(text) {
  return String(text ?? '')
    .split(/\n\s*\n|\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function descriptionHtml(text) {
  return paragraphsOf(text)
    .map((line) => escapeHtml(line).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'))
    .map((line) => `<p>${line}</p>`)
    .join('');
}

export function plainDescription(text) {
  return paragraphsOf(text).join(' ').replace(/\*\*/g, '');
}
