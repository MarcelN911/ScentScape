/*
 * "Descubre": großer Schriftzug wandert seitwärts, Karten kippen von unten herein,
 * die Bilder in den Karten bewegen sich leicht gegen die Scrollrichtung.
 */
import { centerOffset, easeOut, onScrollProgress, VISIBLE_RANGE } from '../../effects/scroll.js';

function driftGhost(ghost, progress) {
  ghost.style.transform = `translateX(${((0.5 - progress) * Number(ghost.dataset.discoverDrift)).toFixed(2)}vw)`;
}

function tipIn(tip, progress) {
  const eased = easeOut(progress);
  tip.style.opacity = (0.1 + eased * 0.9).toFixed(3);
  tip.style.transform = `perspective(1400px) translateY(${((1 - eased) * 160).toFixed(1)}px) rotateX(${((1 - eased) * 16).toFixed(2)}deg) scale(${(0.88 + eased * 0.12).toFixed(4)})`;
}

function floatArt(art) {
  const strength = Number(art.dataset.discoverParallax);
  const offset = centerOffset(art.parentElement);
  art.style.transform = `translateY(${(offset * strength * 2.4).toFixed(1)}px) rotate(${(offset * strength * 0.08).toFixed(2)}deg)`;
}

function animateCard(card) {
  const row = Number(card.dataset.discoverCard);
  const range = { start: `top bottom-=${row * 80}`, end: () => `+=${innerHeight * 0.55}` };
  const tip = card.querySelector('[data-discover-tip]');
  onScrollProgress(card, range, (progress) => tipIn(tip, progress));
  const art = card.querySelector('[data-discover-parallax]');
  onScrollProgress(card, VISIBLE_RANGE, () => floatArt(art));
}

export function animateDiscover() {
  const section = document.querySelector('[data-discover]');
  if (!section) return;
  const ghost = section.querySelector('[data-discover-drift]');
  onScrollProgress(section, VISIBLE_RANGE, (progress) => driftGhost(ghost, progress));
  section.querySelectorAll('[data-discover-card]').forEach(animateCard);
}
