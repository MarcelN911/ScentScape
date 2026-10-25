/*
 * Seite "Regalo": so sieht die beschenkte Person ihre Gift Card.
 * Die Angaben kommen aus dem Link, den ScentScape nach dem Kauf verschickt, z. B.
 * /regalo/?para=María&de=Camila&monto=200000&codigo=SC-K7M2-9QXP&color=burdeos&hasta=2027-10-18&mensaje=…
 * Ohne Link-Angaben zeigt die Seite ein Beispiel.
 */

export const REGALO_EXAMPLE = {
  to: 'ti',
  from: 'ScentScape',
  amount: 200000,
  code: '',
  color: 0,
  until: '',
  message: 'Un aroma te espera. Elige tu perfume favorito, en la tienda o en línea.',
};

export const REGALO_LIMITS = { name: 30, message: 160, code: 20, amount: 5000000 };

/* Zeitpunkte der Öffnung in ms: Lasche auf, Karte hoch, Umschlag weg, Betrag rollt, Rückseite, fertig */
export const REGALO_STEPS = [
  [0, { phase: 1 }],
  [450, { flap: true }],
  [850, { phase: 2 }],
  [2000, { phase: 3 }],
  [2300, { rolled: true }],
  [3900, { phase: 4 }],
  [5600, { phase: 5 }],
];
