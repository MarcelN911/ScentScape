/** Kleine Zeile unter dem Namen: "100 ml · LATTAFA" oder bei Gutscheinen "Oro · Para Ana · Hoy". */
export function lineMetaOf(item) {
  const parts = item.giftCard
    ? [item.color, item.recipient && `Para ${item.recipient}`, item.delivery]
    : [`${item.size} ml`, item.brand];
  return parts.filter(Boolean).join(' · ');
}
