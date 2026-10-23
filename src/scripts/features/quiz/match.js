/* Sucht zu den Antworten das passende Parfum. Reine Logik, ohne DOM. */
import { FAMILIES } from '../../../data/families.js';
import { TIME_FAMILIES, VIBE_WORDS } from '../../../data/quiz.js';
import { toPlain } from '../../utils/text.js';

function fitsWho(product, who) {
  if (!who || who === 'Sin etiquetas') return true;
  return who === 'Dama' ? product.gender !== 'C' : product.gender !== 'D';
}

/* Ohne Familie in nexomar zählen die typischen Noten der Familie in Beschreibung/Noten */
function fitsVibe(product, vibe) {
  if (!vibe || product.family === vibe) return true;
  if (product.family) return false;
  const keywords = FAMILIES.find((family) => family.id === vibe).notes;
  return keywords.some((keyword) => product.search.includes(toPlain(keyword)));
}

function candidatesFor(products, answers) {
  const both = products.filter((p) => fitsWho(p, answers.who) && fitsVibe(p, answers.vibe));
  if (both.length) return both;
  const byVibe = products.filter((p) => fitsVibe(p, answers.vibe));
  return byVibe.length ? byVibe : products;
}

function preferTime(candidates, when) {
  const preferred = TIME_FAMILIES[when];
  if (!preferred) return candidates;
  const rank = (product) => (preferred.includes(product.family) ? 0 : 1);
  return [...candidates].sort((a, b) => rank(a) - rank(b));
}

/** alternative: wie oft "Otra opción" gedrückt wurde */
export function matchProduct(products, answers, alternative) {
  const candidates = preferTime(candidatesFor(products, answers), answers.when);
  return candidates[alternative % candidates.length];
}

export function reasonOf(answers) {
  const reasons = [];
  if (answers.vibe) reasons.push(`buscas algo ${VIBE_WORDS[answers.vibe]}`);
  if (answers.when) reasons.push(`lo usarás ${answers.when.toLowerCase()}`);
  if (answers.who && answers.who !== 'Sin etiquetas')
    reasons.push(`es para ${answers.who.toLowerCase()}`);
  if (!reasons.length) return 'Elige tus respuestas y te mostramos tu match al instante.';
  return `Porque ${reasons.join(', ')}.`;
}
