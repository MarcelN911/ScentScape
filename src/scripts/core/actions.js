/*
 * Klick-Aktionen per Attribut: <button data-action="open-cart">.
 * Ein einziger Listener am Dokument, deshalb funktionieren die Aktionen auch
 * für Elemente, die erst nach einem Seitenwechsel im DOM stehen.
 */
const handlers = new Map();

export function registerAction(name, handler) {
  handlers.set(name, handler);
}

function runAction(event) {
  const trigger = event.target.closest('[data-action]');
  const handler = trigger && handlers.get(trigger.dataset.action);
  if (!handler) return;
  event.preventDefault();
  handler(trigger, event);
}

document.addEventListener('click', runAction);
