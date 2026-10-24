/** Kleine Zeile unter dem Namen: "100 ml · Lattafa" oder bei Gutscheinen "Burdeos · Para Ana". */
export function lineMetaOf(item) {
  const parts = item.giftCard
    ? [item.color, item.recipient && `Para ${item.recipient}`]
    : [item.size && `${item.size} ml`, item.brand];
  return parts.filter(Boolean).join(' · ');
}
