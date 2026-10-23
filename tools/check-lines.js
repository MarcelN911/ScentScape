import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';

const MAX_LINES = 400;
const ROOTS = ['src', 'tools'];
const EXTENSIONS = new Set(['.astro', '.css', '.js', '.mjs']);

function collectFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return collectFiles(path);
    return EXTENSIONS.has(extname(path)) ? [path] : [];
  });
}

function countLines(path) {
  return readFileSync(path, 'utf8').split('\n').length;
}

function findOversized(files) {
  return files
    .map((path) => ({ path, lines: countLines(path) }))
    .filter((file) => file.lines > MAX_LINES);
}

function report(oversized) {
  if (oversized.length === 0) return console.log(`✓ Alle Dateien ≤ ${MAX_LINES} Zeilen`);
  oversized.forEach((file) => console.error(`✗ ${file.path}: ${file.lines} Zeilen`));
  process.exitCode = 1;
}

report(findOversized(ROOTS.flatMap(collectFiles)));
