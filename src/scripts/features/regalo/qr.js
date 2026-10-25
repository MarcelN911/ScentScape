/* QR-Code als SVG-Pfad: jedes dunkle Feld wird ein 1×1-Quadrat. */
import qrcode from 'qrcode-generator';

function darkCells(qr, size) {
  let path = '';
  for (let row = 0; row < size; row += 1) {
    for (let col = 0; col < size; col += 1) {
      if (qr.isDark(row, col)) path += `M${col} ${row}h1v1h-1z`;
    }
  }
  return path;
}

/** Zeichnet den QR-Code für text in das <svg> */
export function drawQr(svg, text) {
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  const size = qr.getModuleCount();
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
  svg.querySelector('path').setAttribute('d', darkCells(qr, size));
}
