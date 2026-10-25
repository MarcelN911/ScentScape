/* Aktualisiert das Zählwerk auf einen neuen Betrag. Gleiche Stellen rollen, neue Stellen kommen hinzu. */
const DIGITS = '0123456789';

function digitSlot() {
  const slot = document.createElement('span');
  slot.className = 'odo__slot';
  const column = document.createElement('span');
  column.className = 'odo__col';
  column.innerHTML = [...DIGITS].map((digit) => `<span>${digit}</span>`).join('');
  slot.append(column);
  return slot;
}

function charSlot(char) {
  const span = document.createElement('span');
  span.className = 'odo__char';
  span.textContent = char;
  return span;
}

function matches(element, char) {
  return /\d/.test(char) ? element?.classList.contains('odo__slot') : element?.textContent === char;
}

function slotFor(odometer, char, index) {
  const current = odometer.children[index];
  if (matches(current, char)) return current;
  const element = /\d/.test(char) ? digitSlot() : charSlot(char);
  if (current) current.replaceWith(element);
  else odometer.append(element);
  return element;
}

export function setOdometer(odometer, text, stepMs = 45) {
  const chars = [...text];
  chars.forEach((char, index) => {
    const column = slotFor(odometer, char, index).querySelector('.odo__col');
    column?.style.setProperty('--y', `${-Number(char) * 10}%`);
    column?.style.setProperty('--d', `${index * stepMs}ms`);
  });
  [...odometer.children].slice(chars.length).forEach((extra) => extra.remove());
}
