/*
 * Runde Blende am Burger-Knopf. Menü, Vorhang und Intro der Startseite öffnen und schließen
 * damit alle gleich: der Kreis wächst vom Burger aus über den Bildschirm oder schrumpft dorthin zurück.
 * Ab 1080px Breite ist der Burger ausgeblendet, dann liegt die Mitte oben rechts.
 */
export const EASE_CIRCLE = 'cubic-bezier(0.7, 0, 0.2, 1)';

/** Mitte des Burgers (x, y) und der Radius r, der den ganzen Bildschirm abdeckt */
export function burgerCircle() {
  const box = document.querySelector('.site-header__burger')?.getBoundingClientRect();
  const visible = box && box.width > 0;
  const x = visible ? box.left + box.width / 2 : innerWidth - 40;
  const y = visible ? box.top + box.height / 2 : 40;
  /* + 2px, damit die Kante des Kreises nicht genau auf der Ecke liegt und dort ein Pixel durchscheint */
  const r = Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))) + 2;
  return { x, y, r };
}

/** clip-path für einen Kreis mit Radius `radius` um die Mitte von `circle` */
export function circleClip(circle, radius) {
  return `circle(${radius}px at ${circle.x}px ${circle.y}px)`;
}
