/* Die Summe des aktuellen Warenkorbs, mit Rabattcode, Gift Card und Versand-Einstellungen. */
import { getSettings } from '../checkout/settings.js';
import { getRule } from './discount.js';
import { getGiftCard } from './gift-redeem.js';
import { summaryOf } from './pricing.js';
import { getItems } from './store.js';

export function currentSummary() {
  const options = { envio: getSettings().envio, giftCard: getGiftCard() };
  return summaryOf(getItems(), getRule(), options);
}
